"use client"

import { useState } from "react"
import { PersistentRegistrationProvider, usePersistentRegistration, usePersistentUpdateStepData } from "@/components/auth/persistent-registration-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function TestContent() {
  const { data } = usePersistentRegistration()
  const updateStepData = usePersistentUpdateStepData()
  
  const [testData, setTestData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSave = () => {
    console.log('Saving test data:', testData)
    updateStepData('step1', {
      ...testData,
      identityDocument: null,
      profilePhoto: null
    })
  }

  const handleClear = () => {
    localStorage.removeItem('harassment-reporting-registration-data')
    window.location.reload()
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Persistent Registration Context</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Input Test Data</h2>
          
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={testData.fullName}
              onChange={(e) => setTestData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={testData.email}
              onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={testData.password}
              onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={testData.confirmPassword}
              onChange={(e) => setTestData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm password"
            />
          </div>
          
          <div className="space-x-2">
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              Save to Context
            </Button>
            <Button onClick={handleClear} variant="outline">
              Clear Storage
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Current Context Data</h2>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-medium mb-2">Step 1 Data:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data.step1, null, 2)}
            </pre>
          </div>
          
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-medium mb-2">Validation Check:</h3>
            <p><strong>Full Name:</strong> {data.step1?.fullName || 'Missing'}</p>
            <p><strong>Email:</strong> {data.step1?.email || 'Missing'}</p>
            <p><strong>Password:</strong> {data.step1?.password ? 'Present' : 'Missing'}</p>
            <p><strong>Confirm Password:</strong> {data.step1?.confirmPassword ? 'Present' : 'Missing'}</p>
          </div>
          
          <div className="space-y-2">
            <a 
              href="/register" 
              className="block bg-green-500 text-white text-center px-4 py-2 rounded hover:bg-green-600"
            >
              Go to Registration
            </a>
            <a 
              href="/register/complete" 
              className="block bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Complete Page
            </a>
            <a 
              href="/debug-registration" 
              className="block bg-purple-500 text-white text-center px-4 py-2 rounded hover:bg-purple-600"
            >
              Go to Debug Page
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Fill out the form on the left</li>
          <li>Click "Save to Context" to save the data</li>
          <li>Check that the data appears on the right</li>
          <li>Navigate to the registration page to see if data persists</li>
          <li>Try completing the registration flow</li>
        </ol>
      </div>
    </div>
  )
}

export default function TestPersistentContextPage() {
  return (
    <PersistentRegistrationProvider>
      <TestContent />
    </PersistentRegistrationProvider>
  )
}
