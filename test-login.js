require('dotenv').config({ path: '.env.local' });

async function testLogin() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔐 Testing Login with Registered User...\n');
  
  try {
    // Test login with the user we just registered
    console.log('1️⃣ Testing login with test12345@test.com...');
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test12345@test.com',
        password: 'Test123123'
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
    console.log('User:', loginResult.data.user);
    console.log('Token received:', !!loginResult.data.token);
    
    // Test getting current user
    console.log('\n2️⃣ Testing get current user...');
    
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
    
    console.log('✅ Authentication verification successful!');
    
    console.log('\n🎉 Login test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- User login: ✅');
    console.log('- Token generation: ✅');
    console.log('- Authentication verification: ✅');
    console.log('- Registration system: ✅ WORKING');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

testLogin();
