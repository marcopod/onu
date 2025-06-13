"use client"

import { usePersistentRegistration, PersistentRegistrationProvider } from "@/components/auth/persistent-registration-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

function DebugRegistrationContent() {
  const { data, resetRegistration } = usePersistentRegistration()

  const downloadData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'registration-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const testSubmission = async () => {
    try {
      console.log('Testing registration submission with current data...')
      console.log('Data to submit:', JSON.stringify(data, null, 2))
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log('Registration response:', result)
      
      if (result.success) {
        alert('Registration test successful!')
      } else {
        alert(`Registration test failed: ${result.error}`)
      }
    } catch (error: any) {
      console.error('Registration test error:', error)
      alert(`Registration test error: ${error.message}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800">Registration Data Debug</h1>
          <div className="flex gap-2">
            <Button onClick={downloadData} variant="outline">
              Download Data
            </Button>
            <Button onClick={testSubmission} variant="outline">
              Test Submission
            </Button>
            <Button onClick={resetRegistration} variant="destructive">
              Reset Data
            </Button>
            <Link href="/register">
              <Button variant="outline">Back to Registration</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1 Data */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Authentication Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(data.step1, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Step 2 Data */}
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(data.step2, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Step 3 Data */}
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Physical Health</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(data.step3, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Step 4 Data */}
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Mental Health</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(data.step4, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Step 5 Data */}
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Harassment Experiences</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(data.step5, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Complete Data */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Registration Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    data.step1?.fullName && data.step1?.email && data.step1?.password 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    1
                  </div>
                  <p className="text-sm font-medium">Step 1</p>
                  <p className="text-xs text-gray-500">
                    {data.step1?.fullName && data.step1?.email && data.step1?.password ? 'Complete' : 'Incomplete'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    data.step2?.age && data.step2?.gender && data.step2?.emergencyContacts?.some(c => c.name && c.phone)
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    2
                  </div>
                  <p className="text-sm font-medium">Step 2</p>
                  <p className="text-xs text-gray-500">
                    {data.step2?.age && data.step2?.gender ? 'Complete' : 'Incomplete'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    data.step3?.weight || data.step3?.height || data.step3?.bloodType
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    3
                  </div>
                  <p className="text-sm font-medium">Step 3</p>
                  <p className="text-xs text-gray-500">
                    {data.step3?.weight || data.step3?.height ? 'Has Data' : 'Empty'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    data.step4?.psychiatricConditions || data.step4?.familyHistory
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    4
                  </div>
                  <p className="text-sm font-medium">Step 4</p>
                  <p className="text-xs text-gray-500">
                    {data.step4?.psychiatricConditions || data.step4?.familyHistory ? 'Has Data' : 'Empty'}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    data.step5?.experiences?.some(e => e.category && e.description)
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    5
                  </div>
                  <p className="text-sm font-medium">Step 5</p>
                  <p className="text-xs text-gray-500">
                    {data.step5?.experiences?.some(e => e.category && e.description) ? 'Has Data' : 'Empty'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function DebugRegistrationPage() {
  return (
    <PersistentRegistrationProvider>
      <DebugRegistrationContent />
    </PersistentRegistrationProvider>
  )
}
