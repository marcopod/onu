"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CompleteRegistrationData, RegistrationContextType } from '@/lib/types';

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const STORAGE_KEY = 'harassment-reporting-registration-data';

const initialData: Partial<CompleteRegistrationData> = {
  step1: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    identityDocument: null,
    profilePhoto: null,
  },
  step2: {
    age: '',
    gender: '',
    sexualOrientation: '',
    address: '',
    educationLevel: '',
    occupation: '',
    hobbies: '',
    frequentPlaces: '',
    emergencyContacts: [{ name: '', relationship: '', phone: '' }],
  },
  step3: {
    weight: '',
    height: '',
    bloodType: '',
    hasDisability: false,
    disabilityDescription: '',
    chronicConditions: '',
    allergies: {
      medical: '',
      food: '',
      environmental: '',
    },
    currentMedications: [{ name: '', dose: '', frequency: '' }],
  },
  step4: {
    psychiatricConditions: '',
    hasAnxietyAttacks: false,
    anxietyFrequency: '',
    psychiatricMedications: [{ name: '', dose: '', frequency: '' }],
    familyHistory: '',
  },
  step5: {
    experiences: [{
      category: '',
      location: '',
      date: '',
      description: '',
      reportedToAuthorities: false,
      evidence: [],
      evidenceErrors: [],
    }],
  },
};

export function PersistentRegistrationProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<CompleteRegistrationData>>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalSteps = 4;

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log('Loaded registration data from localStorage:', parsedData);
        setData(parsedData);
      }
    } catch (error) {
      console.error('Error loading registration data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('Saved registration data to localStorage:', data);
      } catch (error) {
        console.error('Error saving registration data:', error);
      }
    }
  }, [data, isLoaded]);

  const updateData = useCallback((step: keyof CompleteRegistrationData, stepData: any) => {
    console.log(`Updating ${step} with data:`, stepData);
    setData(prev => ({
      ...prev,
      [step]: stepData,
    }));
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetRegistration = () => {
    setCurrentStep(1);
    setData(initialData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing registration data:', error);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        const step1Data = data.step1;
        return !!(
          step1Data?.fullName &&
          step1Data?.email &&
          step1Data?.password &&
          step1Data?.confirmPassword &&
          step1Data.password === step1Data.confirmPassword &&
          step1Data.fullName.length >= 2 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1Data.email) &&
          step1Data.password.length >= 8
        );

      case 2:
        const step2Data = data.step2;
        if (!step2Data) return false;
        
        const ageNum = parseInt(step2Data.age);
        const hasValidAge = ageNum >= 13 && ageNum <= 120;
        const hasGender = step2Data.gender !== '';
        const hasValidEmergencyContact = step2Data.emergencyContacts?.some(contact => 
          contact.name.trim() !== '' && 
          contact.relationship.trim() !== '' && 
          contact.phone.trim() !== ''
        );
        
        return hasValidAge && hasGender && !!hasValidEmergencyContact;

      case 3:
      case 4:
      case 5:
        // Optional steps
        return true;

      default:
        return false;
    }
  };

  const value: RegistrationContextType = {
    currentStep,
    totalSteps,
    data,
    updateData,
    nextStep,
    prevStep,
    resetRegistration,
    isStepValid,
  };

  // Don't render until data is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function usePersistentRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('usePersistentRegistration must be used within a PersistentRegistrationProvider');
  }
  return context;
}

// Hook to get current step data with type safety
export function usePersistentCurrentStepData<T>(step: keyof CompleteRegistrationData): T | undefined {
  const { data } = usePersistentRegistration();
  return data[step] as T;
}

// Hook to update current step data with type safety
export function usePersistentUpdateStepData() {
  const { updateData } = usePersistentRegistration();
  
  return <T>(step: keyof CompleteRegistrationData, stepData: T) => {
    updateData(step, stepData);
  };
}
