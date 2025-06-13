import { sql } from '@vercel/postgres';

// Database connection utility
export const db = sql;

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        last_login TIMESTAMP
      )
    `;

    // User profiles table (personal information)
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        age INTEGER,
        gender VARCHAR(50),
        sexual_orientation VARCHAR(100),
        address TEXT,
        education_level VARCHAR(100),
        occupation VARCHAR(255),
        hobbies TEXT,
        frequent_places TEXT,
        identity_document_url VARCHAR(500),
        profile_photo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Emergency contacts table
    await sql`
      CREATE TABLE IF NOT EXISTS emergency_contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        relationship VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Physical health table
    await sql`
      CREATE TABLE IF NOT EXISTS physical_health (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        weight DECIMAL(5,2),
        height DECIMAL(5,2),
        blood_type VARCHAR(10),
        has_disability BOOLEAN DEFAULT FALSE,
        disability_description TEXT,
        chronic_conditions TEXT,
        medical_allergies TEXT,
        food_allergies TEXT,
        environmental_allergies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Medications table
    await sql`
      CREATE TABLE IF NOT EXISTS medications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        dose VARCHAR(100),
        frequency VARCHAR(100),
        medication_type VARCHAR(50) DEFAULT 'general', -- 'general' or 'psychiatric'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Mental health table
    await sql`
      CREATE TABLE IF NOT EXISTS mental_health (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        psychiatric_conditions TEXT,
        has_anxiety_attacks BOOLEAN DEFAULT FALSE,
        anxiety_frequency VARCHAR(100),
        family_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Harassment experiences table
    await sql`
      CREATE TABLE IF NOT EXISTS harassment_experiences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100),
        location TEXT,
        incident_date DATE,
        description TEXT,
        reported_to_authorities BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Evidence files table
    await sql`
      CREATE TABLE IF NOT EXISTS evidence_files (
        id SERIAL PRIMARY KEY,
        experience_id INTEGER REFERENCES harassment_experiences(id) ON DELETE CASCADE,
        file_url VARCHAR(500) NOT NULL,
        file_name VARCHAR(255),
        file_type VARCHAR(100),
        file_size INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Sessions table for JWT token management
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
      )
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// User management functions
export async function createUser(userData: {
  email: string;
  passwordHash: string;
  fullName: string;
}) {
  const { email, passwordHash, fullName } = userData;

  const result = await sql`
    INSERT INTO users (email, password_hash, full_name)
    VALUES (${email}, ${passwordHash}, ${fullName})
    RETURNING id, email, full_name, created_at
  `;

  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, email, password_hash, full_name, is_verified, last_login
    FROM users
    WHERE email = ${email}
  `;

  return result.rows[0] || null;
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT id, email, full_name, is_verified, last_login, created_at
    FROM users
    WHERE id = ${id}
  `;

  return result.rows[0] || null;
}

export async function updateUserLastLogin(userId: number) {
  await sql`
    UPDATE users
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;
}

// Profile management functions
export async function createUserProfile(profileData: {
  userId: number;
  age?: number;
  gender?: string;
  sexualOrientation?: string;
  address?: string;
  educationLevel?: string;
  occupation?: string;
  hobbies?: string;
  frequentPlaces?: string;
  identityDocumentUrl?: string;
  profilePhotoUrl?: string;
}) {
  const {
    userId, age, gender, sexualOrientation, address, educationLevel,
    occupation, hobbies, frequentPlaces, identityDocumentUrl, profilePhotoUrl
  } = profileData;

  console.log('Creating user profile with data:', {
    userId,
    age,
    gender,
    hasIdentityDoc: !!identityDocumentUrl,
    hasProfilePhoto: !!profilePhotoUrl
  });

  const result = await sql`
    INSERT INTO user_profiles (
      user_id, age, gender, sexual_orientation, address, education_level,
      occupation, hobbies, frequent_places, identity_document_url, profile_photo_url
    )
    VALUES (
      ${userId}, ${age || null}, ${gender || null}, ${sexualOrientation || null},
      ${address || null}, ${educationLevel || null}, ${occupation || null},
      ${hobbies || null}, ${frequentPlaces || null}, ${identityDocumentUrl || null},
      ${profilePhotoUrl || null}
    )
    RETURNING id
  `;

  console.log('User profile created with ID:', result.rows[0].id);
  return result.rows[0];
}

// Emergency contacts functions
export async function createEmergencyContacts(userId: number, contacts: Array<{
  name: string;
  relationship: string;
  phone: string;
}>) {
  const results = [];

  for (const contact of contacts) {
    if (contact.name.trim() && contact.relationship.trim() && contact.phone.trim()) {
      const result = await sql`
        INSERT INTO emergency_contacts (user_id, name, relationship, phone)
        VALUES (${userId}, ${contact.name}, ${contact.relationship}, ${contact.phone})
        RETURNING id
      `;
      results.push(result.rows[0]);
    }
  }

  return results;
}

