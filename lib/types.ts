// User types
export interface User {
  id: number;
  email: string;
  fullName: string;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface UserProfile {
  id: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: number;
  userId: number;
  name: string;
  relationship: string;
  phone: string;
  createdAt: string;
}

export interface PhysicalHealth {
  id: number;
  userId: number;
  weight?: number;
  height?: number;
  bloodType?: string;
  hasDisability: boolean;
  disabilityDescription?: string;
  chronicConditions?: string;
  medicalAllergies?: string;
  foodAllergies?: string;
  environmentalAllergies?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: number;
  userId: number;
  name: string;
  dose?: string;
  frequency?: string;
  medicationType: 'general' | 'psychiatric';
  createdAt: string;
}

export interface MentalHealth {
  id: number;
  userId: number;
  psychiatricConditions?: string;
  hasAnxietyAttacks: boolean;
  anxietyFrequency?: string;
  familyHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HarassmentExperience {
  id: number;
  userId: number;
  category?: string;
  location?: string;
  incidentDate?: string;
  description?: string;
  reportedToAuthorities: boolean;
  createdAt: string;
}

export interface EvidenceFile {
  id: number;
  experienceId: number;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
}

export interface UserSession {
  id: number;
  userId: number;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
  isActive: boolean;
}

// Registration form types
export interface RegistrationStep1Data {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  identityDocument: File | null;
  profilePhoto: File | null;
}

export interface RegistrationStep2Data {
  age: string;
  gender: string;
  sexualOrientation: string;
  address: string;
  educationLevel: string;
  occupation: string;
  hobbies: string;
  frequentPlaces: string;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
}

export interface RegistrationStep3Data {
  weight: string;
  height: string;
  bloodType: string;
  hasDisability: boolean;
  disabilityDescription: string;
  chronicConditions: string;
  allergies: {
    medical: string;
    food: string;
    environmental: string;
  };
  currentMedications: Array<{
    name: string;
    dose: string;
    frequency: string;
  }>;
}

export interface RegistrationStep4Data {
  psychiatricConditions: string;
  hasAnxietyAttacks: boolean;
  anxietyFrequency: string;
  psychiatricMedications: Array<{
    name: string;
    dose: string;
    frequency: string;
  }>;
  familyHistory: string;
}

export interface RegistrationStep5Data {
  experiences: Array<{
    category: string;
    location: string;
    date: string;
    description: string;
    reportedToAuthorities: boolean;
    evidence: File[];
    evidenceErrors: string[];
  }>;
}

export interface CompleteRegistrationData {
  step1: RegistrationStep1Data;
  step2: RegistrationStep2Data;
  step3: RegistrationStep3Data;
  step4: RegistrationStep4Data;
  step5: RegistrationStep5Data;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumbers: boolean;
  hasSpecialChar: boolean;
  score: number;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// File upload types
export interface FileUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface FileValidation {
  isValid: boolean;
  error?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

// Context types for React
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: CompleteRegistrationData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface RegistrationContextType {
  currentStep: number;
  totalSteps: number;
  data: Partial<CompleteRegistrationData>;
  updateData: (step: keyof CompleteRegistrationData, data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetRegistration: () => void;
  isStepValid: (step: number) => boolean;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}
