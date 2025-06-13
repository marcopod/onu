require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function clearTestUser() {
  try {
    console.log('Clearing test user data...');
    
    // Delete test users
    const result = await sql`
      DELETE FROM users 
      WHERE email IN ('test@test.com', 'testdirect@example.com', 'testdirect2@example.com')
      RETURNING email
    `;
    
    console.log('Deleted users:', result.rows);
    console.log('✅ Test user data cleared successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing test user:', error.message);
    process.exit(1);
  }
}

clearTestUser();
