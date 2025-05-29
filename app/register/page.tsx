"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Lock, Upload, User } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    identityDocument: null as File | null,
    profilePhoto: null as File | null
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const isFormValid = () => {
    return formData.fullName.length >= 2 &&
           formData.email.includes('@') &&
           formData.password.length >= 8 &&
           formData.password === formData.confirmPassword &&
           formData.identityDocument !== null
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
              <span className="text-sm text-green-600 font-medium">Paso 1 de 5</span>
              <span className="text-sm text-gray-500">Información del perfil</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-1/5"></div>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-800 font-medium">
                Contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className="pl-10 border-green-200 rounded-xl"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
              {formData.password.length > 0 && formData.password.length < 8 && (
                <p className="text-sm text-red-500">La contraseña debe tener al menos 8 caracteres</p>
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
            </div>

            <Link href="/register/personal" className="block">
              <Button 
                className={`w-full rounded-full py-6 mt-8 ${
                  isFormValid() 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!isFormValid()}
              >
                Continuar
              </Button>
            </Link>
          </form>
        </div>
      </main>
    </div>
  )
}
