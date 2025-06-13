require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function clearTestUsers() {
  try {
    console.log('🧹 Clearing all test users...\n');
    
    // Delete all test users (emails containing 'test')
    const deletedUsers = await sql`
      DELETE FROM users 
      WHERE email LIKE '%test%' OR email LIKE '%example%'
      RETURNING email
    `;
    
    console.log(`✅ Deleted ${deletedUsers.rows.length} test users:`);
    deletedUsers.rows.forEach(user => {
      console.log(`  - ${user.email}`);
    });
    
    console.log('\n🎯 You can now register with any test email!');
    console.log('Suggested test emails:');
    console.log('  - newuser@test.com');
    console.log('  - myemail@test.com');
    console.log('  - registration@test.com');
    
  } catch (error) {
    console.error('❌ Error clearing users:', error.message);
  }
}

clearTestUsers();
