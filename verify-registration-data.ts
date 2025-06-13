require('dotenv').config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

async function verifyRegistrationData() {
  try {
    console.log('🔍 Verifying Registration Data in Database...\n');
    
    // Find the test user
    console.log('1️⃣ Looking for test user...');
    const users = await sql`
      SELECT id, email, full_name, created_at, is_verified
      FROM users 
      WHERE email = 'complete-test@example.com'
    `;
    
    if (users.rows.length === 0) {
      console.log('❌ Test user not found. Please run the registration test first.');
      return;
    }
    
    const user = users.rows[0];
    console.log('✅ Found test user:', {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      isVerified: user.is_verified
    });
    
    const userId = user.id;
    
    // Check user profile
    console.log('\n2️⃣ Checking user profile...');
    const profiles = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `;
    
    if (profiles.rows.length > 0) {
      const profile = profiles.rows[0];
      console.log('✅ Found user profile:', {
        age: profile.age,
        gender: profile.gender,
        address: profile.address,
        occupation: profile.occupation,
        profilePhotoUrl: profile.profile_photo_url,
        identityDocumentUrl: profile.identity_document_url
      });
    } else {
      console.log('❌ No user profile found');
    }
    
    // Check emergency contacts
    console.log('\n3️⃣ Checking emergency contacts...');
    const contacts = await sql`
      SELECT name, relationship, phone FROM emergency_contacts WHERE user_id = ${userId}
    `;
    
    console.log(`✅ Found ${contacts.rows.length} emergency contacts:`);
    contacts.rows.forEach((contact, index) => {
      console.log(`  ${index + 1}. ${contact.name} (${contact.relationship}) - ${contact.phone}`);
    });
    
    // Check physical health
    console.log('\n4️⃣ Checking physical health...');
    const health = await sql`
      SELECT * FROM physical_health WHERE user_id = ${userId}
    `;
    
    if (health.rows.length > 0) {
      const healthRecord = health.rows[0];
      console.log('✅ Found physical health record:', {
        weight: healthRecord.weight,
        height: healthRecord.height,
        bloodType: healthRecord.blood_type,
        hasDisability: healthRecord.has_disability,
        chronicConditions: healthRecord.chronic_conditions,
        medicalAllergies: healthRecord.medical_allergies,
        foodAllergies: healthRecord.food_allergies,
        environmentalAllergies: healthRecord.environmental_allergies
      });
    } else {
      console.log('❌ No physical health record found');
    }
    
    // Check medications
    console.log('\n5️⃣ Checking medications...');
    const medications = await sql`
      SELECT name, dose, frequency, medication_type FROM medications WHERE user_id = ${userId}
    `;
    
    console.log(`✅ Found ${medications.rows.length} medications:`);
    medications.rows.forEach((med, index) => {
      console.log(`  ${index + 1}. ${med.name} - ${med.dose} (${med.frequency}) [${med.medication_type}]`);
    });
    
    // Check mental health
    console.log('\n6️⃣ Checking mental health...');
    const mental = await sql`
      SELECT * FROM mental_health WHERE user_id = ${userId}
    `;
    
    if (mental.rows.length > 0) {
      const mentalRecord = mental.rows[0];
      console.log('✅ Found mental health record:', {
        psychiatricConditions: mentalRecord.psychiatric_conditions,
        hasAnxietyAttacks: mentalRecord.has_anxiety_attacks,
        anxietyFrequency: mentalRecord.anxiety_frequency,
        familyHistory: mentalRecord.family_history
      });
    } else {
      console.log('❌ No mental health record found');
    }
    
    // Check harassment experiences
    console.log('\n7️⃣ Checking harassment experiences...');
    const experiences = await sql`
      SELECT id, category, location, incident_date, description, reported_to_authorities 
      FROM harassment_experiences WHERE user_id = ${userId}
    `;
    
    console.log(`✅ Found ${experiences.rows.length} harassment experiences:`);
    experiences.rows.forEach((exp, index) => {
      console.log(`  ${index + 1}. ${exp.category} at ${exp.location} on ${exp.incident_date}`);
      console.log(`     Reported: ${exp.reported_to_authorities ? 'Yes' : 'No'}`);
      console.log(`     Description: ${exp.description.substring(0, 100)}...`);
      
      // Check evidence files for this experience
      const evidenceQuery = sql`
        SELECT file_name, file_url FROM evidence_files WHERE experience_id = ${exp.id}
      `;
      evidenceQuery.then(evidence => {
        if (evidence.rows.length > 0) {
          console.log(`     Evidence files: ${evidence.rows.length}`);
          evidence.rows.forEach(file => {
            console.log(`       - ${file.file_name}: ${file.file_url}`);
          });
        }
      });
    });
    
    console.log('\n✅ Database verification completed!');
    
    // Summary
    console.log('\n📊 Registration Data Summary:');
    console.log(`- User: ✅ (ID: ${userId})`);
    console.log(`- Profile: ${profiles.rows.length > 0 ? '✅' : '❌'}`);
    console.log(`- Emergency Contacts: ${contacts.rows.length > 0 ? `✅ (${contacts.rows.length})` : '❌'}`);
    console.log(`- Physical Health: ${health.rows.length > 0 ? '✅' : '❌'}`);
    console.log(`- Medications: ${medications.rows.length > 0 ? `✅ (${medications.rows.length})` : '❌'}`);
    console.log(`- Mental Health: ${mental.rows.length > 0 ? '✅' : '❌'}`);
    console.log(`- Harassment Experiences: ${experiences.rows.length > 0 ? `✅ (${experiences.rows.length})` : '❌'}`);
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    console.error('Full error:', error);
  }
}

verifyRegistrationData();
