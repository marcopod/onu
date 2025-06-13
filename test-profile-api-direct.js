require('dotenv').config({ path: '.env.local' });

async function testProfileAPIDirect() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Profile API with Direct Token...\n');
  
  try {
    // Step 1: Login to get token
    console.log('1️⃣ Getting authentication token...');
    
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
    
    const token = loginResult.data.token;
    console.log('✅ Token received:', !!token);
    
    // Step 2: Test profile API with Authorization header
    console.log('\n2️⃣ Testing profile API with Authorization header...');
    
    const profileResponse = await fetch(`${baseUrl}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const profileResult = await profileResponse.json();
    console.log('Profile API Status:', profileResponse.status);
    console.log('Profile API Success:', profileResult.success);
    
    if (!profileResult.success) {
      console.error('❌ Profile API failed:', profileResult.error);
      return;
    }
    
    console.log('✅ Profile API successful!');
    
    // Display profile data summary
    const profile = profileResult.data;
    console.log('\n📊 Profile Data Summary:');
    console.log(`- User: ${profile.user.fullName} (${profile.user.email})`);
    console.log(`- Profile Info: ${profile.profile ? 'Available' : 'Not available'}`);
    console.log(`- Emergency Contacts: ${profile.emergencyContacts.length}`);
    console.log(`- Physical Health: ${profile.physicalHealth ? 'Available' : 'Not available'}`);
    console.log(`- Mental Health: ${profile.mentalHealth ? 'Available' : 'Not available'}`);
    console.log(`- Medications: ${profile.medications.length}`);
    console.log(`- Harassment Experiences: ${profile.harassmentExperiences.length}`);
    
    console.log('\n🎉 Profile API test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Authentication: ✅');
    console.log('- Profile API: ✅');
    console.log('- Data retrieval: ✅');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

testProfileAPIDirect();
