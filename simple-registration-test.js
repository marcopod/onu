require('dotenv').config({ path: '.env.local' });

async function simpleRegistrationTest() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Simple Registration Test...\n');
  
  try {
    // Clear any existing test user first
    const { sql } = require('@vercel/postgres');
    await sql`DELETE FROM users WHERE email = 'simple@test.com'`;
    console.log('✅ Cleared any existing test user');
    
    // Test with minimal but complete data
    const registrationData = {
      step1: {
        fullName: 'Simple Test',
        email: 'simple@test.com',
        password: 'Test123!',
        confirmPassword: 'Test123!',
        identityDocument: {},
        profilePhoto: {}
      },
      step2: {
        age: '25',
        gender: 'other',
        sexualOrientation: '',
        address: 'Test Address',
        educationLevel: 'university',
        occupation: 'Tester',
        hobbies: 'Testing',
        frequentPlaces: 'Home',
        emergencyContacts: [
          {
            name: 'Test Contact',
            relationship: 'Friend',
            phone: '+1234567890'
          }
        ]
      },
      step3: {
        weight: '70',
        height: '175',
        bloodType: 'O+',
        hasDisability: false,
        disabilityDescription: '',
        chronicConditions: '',
        allergies: {
          medical: '',
          food: '',
          environmental: ''
        },
        currentMedications: []
      },
      step4: {
        psychiatricConditions: '',
        hasAnxietyAttacks: false,
        anxietyFrequency: '',
        psychiatricMedications: [],
        familyHistory: ''
      },
      step5: {
        experiences: []
      }
    };
    
    console.log('📤 Sending registration...');
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const result = await response.json();
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Success:', result.success);
    
    if (!result.success) {
      console.error('❌ Registration failed:', result.error);
      return;
    }
    
    console.log('✅ Registration successful!');
    const userId = result.data.user.id;
    
    // Check what was saved
    console.log('\n🔍 Checking saved data...');
    
    const profile = await sql`SELECT * FROM user_profiles WHERE user_id = ${userId}`;
    const contacts = await sql`SELECT * FROM emergency_contacts WHERE user_id = ${userId}`;
    
    console.log(`Profile records: ${profile.rows.length}`);
    console.log(`Contact records: ${contacts.rows.length}`);
    
    if (profile.rows.length > 0) {
      console.log('Profile data:', {
        age: profile.rows[0].age,
        gender: profile.rows[0].gender,
        occupation: profile.rows[0].occupation
      });
    }
    
    if (contacts.rows.length > 0) {
      console.log('Contact data:', contacts.rows[0]);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleRegistrationTest();
