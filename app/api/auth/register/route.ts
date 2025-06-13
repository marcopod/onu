import { NextRequest, NextResponse } from 'next/server';
import { registerUser, setAuthCookie } from '@/lib/auth';
import { moveTempFilesToUser, TempUploadResult } from '@/lib/file-upload';
import { sql } from '@vercel/postgres';
// Force use of real database for registration data
let dbModule;
try {
  // Check if we have database environment variables
  const hasPostgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (hasPostgresUrl) {
    // Always use real database when URL is available
    console.log('Registration: Using real PostgreSQL database');
    dbModule = require('@/lib/db');
  } else {
    // No database configured, use mock
    console.log('Registration: No database URL configured, using mock database');
    dbModule = require('@/lib/mock-db');
  }
} catch (error) {
  console.log('Registration: Database connection failed, using mock database for development:', error.message);
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
    console.log('=== REGISTRATION API DEBUG ===');
    console.log('Received registration data keys:', Object.keys(registrationData));
    console.log('Step1 data:', registrationData.step1);
    console.log('Step1 fullName:', registrationData.step1?.fullName);
    console.log('Step1 email:', registrationData.step1?.email);
    console.log('Step1 password:', registrationData.step1?.password ? '[PRESENT]' : '[MISSING]');

    console.log('Step2 exists:', !!registrationData.step2);
    if (registrationData.step2) {
      console.log('Step2 age:', registrationData.step2.age);
      console.log('Step2 gender:', registrationData.step2.gender);
      console.log('Step2 emergency contacts count:', registrationData.step2.emergencyContacts?.length || 0);
    }

    console.log('Step3 exists:', !!registrationData.step3);
    if (registrationData.step3) {
      console.log('Step3 weight:', registrationData.step3.weight);
      console.log('Step3 height:', registrationData.step3.height);
      console.log('Step3 medications count:', registrationData.step3.currentMedications?.length || 0);
    }

    console.log('Step4 exists:', !!registrationData.step4);
    if (registrationData.step4) {
      console.log('Step4 psychiatric conditions:', registrationData.step4.psychiatricConditions);
      console.log('Step4 psychiatric medications count:', registrationData.step4.psychiatricMedications?.length || 0);
    }

    console.log('Step5 exists:', !!registrationData.step5);
    if (registrationData.step5) {
      console.log('Step5 experiences count:', registrationData.step5.experiences?.length || 0);
    }
    console.log('===============================');

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

    // Check if user already exists first
    let user;
    try {
      user = await registerUser({
        email: step1.email,
        password: step1.password,
        fullName: step1.fullName
      });
      console.log('User registered successfully, processing files...');
    } catch (error: any) {
      // If user already exists, try to get the existing user
      if (error.message && error.message.includes('duplicate key')) {
        console.log('User already exists, checking if we can continue with profile data...');

        // Get the existing user
        const existingUserQuery = await sql`
          SELECT id, email, full_name, created_at
          FROM users
          WHERE email = ${step1.email}
        `;

        if (existingUserQuery.rows.length > 0) {
          user = {
            id: existingUserQuery.rows[0].id,
            email: existingUserQuery.rows[0].email,
            fullName: existingUserQuery.rows[0].full_name,
            createdAt: existingUserQuery.rows[0].created_at
          };
          console.log('Using existing user for profile data processing...');
        } else {
          throw error; // Re-throw if we can't find the user
        }
      } else {
        throw error; // Re-throw if it's not a duplicate key error
      }
    }

    // Process uploaded files if they exist
    let profilePhotoUrl: string | undefined;
    let identityDocumentUrl: string | undefined;

    // Handle profile photo and identity document from step1
    const tempFiles: TempUploadResult[] = [];

    if (step1.profilePhoto && typeof step1.profilePhoto === 'object' && 'tempId' in step1.profilePhoto) {
      tempFiles.push(step1.profilePhoto as TempUploadResult);
    }

    if (step1.identityDocument && typeof step1.identityDocument === 'object' && 'tempId' in step1.identityDocument) {
      tempFiles.push(step1.identityDocument as TempUploadResult);
    }

    if (tempFiles.length > 0) {
      console.log('Moving temp files to permanent location...');
      const permanentFiles = await moveTempFilesToUser(tempFiles, user.id.toString());

      // Map files to their purposes
      for (let i = 0; i < tempFiles.length; i++) {
        const tempFile = tempFiles[i];
        const permanentFile = permanentFiles[i];

        if (tempFile.uploadType === 'profile') {
          profilePhotoUrl = permanentFile?.url;
        } else if (tempFile.uploadType === 'identity') {
          identityDocumentUrl = permanentFile?.url;
        }
      }
    }

    // Create or update user profile if step2 data exists and has meaningful data
    if (step2) {
      const hasStep2Data = step2.age || step2.gender || step2.address || step2.educationLevel ||
                          step2.occupation || step2.hobbies || step2.frequentPlaces ||
                          profilePhotoUrl || identityDocumentUrl;

      if (hasStep2Data) {
        console.log('Processing user profile with step2 data...');

        // Check if profile already exists
        const existingProfile = await sql`
          SELECT id FROM user_profiles WHERE user_id = ${user.id}
        `;

        if (existingProfile.rows.length > 0) {
          console.log('Updating existing user profile...');
          await sql`
            UPDATE user_profiles SET
              age = ${step2.age ? parseInt(step2.age) : null},
              gender = ${step2.gender || null},
              sexual_orientation = ${step2.sexualOrientation || null},
              address = ${step2.address || null},
              education_level = ${step2.educationLevel || null},
              occupation = ${step2.occupation || null},
              hobbies = ${step2.hobbies || null},
              frequent_places = ${step2.frequentPlaces || null},
              identity_document_url = ${identityDocumentUrl || null},
              profile_photo_url = ${profilePhotoUrl || null},
              updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ${user.id}
          `;
        } else {
          console.log('Creating new user profile...');
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
            identityDocumentUrl: identityDocumentUrl,
            profilePhotoUrl: profilePhotoUrl
          });
        }
        console.log('User profile processed successfully');
      } else {
        console.log('Skipping user profile processing - no meaningful data provided');
      }

      // Create or update emergency contacts only if they have valid data
      if (step2.emergencyContacts && step2.emergencyContacts.length > 0) {
        const validContacts = step2.emergencyContacts.filter(contact =>
          contact.name?.trim() && contact.relationship?.trim() && contact.phone?.trim()
        );

        if (validContacts.length > 0) {
          console.log(`Processing ${validContacts.length} emergency contacts...`);

          // Delete existing contacts first (to avoid duplicates)
          await sql`DELETE FROM emergency_contacts WHERE user_id = ${user.id}`;

          // Create new contacts
          await createEmergencyContacts(user.id, validContacts);
          console.log('Emergency contacts processed successfully');
        } else {
          console.log('Skipping emergency contacts - no valid contacts provided');
        }
      }
    }

    // Create physical health data if step3 exists and has meaningful data
    if (step3) {
      const hasStep3Data = step3.weight || step3.height || step3.bloodType ||
                          step3.hasDisability || step3.disabilityDescription ||
                          step3.chronicConditions || step3.allergies?.medical ||
                          step3.allergies?.food || step3.allergies?.environmental;

      if (hasStep3Data) {
        console.log('Creating physical health record...');
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
        console.log('Physical health record created successfully');
      } else {
        console.log('Skipping physical health creation - no meaningful data provided');
      }

      // Create medications only if they have valid data
      if (step3.currentMedications && step3.currentMedications.length > 0) {
        const validMedications = step3.currentMedications.filter(med =>
          med.name?.trim()
        );

        if (validMedications.length > 0) {
          console.log(`Creating ${validMedications.length} general medications...`);
          await createMedications(user.id, validMedications.map(med => ({
            ...med,
            type: 'general'
          })));
          console.log('Medications created successfully');
        } else {
          console.log('Skipping medications - no valid medications provided');
        }
      }
    }

    // Create mental health data if step4 exists and has meaningful data
    if (step4) {
      const hasStep4Data = step4.psychiatricConditions || step4.hasAnxietyAttacks ||
                          step4.anxietyFrequency || step4.familyHistory;

      if (hasStep4Data) {
        console.log('Creating mental health record...');
        await createMentalHealth({
          userId: user.id,
          psychiatricConditions: step4.psychiatricConditions || undefined,
          hasAnxietyAttacks: step4.hasAnxietyAttacks || false,
          anxietyFrequency: step4.anxietyFrequency || undefined,
          familyHistory: step4.familyHistory || undefined
        });
        console.log('Mental health record created successfully');
      } else {
        console.log('Skipping mental health creation - no meaningful data provided');
      }

      // Create psychiatric medications only if they have valid data
      if (step4.psychiatricMedications && step4.psychiatricMedications.length > 0) {
        const validPsychMedications = step4.psychiatricMedications.filter(med =>
          med.name?.trim()
        );

        if (validPsychMedications.length > 0) {
          console.log(`Creating ${validPsychMedications.length} psychiatric medications...`);
          await createMedications(user.id, validPsychMedications.map(med => ({
            ...med,
            type: 'psychiatric'
          })));
          console.log('Psychiatric medications created successfully');
        } else {
          console.log('Skipping psychiatric medications - no valid medications provided');
        }
      }
    }

    // Create harassment experiences if step5 exists
    if (step5 && step5.experiences && step5.experiences.length > 0) {
      const validExperiences = step5.experiences.filter(exp =>
        exp.category && exp.description
      );

      if (validExperiences.length > 0) {
        // Process evidence files for each experience
        const experiencesWithFiles = await Promise.all(
          validExperiences.map(async (exp) => {
            let evidenceFiles: Array<{
              fileUrl: string;
              fileName: string;
              fileType: string;
              fileSize: number;
            }> = [];

            if (exp.evidence && exp.evidence.length > 0) {
              // Filter for temp upload results
              const tempEvidenceFiles = exp.evidence.filter(
                (file): file is TempUploadResult =>
                  typeof file === 'object' && 'tempId' in file
              ) as TempUploadResult[];

              if (tempEvidenceFiles.length > 0) {
                const permanentEvidenceFiles = await moveTempFilesToUser(
                  tempEvidenceFiles,
                  user.id.toString()
                );
                evidenceFiles = permanentEvidenceFiles;
              }
            }

            return {
              ...exp,
              evidenceFiles
            };
          })
        );

        await createHarassmentExperiences(user.id, experiencesWithFiles);
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
