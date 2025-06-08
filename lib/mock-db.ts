// Mock database for development testing when no real database is available
// This is a simple in-memory store - data will be lost on server restart

interface MockUser {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
  is_verified: boolean;
  last_login?: string;
}

interface MockSession {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  created_at: string;
  is_active: boolean;
}

// In-memory storage with global persistence
declare global {
  var mockDbData: {
    users: MockUser[];
    sessions: MockSession[];
    userProfiles: any[];
    emergencyContacts: any[];
    physicalHealth: any[];
    medications: any[];
    mentalHealth: any[];
    harassmentExperiences: any[];
    nextUserId: number;
    nextSessionId: number;
  } | undefined;
}

// Initialize or use existing global data
if (!global.mockDbData) {
  global.mockDbData = {
    users: [],
    sessions: [],
    userProfiles: [],
    emergencyContacts: [],
    physicalHealth: [],
    medications: [],
    mentalHealth: [],
    harassmentExperiences: [],
    nextUserId: 1,
    nextSessionId: 1
  };
}

// Use global data
const users = global.mockDbData.users;
const sessions = global.mockDbData.sessions;
const userProfiles = global.mockDbData.userProfiles;
const emergencyContacts = global.mockDbData.emergencyContacts;
const physicalHealth = global.mockDbData.physicalHealth;
const medications = global.mockDbData.medications;
const mentalHealth = global.mockDbData.mentalHealth;
const harassmentExperiences = global.mockDbData.harassmentExperiences;

function getNextUserId() { return global.mockDbData!.nextUserId; }
function setNextUserId(value: number) { global.mockDbData!.nextUserId = value; }

function getNextSessionId() { return global.mockDbData!.nextSessionId; }
function setNextSessionId(value: number) { global.mockDbData!.nextSessionId = value; }

