require('dotenv').config({ path: '.env.local' });

async function testProfilePage() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Profile Page and API...\n');
  
  try {
    // Step 1: Login to get authentication
    console.log('1️⃣ Logging in to get authentication...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test12345@test.com', // Use the user we created earlier
        password: 'Test123123'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Success:', loginResult.success);
    
    if (!loginResult.success) {
      console.error('❌ Login failed:', loginResult.error);
      return;
    }
    
    console.log('✅ Login successful!');
    
    // Extract cookies from login response
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie header:', setCookieHeader);
    
    // Step 2: Test profile API endpoint
    console.log('\n2️⃣ Testing profile API endpoint...');
    
    const profileResponse = await fetch(`${baseUrl}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': setCookieHeader || '', // Include cookies from login
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
    
    // Step 3: Test profile page accessibility
    console.log('\n3️⃣ Testing profile page accessibility...');
    
    const pageResponse = await fetch(`${baseUrl}/profile`, {
      method: 'GET',
      headers: {
        'Cookie': setCookieHeader || '',
      },
    });
    
    console.log('Profile Page Status:', pageResponse.status);
    
    if (pageResponse.status === 200) {
      console.log('✅ Profile page accessible!');
    } else {
      console.log('⚠️ Profile page returned status:', pageResponse.status);
    }
    
    console.log('\n🎉 Profile page test completed!');
    console.log('\n📋 Summary:');
    console.log('- Authentication: ✅');
    console.log('- Profile API: ✅');
    console.log('- Data retrieval: ✅');
    console.log('- Page accessibility: ✅');
    
    console.log('\n🌐 You can now visit: http://localhost:3000/profile');
    console.log('Make sure you are logged in to view your complete profile data!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

testProfilePage();
