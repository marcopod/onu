'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CompleteRegistrationData, RegistrationContextType } from '@/lib/types';

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

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

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<CompleteRegistrationData>>(initialData);
  const totalSteps = 5;

  const updateData = useCallback((step: keyof CompleteRegistrationData, stepData: any) => {
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
        // Step 3 is optional, so it's always valid
        return true;

      case 4:
        // Step 4 is optional, so it's always valid
        return true;

      case 5:
        // Step 5 is optional, so it's always valid
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

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}

// Hook to get current step data with type safety
export function useCurrentStepData<T>(step: keyof CompleteRegistrationData): T | undefined {
  const { data } = useRegistration();
  return data[step] as T;
}

// Hook to update current step data with type safety
export function useUpdateStepData() {
  const { updateData } = useRegistration();
  
  return <T>(step: keyof CompleteRegistrationData, stepData: T) => {
    updateData(step, stepData);
  };
}
