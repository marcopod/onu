"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, X } from "lucide-react"

export default function PersonalInfoPage() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    sexualOrientation: "",
    address: "",
    educationLevel: "",
    occupation: "",
    hobbies: "",
    frequentPlaces: "",
    emergencyContacts: [
      { name: "", relationship: "", phone: "" }
    ]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: "", relationship: "", phone: "" }]
    }))
  }

  const removeEmergencyContact = (index: number) => {
    if (formData.emergencyContacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
      }))
    }
  }

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }))
  }

  const isFormValid = () => {
    const ageNum = parseInt(formData.age)
    const hasValidAge = ageNum >= 13 && ageNum <= 120
    const hasGender = formData.gender !== ""
    const hasValidEmergencyContact = formData.emergencyContacts.some(contact => 
      contact.name.trim() !== "" && contact.relationship.trim() !== "" && contact.phone.trim() !== ""
    )
    
    return hasValidAge && hasGender && hasValidEmergencyContact
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/register" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Información Personal</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Paso 2 de 5</span>
              <span className="text-sm text-gray-500">Datos sociodemográficos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-2/5"></div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-green-800 font-medium">
                Edad *
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Ingresa tu edad"
                className="border-green-200 rounded-xl"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                min="13"
                max="120"
                required
              />
              {formData.age && (parseInt(formData.age) < 13 || parseInt(formData.age) > 120) && (
                <p className="text-sm text-red-500">La edad debe estar entre 13 y 120 años</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Género *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="border-green-200 rounded-xl">
                  <SelectValue placeholder="Selecciona tu género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hombre">Hombre</SelectItem>
                  <SelectItem value="mujer">Mujer</SelectItem>
                  <SelectItem value="no-binario">No binario</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                  <SelectItem value="prefiero-no-decir">Prefiero no decirlo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Orientación sexual (opcional)</Label>
              <Select value={formData.sexualOrientation} onValueChange={(value) => handleInputChange('sexualOrientation', value)}>
                <SelectTrigger className="border-green-200 rounded-xl">
                  <SelectValue placeholder="Selecciona tu orientación sexual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heterosexual">Heterosexual</SelectItem>
                  <SelectItem value="homosexual">Homosexual</SelectItem>
                  <SelectItem value="bisexual">Bisexual</SelectItem>
                  <SelectItem value="asexual">Asexual</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-green-800 font-medium">
                Dirección (opcional)
              </Label>
              <Textarea
                id="address"
                placeholder="Ingresa tu dirección"
                className="border-green-200 rounded-xl"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Nivel de estudios (opcional)</Label>
              <Select value={formData.educationLevel} onValueChange={(value) => handleInputChange('educationLevel', value)}>
                <SelectTrigger className="border-green-200 rounded-xl">
                  <SelectValue placeholder="Selecciona tu nivel de estudios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primaria">Primaria</SelectItem>
                  <SelectItem value="secundaria">Secundaria</SelectItem>
                  <SelectItem value="preparatoria">Preparatoria</SelectItem>
                  <SelectItem value="universidad">Universidad</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-green-800 font-medium">
                Ocupación (opcional)
              </Label>
              <Input
                id="occupation"
                type="text"
                placeholder="Ingresa tu ocupación"
                className="border-green-200 rounded-xl"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobbies" className="text-green-800 font-medium">
                Hobbies (opcional)
              </Label>
              <Input
                id="hobbies"
                type="text"
                placeholder="Separar por comas"
                className="border-green-200 rounded-xl"
                value={formData.hobbies}
                onChange={(e) => handleInputChange('hobbies', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequentPlaces" className="text-green-800 font-medium">
                Lugares frecuentes (opcional)
              </Label>
              <Input
                id="frequentPlaces"
                type="text"
                placeholder="Separar por comas"
                className="border-green-200 rounded-xl"
                value={formData.frequentPlaces}
                onChange={(e) => handleInputChange('frequentPlaces', e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-green-800 font-medium">Contactos de emergencia *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEmergencyContact}
                  className="border-green-200 text-green-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
              
              {formData.emergencyContacts.map((contact, index) => (
                <div key={index} className="border border-green-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Contacto {index + 1}</span>
                    {formData.emergencyContacts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      placeholder="Nombre completo"
                      className="border-green-200 rounded-xl"
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Relación (ej: madre, hermano, amigo)"
                      className="border-green-200 rounded-xl"
                      value={contact.relationship}
                      onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                    />
                    <Input
                      placeholder="Teléfono"
                      type="tel"
                      className="border-green-200 rounded-xl"
                      value={contact.phone}
                      onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link href="/register/health-physical" className="block">
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
