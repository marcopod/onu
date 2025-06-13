require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function quickDbCheck() {
  try {
    console.log('🔍 Quick Database Check...\n');
    
    // Find the test user
    const users = await sql`
      SELECT id, email, full_name FROM users 
      WHERE email = 'complete-test@example.com'
    `;
    
    if (users.rows.length === 0) {
      console.log('❌ Test user not found');
      return;
    }
    
    const userId = users.rows[0].id;
    console.log('✅ Found user:', users.rows[0]);
    
    // Check all related data
    const profile = await sql`SELECT COUNT(*) as count FROM user_profiles WHERE user_id = ${userId}`;
    const contacts = await sql`SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = ${userId}`;
    const health = await sql`SELECT COUNT(*) as count FROM physical_health WHERE user_id = ${userId}`;
    const medications = await sql`SELECT COUNT(*) as count FROM medications WHERE user_id = ${userId}`;
    const mental = await sql`SELECT COUNT(*) as count FROM mental_health WHERE user_id = ${userId}`;
    const experiences = await sql`SELECT COUNT(*) as count FROM harassment_experiences WHERE user_id = ${userId}`;
    
    console.log('\n📊 Data Summary:');
    console.log(`- User Profiles: ${profile.rows[0].count}`);
    console.log(`- Emergency Contacts: ${contacts.rows[0].count}`);
    console.log(`- Physical Health: ${health.rows[0].count}`);
    console.log(`- Medications: ${medications.rows[0].count}`);
    console.log(`- Mental Health: ${mental.rows[0].count}`);
    console.log(`- Harassment Experiences: ${experiences.rows[0].count}`);
    
    // Show actual data
    if (profile.rows[0].count > 0) {
      const profileData = await sql`SELECT age, gender, occupation FROM user_profiles WHERE user_id = ${userId}`;
      console.log('\n👤 Profile Data:', profileData.rows[0]);
    }
    
    if (contacts.rows[0].count > 0) {
      const contactData = await sql`SELECT name, relationship FROM emergency_contacts WHERE user_id = ${userId}`;
      console.log('\n📞 Emergency Contacts:', contactData.rows);
    }
    
    if (experiences.rows[0].count > 0) {
      const expData = await sql`SELECT category, location FROM harassment_experiences WHERE user_id = ${userId}`;
      console.log('\n⚠️ Harassment Experiences:', expData.rows);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickDbCheck();
