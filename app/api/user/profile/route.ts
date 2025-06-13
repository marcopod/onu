import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie');
    let token = null;

    if (cookieHeader) {
      console.log('Cookie header:', cookieHeader);
      const cookies = cookieHeader.split(';').map(c => c.trim());
      console.log('Parsed cookies:', cookies);

      // Try both 'auth_token' and 'auth-token' formats
      let authCookie = cookies.find(c => c.startsWith('auth_token='));
      if (!authCookie) {
        authCookie = cookies.find(c => c.startsWith('auth-token='));
      }

      if (authCookie) {
        token = authCookie.split('=')[1];
        console.log('Found auth token in cookies');
      } else {
        console.log('No auth token found in cookies');
      }
    }

    // Also check Authorization header as fallback
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get current user
    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    console.log('Fetching complete profile for user:', user.id);

    // Fetch user basic info
    const userInfo = await sql`
      SELECT id, email, full_name, is_verified, created_at, last_login
      FROM users 
      WHERE id = ${user.id}
    `;

    if (userInfo.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userInfo.rows[0];

    // Fetch user profile
    const profile = await sql`
      SELECT age, gender, sexual_orientation, address, education_level, 
             occupation, hobbies, frequent_places, identity_document_url, 
             profile_photo_url, created_at, updated_at
      FROM user_profiles 
      WHERE user_id = ${user.id}
    `;

    // Fetch emergency contacts
    const emergencyContacts = await sql`
      SELECT name, relationship, phone, created_at
      FROM emergency_contacts 
      WHERE user_id = ${user.id}
      ORDER BY created_at ASC
    `;

    // Fetch physical health
    const physicalHealth = await sql`
      SELECT weight, height, blood_type, has_disability, disability_description,
             chronic_conditions, medical_allergies, food_allergies, 
             environmental_allergies, created_at, updated_at
      FROM physical_health 
      WHERE user_id = ${user.id}
    `;

    // Fetch medications
    const medications = await sql`
      SELECT name, dose, frequency, medication_type, created_at
      FROM medications 
      WHERE user_id = ${user.id}
      ORDER BY medication_type, name
    `;

    // Fetch mental health
    const mentalHealth = await sql`
      SELECT psychiatric_conditions, has_anxiety_attacks, anxiety_frequency,
             family_history, created_at, updated_at
      FROM mental_health 
      WHERE user_id = ${user.id}
    `;

    // Fetch harassment experiences with evidence files
    const experiences = await sql`
      SELECT he.id, he.category, he.location, he.incident_date, he.description,
             he.reported_to_authorities, he.created_at,
             COALESCE(
               JSON_AGG(
                 JSON_BUILD_OBJECT(
                   'id', ef.id,
                   'file_url', ef.file_url,
                   'file_name', ef.file_name,
                   'file_type', ef.file_type,
                   'file_size', ef.file_size
                 ) ORDER BY ef.created_at
               ) FILTER (WHERE ef.id IS NOT NULL),
               '[]'::json
             ) as evidence_files
      FROM harassment_experiences he
      LEFT JOIN evidence_files ef ON he.id = ef.experience_id
      WHERE he.user_id = ${user.id}
      GROUP BY he.id, he.category, he.location, he.incident_date, he.description,
               he.reported_to_authorities, he.created_at
      ORDER BY he.created_at DESC
    `;

    // Build complete profile object
    const completeProfile = {
      user: {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        isVerified: userData.is_verified,
        createdAt: userData.created_at,
        lastLogin: userData.last_login
      },
      profile: profile.rows.length > 0 ? {
        age: profile.rows[0].age,
        gender: profile.rows[0].gender,
        sexualOrientation: profile.rows[0].sexual_orientation,
        address: profile.rows[0].address,
        educationLevel: profile.rows[0].education_level,
        occupation: profile.rows[0].occupation,
        hobbies: profile.rows[0].hobbies,
        frequentPlaces: profile.rows[0].frequent_places,
        identityDocumentUrl: profile.rows[0].identity_document_url,
        profilePhotoUrl: profile.rows[0].profile_photo_url,
        createdAt: profile.rows[0].created_at,
        updatedAt: profile.rows[0].updated_at
      } : null,
      emergencyContacts: emergencyContacts.rows.map(contact => ({
        name: contact.name,
        relationship: contact.relationship,
        phone: contact.phone,
        createdAt: contact.created_at
      })),
      physicalHealth: physicalHealth.rows.length > 0 ? {
        weight: physicalHealth.rows[0].weight,
        height: physicalHealth.rows[0].height,
        bloodType: physicalHealth.rows[0].blood_type,
        hasDisability: physicalHealth.rows[0].has_disability,
        disabilityDescription: physicalHealth.rows[0].disability_description,
        chronicConditions: physicalHealth.rows[0].chronic_conditions,
        allergies: {
          medical: physicalHealth.rows[0].medical_allergies,
          food: physicalHealth.rows[0].food_allergies,
          environmental: physicalHealth.rows[0].environmental_allergies
        },
        createdAt: physicalHealth.rows[0].created_at,
        updatedAt: physicalHealth.rows[0].updated_at
      } : null,
      medications: medications.rows.map(med => ({
        name: med.name,
        dose: med.dose,
        frequency: med.frequency,
        type: med.medication_type,
        createdAt: med.created_at
      })),
      mentalHealth: mentalHealth.rows.length > 0 ? {
        psychiatricConditions: mentalHealth.rows[0].psychiatric_conditions,
        hasAnxietyAttacks: mentalHealth.rows[0].has_anxiety_attacks,
        anxietyFrequency: mentalHealth.rows[0].anxiety_frequency,
        familyHistory: mentalHealth.rows[0].family_history,
        createdAt: mentalHealth.rows[0].created_at,
        updatedAt: mentalHealth.rows[0].updated_at
      } : null,
      harassmentExperiences: experiences.rows.map(exp => ({
        id: exp.id,
        category: exp.category,
        location: exp.location,
        incidentDate: exp.incident_date,
        description: exp.description,
        reportedToAuthorities: exp.reported_to_authorities,
        evidenceFiles: exp.evidence_files,
        createdAt: exp.created_at
      }))
    };

    console.log('Profile data fetched successfully for user:', user.id);

    return NextResponse.json({
      success: true,
      data: completeProfile,
      message: 'Complete profile data retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
