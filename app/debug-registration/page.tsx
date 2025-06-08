"use client"

import { RegistrationProvider, useRegistration } from "@/components/auth/registration-context"

function DebugContent() {
  const { data, currentStep, isStepValid } = useRegistration()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registration Context Debug</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Current State</h2>
          <p><strong>Current Step:</strong> {currentStep}</p>
          <p><strong>Step 1 Valid:</strong> {isStepValid(1) ? 'Yes' : 'No'}</p>
          <p><strong>Step 2 Valid:</strong> {isStepValid(2) ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Step 1 Data</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data.step1, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Step 2 Data</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data.step2, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">All Registration Data</h2>
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Validation Check</h2>
          <div className="space-y-2">
            <p><strong>Step1 exists:</strong> {data.step1 ? 'Yes' : 'No'}</p>
            <p><strong>Full Name:</strong> {data.step1?.fullName || 'Missing'}</p>
            <p><strong>Email:</strong> {data.step1?.email || 'Missing'}</p>
            <p><strong>Password:</strong> {data.step1?.password ? 'Present' : 'Missing'}</p>
            <p><strong>Confirm Password:</strong> {data.step1?.confirmPassword ? 'Present' : 'Missing'}</p>
          </div>
        </div>

        <div className="space-x-4">
          <a 
            href="/register" 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Registration
          </a>
          <a 
            href="/test-register" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Test Registration
          </a>
        </div>
      </div>
    </div>
  )
}

export default function DebugRegistrationPage() {
  return (
    <RegistrationProvider>
      <DebugContent />
    </RegistrationProvider>
  )
}
