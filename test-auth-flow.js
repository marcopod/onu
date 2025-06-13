require('dotenv').config({ path: '.env.local' });

async function testAuthFlow() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Authentication Flow...\n');
  
  // Test data
  const testUser = {
    step1: {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmPassword: 'TestPassword123!'
    }
  };
  
  try {
    // Test 1: Registration
    console.log('1️⃣ Testing User Registration...');
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    const registerData = await registerResponse.json();
    console.log('Registration Response Status:', registerResponse.status);
    console.log('Registration Response:', registerData);
    
    if (!registerData.success) {
      console.error('❌ Registration failed:', registerData.error);
      return;
    }
    
    console.log('✅ Registration successful!');
    console.log('User ID:', registerData.data.user.id);
    console.log('User Email:', registerData.data.user.email);
    
    // Test 2: Login
    console.log('\n2️⃣ Testing User Login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.step1.email,
        password: testUser.step1.password
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Response:', loginData);
    
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.error);
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('Token received:', !!loginData.data.token);
    
    // Test 3: Get current user (using token)
    console.log('\n3️⃣ Testing Get Current User...');
    const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.data.token}`,
        'Content-Type': 'application/json',
      }
    });
    
    const meData = await meResponse.json();
    console.log('Me Response Status:', meResponse.status);
    console.log('Me Response:', meData);
    
    if (meData.success) {
      console.log('✅ Get current user successful!');
      console.log('Current user:', meData.data.user);
    } else {
      console.log('⚠️ Get current user failed:', meData.error);
    }
    
    console.log('\n🎉 Authentication flow test completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Wait for server to be ready, then run tests
setTimeout(() => {
  testAuthFlow();
}, 2000);
