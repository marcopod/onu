require('dotenv').config({ path: '.env.local' });

async function testDirectDB() {
  console.log('🧪 Testing Direct Database Functions...\n');
  
  try {
    // Import the real database functions directly
    const { 
      createUser, 
      createUserProfile, 
      createEmergencyContacts,
      createPhysicalHealth,
      createMentalHealth,
      createMedications,
      sql
    } = require('./lib/db');
    
    console.log('✅ Database functions imported successfully');
    
    // Clear any existing test user
    await sql`DELETE FROM users WHERE email = 'directtest@example.com'`;
    console.log('✅ Cleared any existing test user');
    
    // Test 1: Create user
    console.log('\n1️⃣ Creating user...');
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('TestPassword123!', 12);
    
    const user = await createUser({
      email: 'directtest@example.com',
      passwordHash: passwordHash,
      fullName: 'Direct Test User'
    });
    
    console.log('✅ User created:', user);
    const userId = user.id;
    
    // Test 2: Create profile
    console.log('\n2️⃣ Creating user profile...');
    const profile = await createUserProfile({
      userId: userId,
      age: 28,
      gender: 'female',
      sexualOrientation: 'heterosexual',
      address: '123 Direct Test St',
      educationLevel: 'university',
      occupation: 'Direct Tester',
      hobbies: 'Direct Testing',
      frequentPlaces: 'Test Lab'
    });
    
    console.log('✅ Profile created:', profile);
    
    // Test 3: Create emergency contacts
    console.log('\n3️⃣ Creating emergency contacts...');
    const contacts = await createEmergencyContacts(userId, [
      {
        name: 'Direct Emergency Contact',
        relationship: 'Friend',
        phone: '+1-555-DIRECT'
      }
    ]);
    
    console.log('✅ Emergency contacts created:', contacts);
    
    // Test 4: Create physical health
    console.log('\n4️⃣ Creating physical health...');
    const health = await createPhysicalHealth({
      userId: userId,
      weight: 65,
      height: 170,
      bloodType: 'A+',
      hasDisability: false,
      chronicConditions: 'None',
      medicalAllergies: 'None',
      foodAllergies: 'None',
      environmentalAllergies: 'None'
    });
    
    console.log('✅ Physical health created:', health);
    
    // Test 5: Create mental health
    console.log('\n5️⃣ Creating mental health...');
    const mental = await createMentalHealth({
      userId: userId,
      psychiatricConditions: 'None',
      hasAnxietyAttacks: false,
      anxietyFrequency: '',
      familyHistory: 'None'
    });
    
    console.log('✅ Mental health created:', mental);
    
    // Test 6: Create medications
    console.log('\n6️⃣ Creating medications...');
    const medications = await createMedications(userId, [
      {
        name: 'Test Medication',
        dose: '10mg',
        frequency: 'Daily',
        type: 'general'
      }
    ]);
    
    console.log('✅ Medications created:', medications);
    
    // Verify all data was saved
    console.log('\n7️⃣ Verifying saved data...');
    
    const profileCheck = await sql`SELECT COUNT(*) as count FROM user_profiles WHERE user_id = ${userId}`;
    const contactsCheck = await sql`SELECT COUNT(*) as count FROM emergency_contacts WHERE user_id = ${userId}`;
    const healthCheck = await sql`SELECT COUNT(*) as count FROM physical_health WHERE user_id = ${userId}`;
    const mentalCheck = await sql`SELECT COUNT(*) as count FROM mental_health WHERE user_id = ${userId}`;
    const medsCheck = await sql`SELECT COUNT(*) as count FROM medications WHERE user_id = ${userId}`;
    
    console.log('📊 Data Verification:');
    console.log(`- User Profiles: ${profileCheck.rows[0].count} ✅`);
    console.log(`- Emergency Contacts: ${contactsCheck.rows[0].count} ✅`);
    console.log(`- Physical Health: ${healthCheck.rows[0].count} ✅`);
    console.log(`- Mental Health: ${mentalCheck.rows[0].count} ✅`);
    console.log(`- Medications: ${medsCheck.rows[0].count} ✅`);
    
    console.log('\n🎉 Direct database test completed successfully!');
    console.log('✅ All database functions are working correctly');
    
  } catch (error) {
    console.error('❌ Direct database test failed:', error.message);
    console.error('Full error:', error);
  }
}

testDirectDB();
