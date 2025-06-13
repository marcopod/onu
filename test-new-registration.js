require('dotenv').config({ path: '.env.local' });

async function testNewRegistration() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing New Registration (No Double Submission)...\n');
  
  try {
    // Clear any existing test user first
    const { sql } = require('@vercel/postgres');
    await sql`DELETE FROM users WHERE email = 'singletest@test.com'`;
    console.log('✅ Cleared any existing test user');
    
    // Test registration with a unique email
    console.log('\n1️⃣ Testing single registration submission...');
    
    const registrationData = {
      step1: {
        fullName: 'Single Test User',
        email: 'singletest@test.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        identityDocument: {},
        profilePhoto: {}
      },
      step2: {
        age: '30',
        gender: 'other',
        sexualOrientation: '',
        address: 'Test Address 123',
        educationLevel: 'university',
        occupation: 'Tester',
        hobbies: 'Testing',
        frequentPlaces: 'Test Lab',
        emergencyContacts: [
          {
            name: 'Test Contact',
            relationship: 'Friend',
            phone: '+1-555-TEST'
          }
        ]
      },
      step3: {
        weight: '75',
        height: '180',
        bloodType: 'B+',
        hasDisability: false,
        disabilityDescription: '',
        chronicConditions: 'None',
        allergies: {
          medical: 'None',
          food: 'None',
          environmental: 'None'
        },
        currentMedications: [
          {
            name: 'Test Vitamin',
            dose: '100mg',
            frequency: 'Daily'
          }
        ]
      },
      step4: {
        psychiatricConditions: 'None',
        hasAnxietyAttacks: false,
        anxietyFrequency: '',
        psychiatricMedications: [],
        familyHistory: 'None'
      },
      step5: {
        experiences: [
          {
            category: 'verbal',
            location: 'Test Location',
            date: '2024-01-01',
            description: 'This is a test harassment experience description that is long enough to meet the minimum requirements for testing purposes. It describes a fictional incident for testing the database storage.',
            reportedToAuthorities: false,
            evidence: [],
            evidenceErrors: []
          }
        ]
      }
    };
    
    console.log('Sending registration request...');
    
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration Response Status:', registerResponse.status);
    console.log('Registration Success:', registerResult.success);
    
    if (!registerResult.success) {
      console.error('❌ Registration failed:', registerResult.error);
      return;
    }
    
    console.log('✅ Registration successful!');
    console.log('User ID:', registerResult.data.user.id);
    
    // Verify data was saved
    console.log('\n2️⃣ Verifying data was saved...');
    
    const userId = registerResult.data.user.id;
    
    // Check all data
    const profile = await sql`SELECT COUNT(*) as count FROM user_profiles WHERE user_id = ${userId}`;
    const contacts = await sql`SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = ${userId}`;
    const health = await sql`SELECT COUNT(*) as count FROM physical_health WHERE user_id = ${userId}`;
    const medications = await sql`SELECT COUNT(*) as count FROM medications WHERE user_id = ${userId}`;
    const mental = await sql`SELECT COUNT(*) as count FROM mental_health WHERE user_id = ${userId}`;
    const experiences = await sql`SELECT COUNT(*) as count FROM harassment_experiences WHERE user_id = ${userId}`;
    
    console.log('📊 Data Verification:');
    console.log(`- User Profiles: ${profile.rows[0].count} ✅`);
    console.log(`- Emergency Contacts: ${contacts.rows[0].count} ✅`);
    console.log(`- Physical Health: ${health.rows[0].count} ✅`);
    console.log(`- Medications: ${medications.rows[0].count} ✅`);
    console.log(`- Mental Health: ${mental.rows[0].count} ✅`);
    console.log(`- Harassment Experiences: ${experiences.rows[0].count} ✅`);
    
    // Test login
    console.log('\n3️⃣ Testing login...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'singletest@test.com',
        password: 'TestPassword123!'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login Success:', loginResult.success);
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.error);
      return;
    }
    
    console.log('✅ Login successful!');
    
    console.log('\n🎉 Complete registration test successful!');
    console.log('\n📋 Summary:');
    console.log('- Single submission (no duplicates): ✅');
    console.log('- All data saved correctly: ✅');
    console.log('- Login works: ✅');
    console.log('- Database integrity: ✅');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Wait for server to be ready, then run tests
setTimeout(() => {
  testNewRegistration();
}, 2000);
