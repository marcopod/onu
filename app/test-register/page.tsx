"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function TestRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.fullName || formData.fullName.length < 2) {
      toast.error("Full name must be at least 2 characters")
      return false
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email")
      return false
    }
    
    if (!formData.password || formData.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      // Create minimal registration data
      const registrationData = {
        step1: {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
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

      console.log('=== TEST REGISTRATION DEBUG ===');
      console.log('Form data:', formData);
      console.log('Submitting registration:', JSON.stringify(registrationData, null, 2));
      console.log('===============================');

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData),
      })

      const result = await response.json()
      console.log('Registration response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      if (result.success) {
        toast.success("Registration successful! You are now logged in.")
        router.push('/')
      } else {
        throw new Error(result.error || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold text-green-800 mb-6">Test Registration</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-green-800 font-medium">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="border-green-200 rounded-xl"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-800 font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-green-200 rounded-xl"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-800 font-medium">
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password (min 8 characters)"
                className="border-green-200 rounded-xl"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-800 font-medium">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="border-green-200 rounded-xl"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register & Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              This is a simplified test registration form.{" "}
              <a href="/register" className="text-green-600 font-medium hover:text-green-700">
                Use full registration
              </a>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-green-600 font-medium hover:text-green-700">
                Login here
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
