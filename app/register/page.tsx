"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Lock, Upload, User } from "lucide-react"
import { PersistentRegistrationProvider, usePersistentRegistration, usePersistentCurrentStepData, usePersistentUpdateStepData } from "@/components/auth/persistent-registration-context"
import { AuthRoute } from "@/components/auth/route-guard"
import { RegistrationStep1Data } from "@/lib/types"

function RegisterPageContent() {
  const stepData = usePersistentCurrentStepData<RegistrationStep1Data>('step1')
  const updateStepData = usePersistentUpdateStepData()
  const { isStepValid } = usePersistentRegistration()

  const [formData, setFormData] = useState({
    fullName: stepData?.fullName || "",
    email: stepData?.email || "",
    password: stepData?.password || "",
    confirmPassword: stepData?.confirmPassword || "",
    identityDocument: stepData?.identityDocument || null,
    profilePhoto: stepData?.profilePhoto || null
  })

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    updateStepData('step1', newFormData)
  }

  const handleFileChange = (field: string, file: File | null) => {
    const newFormData = { ...formData, [field]: file }
    setFormData(newFormData)
    updateStepData('step1', newFormData)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasMinLength = password.length >= 8

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasMinLength,
      isValid: hasUpperCase && hasLowerCase && hasNumbers && hasMinLength
    }
  }

  const validateFile = (file: File | null, maxSize: number = 10 * 1024 * 1024) => {
    if (!file) return { isValid: false, error: "" }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    const isValidType = allowedTypes.includes(file.type)
    const isValidSize = file.size <= maxSize

    if (!isValidType) {
      return { isValid: false, error: "Formato no válido. Solo se permiten PDF, JPG y PNG" }
    }
    if (!isValidSize) {
      return { isValid: false, error: `El archivo debe ser menor a ${maxSize / (1024 * 1024)}MB` }
    }

    return { isValid: true, error: "" }
  }

  const passwordValidation = validatePassword(formData.password)
  const emailValidation = validateEmail(formData.email)
  const documentValidation = validateFile(formData.identityDocument)
  const profilePhotoValidation = validateFile(formData.profilePhoto, 5 * 1024 * 1024) // 5MB for photos

  const isFormValid = () => {
    return formData.fullName.length >= 2 &&
           emailValidation &&
           passwordValidation.isValid &&
           formData.password === formData.confirmPassword &&
           documentValidation.isValid
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/login" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Crear Cuenta</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Paso 1 de 4</span>
              <span className="text-sm text-gray-500">Información del perfil</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-green-800 font-medium">
                Nombre completo *
              </Label>
              <div className="relative">
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  className="pl-10 border-green-200 rounded-xl"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
              {formData.fullName.length > 0 && formData.fullName.length < 2 && (
                <p className="text-sm text-red-500">El nombre debe tener al menos 2 caracteres</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-800 font-medium">
                Correo electrónico *
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  className="pl-10 border-green-200 rounded-xl"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
              {formData.email.length > 0 && !emailValidation && (
                <p className="text-sm text-red-500">Ingresa un correo electrónico válido</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-800 font-medium">
                Contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres, mayúsculas, minúsculas y números"
                  className="pl-10 border-green-200 rounded-xl"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
              {formData.password.length > 0 && !passwordValidation.isValid && (
                <div className="text-sm space-y-1">
                  <p className={`${passwordValidation.hasMinLength ? 'text-green-600' : 'text-red-500'}`}>
                    ✓ Mínimo 8 caracteres
                  </p>
                  <p className={`${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-500'}`}>
                    ✓ Al menos una mayúscula
                  </p>
                  <p className={`${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-500'}`}>
                    ✓ Al menos una minúscula
                  </p>
                  <p className={`${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>
                    ✓ Al menos un número
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-800 font-medium">
                Confirmar contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  className="pl-10 border-green-200 rounded-xl"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
              {formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword && (
                <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Documento de identidad *</Label>
              <p className="text-sm text-gray-600">INE o pasaporte (máximo 10MB)</p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-2 border-green-200 h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => document.getElementById('identityDocument')?.click()}
              >
                <Upload className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-500">
                  {formData.identityDocument ? formData.identityDocument.name : "Subir documento"}
                </span>
              </Button>
              <input
                id="identityDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileChange('identityDocument', e.target.files?.[0] || null)}
              />
              {formData.identityDocument && !documentValidation.isValid && (
                <p className="text-sm text-red-500">{documentValidation.error}</p>
              )}
              {formData.identityDocument && documentValidation.isValid && (
                <p className="text-sm text-green-600">✓ Documento válido</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Fotografía de perfil (opcional)</Label>
              <p className="text-sm text-gray-600">Resolución mínima recomendada 300x300 px</p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-2 border-green-200 h-20 flex flex-col items-center justify-center gap-1"
                onClick={() => document.getElementById('profilePhoto')?.click()}
              >
                <Upload className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-500">
                  {formData.profilePhoto ? formData.profilePhoto.name : "Subir foto"}
                </span>
              </Button>
              <input
                id="profilePhoto"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileChange('profilePhoto', e.target.files?.[0] || null)}
              />
              {formData.profilePhoto && !profilePhotoValidation.isValid && (
                <p className="text-sm text-red-500">{profilePhotoValidation.error}</p>
              )}
              {formData.profilePhoto && profilePhotoValidation.isValid && (
                <p className="text-sm text-green-600">✓ Foto válida</p>
              )}
            </div>

            <Link
              href="/register/personal"
              className="block"
              onClick={() => {
                // Explicitly save data before navigation
                console.log('Saving form data to context before navigation:', formData);
                updateStepData('step1', formData);
              }}
            >
              <Button
                className={`w-full rounded-full py-6 mt-8 ${
                  isFormValid()
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!isFormValid()}
              >
                Guardar y Continuar
              </Button>
            </Link>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <AuthRoute>
      <PersistentRegistrationProvider>
        <RegisterPageContent />
      </PersistentRegistrationProvider>
    </AuthRoute>
  )
}
