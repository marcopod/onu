require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function debugDatabase() {
  try {
    console.log('🔍 Debugging Database Schema and Data...\n');
    
    // 1. Check if all tables exist
    console.log('1️⃣ Checking table existence...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('Existing tables:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    // 2. Check users table structure
    console.log('\n2️⃣ Checking users table structure...');
    const usersSchema = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `;
    
    console.log('Users table columns:');
    usersSchema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // 3. Check existing users
    console.log('\n3️⃣ Checking existing users...');
    const users = await sql`SELECT id, email, full_name, created_at FROM users ORDER BY id`;
    console.log(`Found ${users.rows.length} users:`);
    users.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Name: ${user.full_name}`);
    });
    
    // 4. Check user_profiles table
    console.log('\n4️⃣ Checking user_profiles table...');
    const profiles = await sql`SELECT user_id, age, gender, profile_photo_url, identity_document_url FROM user_profiles`;
    console.log(`Found ${profiles.rows.length} profiles:`);
    profiles.rows.forEach(profile => {
      console.log(`  - User ID: ${profile.user_id}, Age: ${profile.age}, Gender: ${profile.gender}`);
      console.log(`    Profile Photo: ${profile.profile_photo_url || 'None'}`);
      console.log(`    Identity Doc: ${profile.identity_document_url || 'None'}`);
    });
    
    // 5. Check emergency_contacts table
    console.log('\n5️⃣ Checking emergency_contacts table...');
    const contacts = await sql`SELECT user_id, name, relationship, phone FROM emergency_contacts`;
    console.log(`Found ${contacts.rows.length} emergency contacts:`);
    contacts.rows.forEach(contact => {
      console.log(`  - User ID: ${contact.user_id}, Name: ${contact.name}, Relationship: ${contact.relationship}`);
    });
    
    // 6. Check physical_health table
    console.log('\n6️⃣ Checking physical_health table...');
    const health = await sql`SELECT user_id, weight, height, blood_type FROM physical_health`;
    console.log(`Found ${health.rows.length} physical health records:`);
    health.rows.forEach(record => {
      console.log(`  - User ID: ${record.user_id}, Weight: ${record.weight}, Height: ${record.height}, Blood Type: ${record.blood_type}`);
    });
    
    // 7. Check medications table
    console.log('\n7️⃣ Checking medications table...');
    const medications = await sql`SELECT user_id, name, dose, frequency, medication_type FROM medications`;
    console.log(`Found ${medications.rows.length} medication records:`);
    medications.rows.forEach(med => {
      console.log(`  - User ID: ${med.user_id}, Name: ${med.name}, Type: ${med.medication_type}`);
    });
    
    // 8. Check mental_health table
    console.log('\n8️⃣ Checking mental_health table...');
    const mental = await sql`SELECT user_id, psychiatric_conditions, has_anxiety_attacks FROM mental_health`;
    console.log(`Found ${mental.rows.length} mental health records:`);
    mental.rows.forEach(record => {
      console.log(`  - User ID: ${record.user_id}, Conditions: ${record.psychiatric_conditions || 'None'}`);
    });
    
    // 9. Check harassment_experiences table
    console.log('\n9️⃣ Checking harassment_experiences table...');
    const experiences = await sql`SELECT user_id, category, description FROM harassment_experiences`;
    console.log(`Found ${experiences.rows.length} harassment experience records:`);
    experiences.rows.forEach(exp => {
      console.log(`  - User ID: ${exp.user_id}, Category: ${exp.category}`);
    });
    
    // 10. Check evidence_files table
    console.log('\n🔟 Checking evidence_files table...');
    const evidence = await sql`SELECT experience_id, file_url, file_name FROM evidence_files`;
    console.log(`Found ${evidence.rows.length} evidence file records:`);
    evidence.rows.forEach(file => {
      console.log(`  - Experience ID: ${file.experience_id}, File: ${file.file_name}`);
    });
    
    console.log('\n✅ Database debug completed!');
    
  } catch (error) {
    console.error('❌ Database debug failed:', error.message);
    console.error('Full error:', error);
  }
}

debugDatabase();
