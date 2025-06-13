require('dotenv').config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

async function clearAndDebug() {
  try {
    console.log('🧹 Clearing test data and debugging database...\n');
    
    // 1. Clear test users
    console.log('1️⃣ Clearing test users...');
    const deletedUsers = await sql`
      DELETE FROM users 
      WHERE email LIKE '%test%' OR email LIKE '%example%'
      RETURNING email
    `;
    console.log(`Deleted ${deletedUsers.rows.length} test users:`, deletedUsers.rows.map(u => u.email));
    
    // 2. Check table existence
    console.log('\n2️⃣ Checking table existence...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('Existing tables:');
    tables.rows.forEach(row => console.log(`  ✅ ${row.table_name}`));
    
    // 3. Check users table structure
    console.log('\n3️⃣ Checking users table structure...');
    const usersSchema = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('Users table schema:');
    usersSchema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // 4. Test basic insert
    console.log('\n4️⃣ Testing basic user insert...');
    const testUser = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES ('debug-test@example.com', 'test-hash', 'Debug Test User')
      RETURNING id, email, full_name
    `;
    console.log('Test user created:', testUser.rows[0]);
    
    const userId = testUser.rows[0].id;
    
    // 5. Test user_profiles insert
    console.log('\n5️⃣ Testing user_profiles insert...');
    const testProfile = await sql`
      INSERT INTO user_profiles (user_id, age, gender, address)
      VALUES (${userId}, 25, 'other', 'Test Address')
      RETURNING id, user_id
    `;
    console.log('Test profile created:', testProfile.rows[0]);
    
    // 6. Test emergency_contacts insert
    console.log('\n6️⃣ Testing emergency_contacts insert...');
    const testContact = await sql`
      INSERT INTO emergency_contacts (user_id, name, relationship, phone)
      VALUES (${userId}, 'Test Contact', 'Friend', '+1234567890')
      RETURNING id, user_id, name
    `;
    console.log('Test emergency contact created:', testContact.rows[0]);
    
    // 7. Test physical_health insert
    console.log('\n7️⃣ Testing physical_health insert...');
    const testHealth = await sql`
      INSERT INTO physical_health (user_id, weight, height, blood_type)
      VALUES (${userId}, 70.5, 175.0, 'O+')
      RETURNING id, user_id
    `;
    console.log('Test physical health created:', testHealth.rows[0]);
    
    // 8. Test medications insert
    console.log('\n8️⃣ Testing medications insert...');
    const testMedication = await sql`
      INSERT INTO medications (user_id, name, dose, frequency, medication_type)
      VALUES (${userId}, 'Test Medicine', '10mg', 'Daily', 'general')
      RETURNING id, user_id, name
    `;
    console.log('Test medication created:', testMedication.rows[0]);
    
    // 9. Test mental_health insert
    console.log('\n9️⃣ Testing mental_health insert...');
    const testMental = await sql`
      INSERT INTO mental_health (user_id, psychiatric_conditions, has_anxiety_attacks)
      VALUES (${userId}, 'None', false)
      RETURNING id, user_id
    `;
    console.log('Test mental health created:', testMental.rows[0]);
    
    // 10. Test harassment_experiences insert
    console.log('\n🔟 Testing harassment_experiences insert...');
    const testExperience = await sql`
      INSERT INTO harassment_experiences (user_id, category, location, description, reported_to_authorities)
      VALUES (${userId}, 'verbal', 'Test Location', 'Test description for harassment experience', false)
      RETURNING id, user_id, category
    `;
    console.log('Test harassment experience created:', testExperience.rows[0]);
    
    const experienceId = testExperience.rows[0].id;
    
    // 11. Test evidence_files insert
    console.log('\n1️⃣1️⃣ Testing evidence_files insert...');
    const testEvidence = await sql`
      INSERT INTO evidence_files (experience_id, file_url, file_name, file_type, file_size)
      VALUES (${experienceId}, '/uploads/evidence/test/test-file.jpg', 'test-file.jpg', 'image/jpeg', 12345)
      RETURNING id, experience_id, file_name
    `;
    console.log('Test evidence file created:', testEvidence.rows[0]);
    
    // 12. Clean up test data
    console.log('\n1️⃣2️⃣ Cleaning up test data...');
    await sql`DELETE FROM users WHERE email = 'debug-test@example.com'`;
    console.log('Test data cleaned up');
    
    console.log('\n✅ All database operations working correctly!');
    console.log('\n📋 Summary:');
    console.log('- All required tables exist ✅');
    console.log('- User creation works ✅');
    console.log('- Profile creation works ✅');
    console.log('- Emergency contacts work ✅');
    console.log('- Physical health works ✅');
    console.log('- Medications work ✅');
    console.log('- Mental health works ✅');
    console.log('- Harassment experiences work ✅');
    console.log('- Evidence files work ✅');
    
  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    console.error('Full error:', error);
  }
}

clearAndDebug();
