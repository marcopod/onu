require('dotenv').config({ path: '.env.local' });

import { registerUser, loginUser, getCurrentUser } from './lib/auth';

async function testAuthDirect() {
  console.log('🧪 Testing Authentication Functions Directly...\n');
  
  try {
    // Test data
    const testUser = {
      fullName: 'Test User Direct 2',
      email: 'testdirect2@example.com',
      password: 'TestPassword123!'
    };
    
    console.log('1️⃣ Testing User Registration...');
    console.log('Registering user:', testUser.email);
    
    const registeredUser = await registerUser(testUser);
    console.log('✅ Registration successful!');
    console.log('Registered user:', registeredUser);
    
    console.log('\n2️⃣ Testing User Login...');
    console.log('Logging in user:', testUser.email);
    
    const loginResult = await loginUser(testUser.email, testUser.password);
    console.log('✅ Login successful!');
    console.log('Login result:', {
      user: loginResult.user,
      tokenExists: !!loginResult.token
    });
    
    console.log('\n3️⃣ Testing Get Current User...');
    console.log('Getting current user with token...');
    
    const currentUser = await getCurrentUser(loginResult.token);
    console.log('✅ Get current user successful!');
    console.log('Current user:', currentUser);
    
    console.log('\n🎉 Direct authentication test completed successfully!');
    
  } catch (error: any) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

testAuthDirect();
