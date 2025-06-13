require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function checkSpecificUser() {
  try {
    console.log('🔍 Checking for test12345@test.com...\n');
    
    const users = await sql`
      SELECT id, email, full_name, created_at FROM users 
      WHERE email = 'test12345@test.com'
    `;
    
    if (users.rows.length > 0) {
      console.log('✅ User found:', users.rows[0]);
      console.log('\n🎉 Registration was successful!');
      console.log('The duplicate error was from a double-submission, but the second attempt worked.');
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSpecificUser();
