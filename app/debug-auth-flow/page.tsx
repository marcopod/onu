"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DebugAuthFlowPage() {
  const [testData, setTestData] = useState({
    fullName: "Test User",
    email: "test@example.com",
    password: "TestPass123",
    confirmPassword: "TestPass123"
  })
  const [results, setResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(true)
    try {
      const result = await testFn()
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }))
    } catch (error: any) {
      setResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }))
    } finally {
      setIsLoading(false)
    }
  }

  const testCookieSupport = async () => {
    // Test setting a cookie
    const setResponse = await fetch('/api/test-cookie', { method: 'POST' })
    const setResult = await setResponse.json()
    
    // Test reading the cookie
    const getResponse = await fetch('/api/test-cookie', { method: 'GET' })
    const getResult = await getResponse.json()
    
    return { setResult, getResult }
  }

  const testRegistration = async () => {
    const registrationData = {
      step1: {
        fullName: testData.fullName,
        email: testData.email,
        password: testData.password,
        confirmPassword: testData.confirmPassword,
        identityDocument: null,
        profilePhoto: null
      },
      step2: {
        age: "25",
        gender: "Other",
        sexualOrientation: "",
        address: "",
        educationLevel: "",
        occupation: "",
        hobbies: "",
        frequentPlaces: "",
        emergencyContacts: [
          { name: "Test Contact", relationship: "Friend", phone: "123-456-7890" }
        ]
      }
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(registrationData),
    })

    const result = await response.json()
    return { status: response.status, result }
  }

  const testCurrentUser = async () => {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    })

    const result = await response.json()
    return { status: response.status, result }
  }

  const testLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: testData.email,
        password: testData.password
      }),
    })

    const result = await response.json()
    return { status: response.status, result }
  }

  const testDebugAuth = async () => {
    const response = await fetch('/api/debug-auth', {
      method: 'GET',
      credentials: 'include',
    })

    const result = await response.json()
    return { status: response.status, result }
  }

  const clearCookies = () => {
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    setResults(prev => ({ ...prev, cookiesCleared: { success: true, data: 'Cookies cleared' } }))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authentication Flow Debug</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Configuration</h2>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={testData.fullName}
              onChange={(e) => setTestData(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={testData.email}
              onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={testData.password}
              onChange={(e) => setTestData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>

          <h2 className="text-xl font-semibold mt-6">Test Actions</h2>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => runTest('cookieSupport', testCookieSupport)}
              disabled={isLoading}
              variant="outline"
            >
              Test Cookies
            </Button>
            
            <Button 
              onClick={() => runTest('registration', testRegistration)}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              Test Registration
            </Button>
            
            <Button 
              onClick={() => runTest('currentUser', testCurrentUser)}
              disabled={isLoading}
              variant="outline"
            >
              Test /api/auth/me
            </Button>
            
            <Button 
              onClick={() => runTest('login', testLogin)}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Test Login
            </Button>
            
            <Button 
              onClick={() => runTest('debugAuth', testDebugAuth)}
              disabled={isLoading}
              variant="outline"
            >
              Test Debug Auth
            </Button>
            
            <Button 
              onClick={clearCookies}
              disabled={isLoading}
              variant="destructive"
            >
              Clear Cookies
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results</h2>
          
          <div className="space-y-4 max-h-96 overflow-auto">
            {Object.entries(results).map(([testName, result]: [string, any]) => (
              <div key={testName} className={`p-4 rounded border ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className="font-semibold capitalize">{testName}</h3>
                <div className="text-sm mt-2">
                  <strong>Status:</strong> {result.success ? 'SUCCESS' : 'FAILED'}
                </div>
                {result.error && (
                  <div className="text-sm text-red-600 mt-1">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">View Details</summary>
                  <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li><strong>Test Cookies:</strong> Verify cookie setting/reading works</li>
          <li><strong>Test Registration:</strong> Register a new user and check if cookie is set</li>
          <li><strong>Test /api/auth/me:</strong> Check if you're authenticated after registration</li>
          <li><strong>Clear Cookies:</strong> Clear all cookies and test again</li>
          <li><strong>Test Login:</strong> Login with the registered user</li>
          <li><strong>Test Debug Auth:</strong> Get detailed authentication debug info</li>
        </ol>
      </div>
    </div>
  )
}
