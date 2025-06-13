require('dotenv').config({ path: '.env.local' });

async function testRegistrationWithData() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Registration with Complete Data...\n');
  
  try {
    // Test registration with comprehensive data
    console.log('1️⃣ Testing registration with complete data...');
    
    const registrationData = {
      step1: {
        fullName: 'Complete Test User',
        email: 'complete-test@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        identityDocument: {}, // Empty for now - file upload to be implemented
        profilePhoto: {} // Empty for now - file upload to be implemented
      },
      step2: {
        age: '28',
        gender: 'female',
        sexualOrientation: 'heterosexual',
        address: '123 Test Street, Test City, Test State 12345',
        educationLevel: 'university',
        occupation: 'Software Developer',
        hobbies: 'Reading, Programming, Hiking',
        frequentPlaces: 'Home, Office, Gym, Library',
        emergencyContacts: [
          {
            name: 'Jane Doe',
            relationship: 'Sister',
            phone: '+1-555-0123'
          },
          {
            name: 'John Smith',
            relationship: 'Friend',
            phone: '+1-555-0456'
          }
        ]
      },
      step3: {
        weight: '65.5',
        height: '168',
        bloodType: 'A+',
        hasDisability: false,
        disabilityDescription: '',
        chronicConditions: 'Mild asthma',
        allergies: {
          medical: 'Penicillin',
          food: 'Shellfish, Nuts',
          environmental: 'Pollen, Dust mites'
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
        familyHistory: 'Family history of depression and anxiety disorders'
      },
      step5: {
        experiences: [
          {
            category: 'verbal',
            location: 'Public transportation',
            date: '2024-01-15',
            description: 'Experienced verbal harassment on the bus. The perpetrator made inappropriate comments about my appearance and continued despite my clear discomfort. This incident made me feel unsafe using public transportation.',
            reportedToAuthorities: false,
            evidence: [], // Empty for now - file upload to be implemented
            evidenceErrors: []
          },
          {
            category: 'digital',
            location: 'Social media platform',
            date: '2024-02-20',
            description: 'Received threatening messages on social media from an unknown account. The messages contained explicit threats and made me fear for my safety. I have screenshots of the messages.',
            reportedToAuthorities: true,
            evidence: [], // Empty for now - file upload to be implemented
            evidenceErrors: []
          }
        ]
      }
    };
    
    console.log('Sending registration request with complete data...');
    
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration Response Status:', registerResponse.status);
    console.log('Registration Result:', registerResult);
    
    if (!registerResult.success) {
      console.error('❌ Registration failed:', registerResult.error);
      return;
    }
    
    console.log('✅ Registration successful!');
    console.log('User ID:', registerResult.data.user.id);
    
    // Test login
    console.log('\n2️⃣ Testing login with new user...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'complete-test@example.com',
        password: 'TestPassword123!'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Result:', loginResult);
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.error);
      return;
    }
    
    console.log('✅ Login successful!');
    
    // Test getting current user
    console.log('\n3️⃣ Testing get current user...');
    
    const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginResult.data.token}`,
        'Content-Type': 'application/json',
      }
    });
    
    const meResult = await meResponse.json();
    console.log('Me Response Status:', meResponse.status);
    console.log('Me Result:', meResult);
    
    if (!meResult.success) {
      console.error('❌ Get current user failed:', meResult.error);
      return;
    }
    
    console.log('✅ Get current user successful!');
    
    console.log('\n🎉 Complete registration test successful!');
    console.log('\n📋 Summary:');
    console.log('- User registration with complete data: ✅');
    console.log('- User login: ✅');
    console.log('- Authentication verification: ✅');
    console.log('- Database storage: ✅');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Wait for server to be ready, then run tests
setTimeout(() => {
  testRegistrationWithData();
}, 2000);
