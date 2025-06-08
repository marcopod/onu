import { NextRequest, NextResponse } from 'next/server';
import { registerUser, setAuthCookie } from '@/lib/auth';
// Use the same database module as auth.ts
let dbModule;
try {
  if (process.env.POSTGRES_URL && process.env.POSTGRES_URL.includes('localhost')) {
    dbModule = require('@/lib/mock-db');
  } else if (process.env.POSTGRES_URL) {
    dbModule = require('@/lib/db');
  } else {
    dbModule = require('@/lib/mock-db');
  }
} catch (error) {
  console.log('Database not available, using mock database for development');
  dbModule = require('@/lib/mock-db');
}

const {
  createUserProfile,
  createEmergencyContacts,
  createPhysicalHealth,
  createMedications,
  createMentalHealth,
  createHarassmentExperiences,
  initializeDatabase
} = dbModule;
import { CompleteRegistrationData, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();

    const registrationData: CompleteRegistrationData = await request.json();

    // Debug: Log the received data
    console.log('=== REGISTRATION DEBUG ===');
    console.log('Received registration data:', JSON.stringify(registrationData, null, 2));
    console.log('Step1 data:', registrationData.step1);
    console.log('Step1 fullName:', registrationData.step1?.fullName);
    console.log('Step1 email:', registrationData.step1?.email);
    console.log('Step1 password:', registrationData.step1?.password ? '[PRESENT]' : '[MISSING]');
    console.log('========================');

    // Validate required data
    if (!registrationData.step1) {
      console.log('ERROR: Missing step1 data');
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing user authentication data'
      }, { status: 400 });
    }

    const { step1, step2, step3, step4, step5 } = registrationData;

    // Validate step 1 (authentication data)
    if (!step1.fullName || !step1.email || !step1.password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields: fullName, email, password'
      }, { status: 400 });
    }

    if (step1.password !== step1.confirmPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Passwords do not match'
      }, { status: 400 });
    }

    // Register the user (this will validate email and password)
    const user = await registerUser({
      email: step1.email,
      password: step1.password,
      fullName: step1.fullName
    });

    // Create user profile if step2 data exists
    if (step2) {
      await createUserProfile({
        userId: user.id,
        age: step2.age ? parseInt(step2.age) : undefined,
        gender: step2.gender || undefined,
        sexualOrientation: step2.sexualOrientation || undefined,
        address: step2.address || undefined,
        educationLevel: step2.educationLevel || undefined,
        occupation: step2.occupation || undefined,
        hobbies: step2.hobbies || undefined,
        frequentPlaces: step2.frequentPlaces || undefined,
        // Note: File uploads would need to be handled separately
        identityDocumentUrl: undefined, // TODO: Implement file upload
        profilePhotoUrl: undefined // TODO: Implement file upload
      });

      // Create emergency contacts
      if (step2.emergencyContacts && step2.emergencyContacts.length > 0) {
        await createEmergencyContacts(user.id, step2.emergencyContacts);
      }
    }

    // Create physical health data if step3 exists
    if (step3) {
      await createPhysicalHealth({
        userId: user.id,
        weight: step3.weight ? parseFloat(step3.weight) : undefined,
        height: step3.height ? parseFloat(step3.height) : undefined,
        bloodType: step3.bloodType || undefined,
        hasDisability: step3.hasDisability || false,
        disabilityDescription: step3.disabilityDescription || undefined,
        chronicConditions: step3.chronicConditions || undefined,
        medicalAllergies: step3.allergies?.medical || undefined,
        foodAllergies: step3.allergies?.food || undefined,
        environmentalAllergies: step3.allergies?.environmental || undefined
      });

      // Create medications
      if (step3.currentMedications && step3.currentMedications.length > 0) {
        await createMedications(user.id, step3.currentMedications.map(med => ({
          ...med,
          type: 'general'
        })));
      }
    }

    // Create mental health data if step4 exists
    if (step4) {
      await createMentalHealth({
        userId: user.id,
        psychiatricConditions: step4.psychiatricConditions || undefined,
        hasAnxietyAttacks: step4.hasAnxietyAttacks || false,
        anxietyFrequency: step4.anxietyFrequency || undefined,
        familyHistory: step4.familyHistory || undefined
      });

      // Create psychiatric medications
      if (step4.psychiatricMedications && step4.psychiatricMedications.length > 0) {
        await createMedications(user.id, step4.psychiatricMedications.map(med => ({
          ...med,
          type: 'psychiatric'
        })));
      }
    }

    // Create harassment experiences if step5 exists
    if (step5 && step5.experiences && step5.experiences.length > 0) {
      const validExperiences = step5.experiences.filter(exp => 
        exp.category && exp.description
      );
      
      if (validExperiences.length > 0) {
        await createHarassmentExperiences(user.id, validExperiences);
        // Note: Evidence files would need to be handled separately
      }
    }

    // Generate login token for the new user
    console.log('Generating login token for user:', step1.email);
    const { token } = await import('@/lib/auth').then(auth =>
      auth.loginUser(step1.email, step1.password)
    );
    console.log('Login token generated:', token ? 'SUCCESS' : 'FAILED');

    // Set auth cookie using NextResponse
    console.log('Setting auth cookie...');

    const response = NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          isVerified: false
        },
        token
      },
      message: 'Registration completed successfully'
    });

    // Set the cookie in the response
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    console.log('Auth cookie set in response');
    return response;

  } catch (error: any) {
    console.error('Registration error:', error);
    
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error.message || 'Registration failed'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
