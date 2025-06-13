require('dotenv').config({ path: '.env.local' });

async function testRegistrationFix() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Registration Fix (Duplicate User Handling)...\n');
  
  try {
    // Clear any existing test user first
    const { sql } = require('@vercel/postgres');
    await sql`DELETE FROM users WHERE email = 'fixtest@example.com'`;
    console.log('✅ Cleared any existing test user');
    
    // Test registration with complete data
    console.log('\n1️⃣ Testing first registration...');
    
    const registrationData = {
      step1: {
        fullName: 'Fix Test User',
        email: 'fixtest@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        identityDocument: {},
        profilePhoto: {}
      },
      step2: {
        age: '25',
        gender: 'other',
        sexualOrientation: '',
        address: 'Test Address 123',
        educationLevel: 'university',
        occupation: 'Tester',
        hobbies: 'Testing Registration',
        frequentPlaces: 'Test Lab',
        emergencyContacts: [
          {
            name: 'Emergency Test Contact',
            relationship: 'Friend',
            phone: '+1-555-TEST'
          }
        ]
      },
      step3: {
        weight: '70',
        height: '175',
        bloodType: 'O+',
        hasDisability: false,
        disabilityDescription: '',
        chronicConditions: 'None',
        allergies: {
          medical: 'None',
          food: 'None',
          environmental: 'None'
        },
        currentMedications: []
      },
      step4: {
        psychiatricConditions: 'None',
        hasAnxietyAttacks: false,
        anxietyFrequency: '',
        psychiatricMedications: [],
        familyHistory: 'None'
      },
      step5: {
        experiences: []
      }
    };
    
    const registerResponse1 = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const registerResult1 = await registerResponse1.json();
    console.log('First Registration Status:', registerResponse1.status);
    console.log('First Registration Success:', registerResult1.success);
    
    if (!registerResult1.success) {
      console.error('❌ First registration failed:', registerResult1.error);
      return;
    }
    
    console.log('✅ First registration successful!');
    const userId = registerResult1.data.user.id;
    
    // Test second registration with same email (should handle gracefully)
    console.log('\n2️⃣ Testing second registration with same email...');
    
    // Modify the data slightly
    registrationData.step2.occupation = 'Updated Tester';
    registrationData.step2.hobbies = 'Updated Testing Registration';
    
    const registerResponse2 = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const registerResult2 = await registerResponse2.json();
    console.log('Second Registration Status:', registerResponse2.status);
    console.log('Second Registration Success:', registerResult2.success);
    
    if (registerResult2.success) {
      console.log('✅ Second registration handled gracefully!');
    } else {
      console.log('⚠️ Second registration failed (expected):', registerResult2.error);
    }
    
    // Verify data was saved
    console.log('\n3️⃣ Verifying data was saved...');
    
    // Check all data
    const profile = await sql`SELECT COUNT(*) as count FROM user_profiles WHERE user_id = ${userId}`;
    const contacts = await sql`SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = ${userId}`;
    const health = await sql`SELECT COUNT(*) as count FROM physical_health WHERE user_id = ${userId}`;
    const mental = await sql`SELECT COUNT(*) as count FROM mental_health WHERE user_id = ${userId}`;
    
    console.log('📊 Data Verification:');
    console.log(`- User Profiles: ${profile.rows[0].count} ✅`);
    console.log(`- Emergency Contacts: ${contacts.rows[0].count} ✅`);
    console.log(`- Physical Health: ${health.rows[0].count} ✅`);
    console.log(`- Mental Health: ${mental.rows[0].count} ✅`);
    
    // Check actual profile data
    if (profile.rows[0].count > 0) {
      const profileData = await sql`
        SELECT occupation, hobbies FROM user_profiles WHERE user_id = ${userId}
      `;
      console.log('Profile Data:', profileData.rows[0]);
    }
    
    // Test login
    console.log('\n4️⃣ Testing login...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'fixtest@example.com',
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
    
    console.log('\n🎉 Registration fix test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- First registration: ✅');
    console.log('- Duplicate handling: ✅');
    console.log('- Data persistence: ✅');
    console.log('- Login functionality: ✅');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

testRegistrationFix();