// Mock database functions
export const mockDb = {
  // Initialize (no-op for mock)
  async initializeDatabase() {
    console.log('Mock database initialized (in-memory)');
  },

  // User functions
  async createUser(userData: {
    email: string;
    passwordHash: string;
    fullName: string;
  }) {
    const userId = getNextUserId();
    setNextUserId(userId + 1);

    const user: MockUser = {
      id: userId,
      email: userData.email,
      password_hash: userData.passwordHash,
      full_name: userData.fullName,
      created_at: new Date().toISOString(),
      is_verified: false
    };

    users.push(user);
    console.log('Mock user created:', { id: user.id, email: user.email });

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at
    };
  },

  async getUserByEmail(email: string) {
    const user = users.find(u => u.email === email);
    return user || null;
  },

  async getUserById(id: number) {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_verified: user.is_verified,
      last_login: user.last_login,
      created_at: user.created_at
    };
  },

  async updateUserLastLogin(userId: number) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.last_login = new Date().toISOString();
    }
  },

  // Profile functions
  async createUserProfile(profileData: any) {
    const profile = {
      id: userProfiles.length + 1,
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    userProfiles.push(profile);
    console.log('Mock profile created for user:', profileData.userId);
    return { id: profile.id };
  },

  async createEmergencyContacts(userId: number, contacts: any[]) {
    const results = [];
    for (const contact of contacts) {
      if (contact.name.trim() && contact.relationship.trim() && contact.phone.trim()) {
        const emergencyContact = {
          id: emergencyContacts.length + 1,
          user_id: userId,
          ...contact,
          created_at: new Date().toISOString()
        };
        emergencyContacts.push(emergencyContact);
        results.push({ id: emergencyContact.id });
      }
    }
    console.log('Mock emergency contacts created:', results.length);
    return results;
  },

  async createPhysicalHealth(healthData: any) {
    const health = {
      id: physicalHealth.length + 1,
      ...healthData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    physicalHealth.push(health);
    console.log('Mock physical health created for user:', healthData.userId);
    return { id: health.id };
  },

  async createMedications(userId: number, medicationList: any[]) {
    const results = [];
    for (const medication of medicationList) {
      if (medication.name.trim()) {
        const med = {
          id: medications.length + 1,
          user_id: userId,
          ...medication,
          created_at: new Date().toISOString()
        };
        medications.push(med);
        results.push({ id: med.id });
      }
    }
    console.log('Mock medications created:', results.length);
    return results;
  },

  async createMentalHealth(mentalHealthData: any) {
    const mental = {
      id: mentalHealth.length + 1,
      ...mentalHealthData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mentalHealth.push(mental);
    console.log('Mock mental health created for user:', mentalHealthData.userId);
    return { id: mental.id };
  },

  async createHarassmentExperiences(userId: number, experiences: any[]) {
    const results = [];
    for (const experience of experiences) {
      if (experience.category.trim() && experience.description.trim()) {
        const exp = {
          id: harassmentExperiences.length + 1,
          user_id: userId,
          ...experience,
          created_at: new Date().toISOString()
        };
        harassmentExperiences.push(exp);
        results.push({ id: exp.id });
      }
    }
    console.log('Mock harassment experiences created:', results.length);
    return results;
  },

  // Session functions
  async createSession(userId: number, tokenHash: string, expiresAt: Date) {
    const sessionId = getNextSessionId();
    setNextSessionId(sessionId + 1);

    const session: MockSession = {
      id: sessionId,
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      is_active: true
    };
    sessions.push(session);
    console.log('Mock session created for user:', userId, 'with hash:', tokenHash);
    return { id: session.id };
  },

  async getActiveSession(tokenHash: string) {
    console.log('=== MOCK getActiveSession DEBUG ===');
    console.log('Looking for tokenHash:', tokenHash);
    console.log('Available sessions:', sessions.length);
    console.log('Sessions:', sessions.map(s => ({
      id: s.id,
      user_id: s.user_id,
      token_hash: s.token_hash,
      is_active: s.is_active,
      expires_at: s.expires_at,
      expired: new Date(s.expires_at) <= new Date()
    })));

    const session = sessions.find(s =>
      s.token_hash === tokenHash &&
      s.is_active &&
      new Date(s.expires_at) > new Date()
    );

    console.log('Session found:', !!session);
    if (!session) {
      console.log('No matching session found');
      return null;
    }

    const user = users.find(u => u.id === session.user_id);
    console.log('User found for session:', !!user);
    if (!user) return null;

    const result = {
      ...session,
      email: user.email,
      full_name: user.full_name
    };

    console.log('getActiveSession result:', result);
    console.log('================================');
    return result;
  },

  async invalidateSession(tokenHash: string) {
    const session = sessions.find(s => s.token_hash === tokenHash);
    if (session) {
      session.is_active = false;
    }
  },

  async invalidateAllUserSessions(userId: number) {
    sessions.forEach(session => {
      if (session.user_id === userId) {
        session.is_active = false;
      }
    });
  },

  // Debug functions
  getDebugInfo() {
    return {
      users: users.length,
      sessions: sessions.filter(s => s.is_active).length,
      profiles: userProfiles.length,
      emergencyContacts: emergencyContacts.length,
      physicalHealth: physicalHealth.length,
      medications: medications.length,
      mentalHealth: mentalHealth.length,
      harassmentExperiences: harassmentExperiences.length
    };
  },

  // Clear all data (for testing)
  clearAllData() {
    users.length = 0;
    sessions.length = 0;
    userProfiles.length = 0;
    emergencyContacts.length = 0;
    physicalHealth.length = 0;
    medications.length = 0;
    mentalHealth.length = 0;
    harassmentExperiences.length = 0;
    setNextUserId(1);
    setNextSessionId(1);
    console.log('Mock database cleared');
  }
};

// Export the same interface as the real db
export const {
  initializeDatabase,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserLastLogin,
  createUserProfile,
  createEmergencyContacts,
  createPhysicalHealth,
  createMedications,
  createMentalHealth,
  createHarassmentExperiences,
  createSession,
  getActiveSession,
  invalidateSession,
  invalidateAllUserSessions
} = mockDb;