// Physical health functions
export async function createPhysicalHealth(healthData: {
  userId: number;
  weight?: number;
  height?: number;
  bloodType?: string;
  hasDisability?: boolean;
  disabilityDescription?: string;
  chronicConditions?: string;
  medicalAllergies?: string;
  foodAllergies?: string;
  environmentalAllergies?: string;
}) {
  const {
    userId, weight, height, bloodType, hasDisability, disabilityDescription,
    chronicConditions, medicalAllergies, foodAllergies, environmentalAllergies
  } = healthData;

  console.log('Creating physical health record with data:', {
    userId,
    weight,
    height,
    bloodType,
    hasDisability
  });

  const result = await sql`
    INSERT INTO physical_health (
      user_id, weight, height, blood_type, has_disability, disability_description,
      chronic_conditions, medical_allergies, food_allergies, environmental_allergies
    )
    VALUES (
      ${userId}, ${weight || null}, ${height || null}, ${bloodType || null},
      ${hasDisability || false}, ${disabilityDescription || null},
      ${chronicConditions || null}, ${medicalAllergies || null},
      ${foodAllergies || null}, ${environmentalAllergies || null}
    )
    RETURNING id
  `;

  console.log('Physical health record created with ID:', result.rows[0].id);
  return result.rows[0];
}

// Medications functions
export async function createMedications(userId: number, medications: Array<{
  name: string;
  dose: string;
  frequency: string;
  type?: string;
}>) {
  const results = [];

  for (const medication of medications) {
    if (medication.name.trim()) {
      const result = await sql`
        INSERT INTO medications (user_id, name, dose, frequency, medication_type)
        VALUES (${userId}, ${medication.name}, ${medication.dose}, ${medication.frequency}, ${medication.type || 'general'})
        RETURNING id
      `;
      results.push(result.rows[0]);
    }
  }

  return results;
}

// Mental health functions
export async function createMentalHealth(mentalHealthData: {
  userId: number;
  psychiatricConditions?: string;
  hasAnxietyAttacks?: boolean;
  anxietyFrequency?: string;
  familyHistory?: string;
}) {
  const {
    userId, psychiatricConditions, hasAnxietyAttacks, anxietyFrequency, familyHistory
  } = mentalHealthData;

  console.log('Creating mental health record with data:', {
    userId,
    hasPsychConditions: !!psychiatricConditions,
    hasAnxietyAttacks,
    hasFamilyHistory: !!familyHistory
  });

  const result = await sql`
    INSERT INTO mental_health (
      user_id, psychiatric_conditions, has_anxiety_attacks, anxiety_frequency, family_history
    )
    VALUES (
      ${userId}, ${psychiatricConditions || null}, ${hasAnxietyAttacks || false},
      ${anxietyFrequency || null}, ${familyHistory || null}
    )
    RETURNING id
  `;

  console.log('Mental health record created with ID:', result.rows[0].id);
  return result.rows[0];
}

// Harassment experiences functions
export async function createHarassmentExperiences(userId: number, experiences: Array<{
  category: string;
  location: string;
  date: string;
  description: string;
  reportedToAuthorities: boolean;
  evidenceFiles?: Array<{
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }>;
}>) {
  const results = [];

  for (const experience of experiences) {
    if (experience.category.trim() && experience.description.trim()) {
      const result = await sql`
        INSERT INTO harassment_experiences (
          user_id, category, location, incident_date, description, reported_to_authorities
        )
        VALUES (
          ${userId}, ${experience.category}, ${experience.location},
          ${experience.date || null}, ${experience.description}, ${experience.reportedToAuthorities}
        )
        RETURNING id
      `;

      const experienceId = result.rows[0].id;

      // Insert evidence files if provided
      if (experience.evidenceFiles && experience.evidenceFiles.length > 0) {
        for (const file of experience.evidenceFiles) {
          await sql`
            INSERT INTO evidence_files (experience_id, file_url, file_name, file_type, file_size)
            VALUES (${experienceId}, ${file.fileUrl}, ${file.fileName}, ${file.fileType}, ${file.fileSize})
          `;
        }
      }

      results.push(result.rows[0]);
    }
  }

  return results;
}

// Session management functions
export async function createSession(userId: number, tokenHash: string, expiresAt: Date) {
  const result = await sql`
    INSERT INTO user_sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
    RETURNING id
  `;

  return result.rows[0];
}

export async function getActiveSession(tokenHash: string) {
  const result = await sql`
    SELECT us.*, u.email, u.full_name
    FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token_hash = ${tokenHash}
    AND us.is_active = true
    AND us.expires_at > CURRENT_TIMESTAMP
  `;

  return result.rows[0] || null;
}

export async function invalidateSession(tokenHash: string) {
  await sql`
    UPDATE user_sessions
    SET is_active = false
    WHERE token_hash = ${tokenHash}
  `;
}

export async function invalidateAllUserSessions(userId: number) {
  await sql`
    UPDATE user_sessions
    SET is_active = false
    WHERE user_id = ${userId}
  `;
}