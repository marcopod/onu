require('dotenv').config({ path: '.env.local' });

async function testCompleteRegistration() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Complete Registration Flow with File Uploads...\n');
  
  try {
    // Step 1: Test file upload endpoint
    console.log('1️⃣ Testing file upload endpoint...');
    
    // Create a simple test file (simulate a small image)
    const testFileContent = 'fake-image-content-for-testing';
    const testFile = new File([testFileContent], 'test-identity.jpg', { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('uploadType', 'identity');
    
    const uploadResponse = await fetch(`${baseUrl}/api/upload/temp`, {
      method: 'POST',
      body: formData
    });
    
    const uploadResult = await uploadResponse.json();
    console.log('Upload Response Status:', uploadResponse.status);
    console.log('Upload Result:', uploadResult);
    
    if (!uploadResult.success) {
      console.error('❌ File upload failed:', uploadResult.error);
      return;
    }
    
    console.log('✅ File upload successful!');
    console.log('Temp file URL:', uploadResult.data.url);
    
    // Step 2: Test registration with file reference
    console.log('\n2️⃣ Testing registration with file reference...');
    
    const registrationData = {
      step1: {
        fullName: 'Test User Complete',
        email: 'testcomplete@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        identityDocument: uploadResult.data, // Use the uploaded file data
        profilePhoto: null
      },
      step2: {
        age: '25',
        gender: 'other',
        sexualOrientation: '',
        address: 'Test Address',
        educationLevel: 'university',
        occupation: 'Developer',
        hobbies: 'Testing',
        frequentPlaces: 'Home, Office',
        emergencyContacts: [
          {
            name: 'Emergency Contact',
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
    
    // Step 3: Test login
    console.log('\n3️⃣ Testing login...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'testcomplete@example.com',
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
    
    console.log('\n🎉 Complete registration flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- File upload: ✅ Working');
    console.log('- User registration: ✅ Working');
    console.log('- File processing: ✅ Working');
    console.log('- User login: ✅ Working');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Wait for server to be ready, then run tests
setTimeout(() => {
  testCompleteRegistration();
}, 2000);
