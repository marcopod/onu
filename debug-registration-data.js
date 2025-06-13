require('dotenv').config({ path: '.env.local' });

async function debugRegistrationData() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Debugging Registration Data Storage...\n');
  
  try {
    // Clear any existing test user first
    const { sql } = require('@vercel/postgres');
    await sql`DELETE FROM users WHERE email = 'debuguser@example.com'`;
    console.log('✅ Cleared any existing test user');
    
    // Test registration with COMPLETE data in ALL steps
    console.log('\n1️⃣ Testing registration with COMPLETE data...');
    
    const registrationData = {
      step1: {
        fullName: 'Debug Test User',
        email: 'debuguser@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        identityDocument: {},
        profilePhoto: {}
      },
      step2: {
        age: '30',
        gender: 'female',
        sexualOrientation: 'heterosexual',
        address: '123 Debug Street, Test City, TC 12345',
        educationLevel: 'university',
        occupation: 'Software Developer',
        hobbies: 'Reading, Coding, Gaming',
        frequentPlaces: 'Home, Office, Gym, Coffee Shop',
        emergencyContacts: [
          {
            name: 'Jane Debug',
            relationship: 'Sister',
            phone: '+1-555-DEBUG1'
          },
          {
            name: 'John Debug',
            relationship: 'Friend',
            phone: '+1-555-DEBUG2'
          }
        ]
      },
      step3: {
        weight: '65',
        height: '170',
        bloodType: 'A+',
        hasDisability: false,
        disabilityDescription: '',
        chronicConditions: 'Mild asthma',
        allergies: {
          medical: 'Penicillin',
          food: 'Shellfish, Nuts',
          environmental: 'Pollen, Dust'
        },
        currentMedications: [
          {
            name: 'Albuterol Inhaler',
            dose: '90mcg',
            frequency: 'As needed'
          },
          {
            name: 'Vitamin D',
            dose: '1000 IU',
            frequency: 'Daily'
          }
        ]
      },
      step4: {
        psychiatricConditions: 'Mild anxiety',
        hasAnxietyAttacks: true,
        anxietyFrequency: 'Monthly',
        psychiatricMedications: [
          {
            name: 'Sertraline',
            dose: '50mg',
            frequency: 'Daily'
          }
        ],
        familyHistory: 'Family history of anxiety and depression'
      },
      step5: {
        experiences: [
          {
            category: 'verbal',
            location: 'Public transportation',
            date: '2024-01-15',
            description: 'Experienced verbal harassment on the bus. The perpetrator made inappropriate comments and continued despite clear discomfort.',
            reportedToAuthorities: false,
            evidence: [],
            evidenceErrors: []
          }
        ]
      }
    };
    
    console.log('📤 Sending registration with complete data...');
    console.log('Step2 Emergency Contacts:', registrationData.step2.emergencyContacts);
    console.log('Step3 Medications:', registrationData.step3.currentMedications);
    console.log('Step4 Psychiatric Meds:', registrationData.step4.psychiatricMedications);
    console.log('Step5 Experiences:', registrationData.step5.experiences);
    
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('\n📥 Registration Response:');
    console.log('Status:', registerResponse.status);
    console.log('Success:', registerResult.success);
    
    if (!registerResult.success) {
      console.error('❌ Registration failed:', registerResult.error);
      return;
    }
    
    console.log('✅ Registration successful!');
    const userId = registerResult.data.user.id;
    console.log('User ID:', userId);
    
    // Now check what was actually saved in the database
    console.log('\n2️⃣ Checking what was actually saved in database...');
    
    // Check user basic info
    const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
    console.log('\n👤 User Table:');
    console.log(user.rows[0]);
    
    // Check user profile
    const profile = await sql`SELECT * FROM user_profiles WHERE user_id = ${userId}`;
    console.log('\n📋 User Profile Table:');
    if (profile.rows.length > 0) {
      console.log(profile.rows[0]);
    } else {
      console.log('❌ NO PROFILE DATA FOUND');
    }
    
    // Check emergency contacts
    const contacts = await sql`SELECT * FROM emergency_contacts WHERE user_id = ${userId}`;
    console.log('\n📞 Emergency Contacts Table:');
    if (contacts.rows.length > 0) {
      console.log(`Found ${contacts.rows.length} contacts:`);
      contacts.rows.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.name} (${contact.relationship}) - ${contact.phone}`);
      });
    } else {
      console.log('❌ NO EMERGENCY CONTACTS FOUND');
    }
    
    // Check physical health
    const health = await sql`SELECT * FROM physical_health WHERE user_id = ${userId}`;
    console.log('\n🏥 Physical Health Table:');
    if (health.rows.length > 0) {
      console.log(health.rows[0]);
    } else {
      console.log('❌ NO PHYSICAL HEALTH DATA FOUND');
    }
    
    // Check medications
    const medications = await sql`SELECT * FROM medications WHERE user_id = ${userId}`;
    console.log('\n💊 Medications Table:');
    if (medications.rows.length > 0) {
      console.log(`Found ${medications.rows.length} medications:`);
      medications.rows.forEach((med, index) => {
        console.log(`${index + 1}. ${med.name} - ${med.dose} (${med.frequency}) [${med.medication_type}]`);
      });
    } else {
      console.log('❌ NO MEDICATIONS FOUND');
    }
    
    // Check mental health
    const mental = await sql`SELECT * FROM mental_health WHERE user_id = ${userId}`;
    console.log('\n🧠 Mental Health Table:');
    if (mental.rows.length > 0) {
      console.log(mental.rows[0]);
    } else {
      console.log('❌ NO MENTAL HEALTH DATA FOUND');
    }
    
    // Check harassment experiences
    const experiences = await sql`SELECT * FROM harassment_experiences WHERE user_id = ${userId}`;
    console.log('\n⚠️ Harassment Experiences Table:');
    if (experiences.rows.length > 0) {
      console.log(`Found ${experiences.rows.length} experiences:`);
      experiences.rows.forEach((exp, index) => {
        console.log(`${index + 1}. ${exp.category} at ${exp.location} - ${exp.description.substring(0, 50)}...`);
      });
    } else {
      console.log('❌ NO HARASSMENT EXPERIENCES FOUND');
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log('='.repeat(50));
    console.log(`User: ${user.rows.length > 0 ? '✅' : '❌'}`);
    console.log(`Profile: ${profile.rows.length > 0 ? '✅' : '❌'}`);
    console.log(`Emergency Contacts: ${contacts.rows.length > 0 ? `✅ (${contacts.rows.length})` : '❌'}`);
    console.log(`Physical Health: ${health.rows.length > 0 ? '✅' : '❌'}`);
    console.log(`Medications: ${medications.rows.length > 0 ? `✅ (${medications.rows.length})` : '❌'}`);
    console.log(`Mental Health: ${mental.rows.length > 0 ? '✅' : '❌'}`);
    console.log(`Harassment Experiences: ${experiences.rows.length > 0 ? `✅ (${experiences.rows.length})` : '❌'}`);
    
  } catch (error) {
    console.error('❌ Debug failed with error:', error.message);
    console.error('Full error:', error);
  }
}

debugRegistrationData();
