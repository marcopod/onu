"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X } from "lucide-react"
import { PersistentRegistrationProvider, usePersistentCurrentStepData, usePersistentUpdateStepData } from "@/components/auth/persistent-registration-context"
import { RegistrationStep3Data } from "@/lib/types"

function HealthPhysicalPageContent() {
  const stepData = usePersistentCurrentStepData<RegistrationStep3Data>('step3')
  const updateStepData = usePersistentUpdateStepData()

  const [formData, setFormData] = useState({
    weight: stepData?.weight || "",
    height: stepData?.height || "",
    bloodType: stepData?.bloodType || "",
    hasDisability: stepData?.hasDisability || false,
    disabilityDescription: stepData?.disabilityDescription || "",
    chronicConditions: stepData?.chronicConditions || "",
    allergies: stepData?.allergies || {
      medical: "",
      food: "",
      environmental: ""
    },
    currentMedications: stepData?.currentMedications || [
      { name: "", dose: "", frequency: "" }
    ]
  })

  // Update form data when step data changes
  useEffect(() => {
    if (stepData) {
      setFormData({
        weight: stepData.weight || "",
        height: stepData.height || "",
        bloodType: stepData.bloodType || "",
        hasDisability: stepData.hasDisability || false,
        disabilityDescription: stepData.disabilityDescription || "",
        chronicConditions: stepData.chronicConditions || "",
        allergies: stepData.allergies || {
          medical: "",
          food: "",
          environmental: ""
        },
        currentMedications: stepData.currentMedications || [
          { name: "", dose: "", frequency: "" }
        ]
      })
    }
  }, [stepData])

  const handleInputChange = (field: string, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    updateStepData('step3', newFormData)
    console.log('Updated step3 data:', newFormData)
  }

  const handleAllergyChange = (type: string, value: string) => {
    const newFormData = {
      ...formData,
      allergies: { ...formData.allergies, [type]: value }
    }
    setFormData(newFormData)
    updateStepData('step3', newFormData)
    console.log('Updated step3 allergies:', newFormData)
  }

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      currentMedications: [...prev.currentMedications, { name: "", dose: "", frequency: "" }]
    }))
  }

  const removeMedication = (index: number) => {
    if (formData.currentMedications.length > 1) {
      setFormData(prev => ({
        ...prev,
        currentMedications: prev.currentMedications.filter((_, i) => i !== index)
      }))
    }
  }

  const updateMedication = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const isValidWeight = (weight: string) => {
    const num = parseFloat(weight)
    return !weight || (num >= 30 && num <= 300)
  }

  const isValidHeight = (height: string) => {
    const num = parseFloat(height)
    return !height || (num >= 100 && num <= 250)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/register/personal" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Salud Física</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Paso 3 de 4</span>
              <span className="text-sm text-gray-500">Información médica general</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-green-800 font-medium">
                  Peso (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  className="border-green-200 rounded-xl"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  step="0.1"
                />
                {formData.weight && !isValidWeight(formData.weight) && (
                  <p className="text-sm text-red-500">Peso debe estar entre 30-300 kg</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="text-green-800 font-medium">
                  Estatura (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  className="border-green-200 rounded-xl"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  step="0.1"
                />
                {formData.height && !isValidHeight(formData.height) && (
                  <p className="text-sm text-red-500">Estatura debe estar entre 100-250 cm</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Tipo de sangre</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
                <SelectTrigger className="border-green-200 rounded-xl">
                  <SelectValue placeholder="Selecciona tu tipo de sangre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasDisability"
                  checked={formData.hasDisability}
                  onCheckedChange={(checked) => handleInputChange('hasDisability', checked as boolean)}
                />
                <Label htmlFor="hasDisability" className="text-green-800 font-medium">
                  Tengo alguna discapacidad
                </Label>
              </div>
              
              {formData.hasDisability && (
                <div className="space-y-2">
                  <Label htmlFor="disabilityDescription" className="text-green-800 font-medium">
                    Especifica el tipo de discapacidad
                  </Label>
                  <Textarea
                    id="disabilityDescription"
                    placeholder="Describe tu discapacidad"
                    className="border-green-200 rounded-xl"
                    value={formData.disabilityDescription}
                    onChange={(e) => handleInputChange('disabilityDescription', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chronicConditions" className="text-green-800 font-medium">
                Padecimientos crónicos
              </Label>
              <Textarea
                id="chronicConditions"
                placeholder="Diabetes, hipertensión, etc. (separar por comas)"
                className="border-green-200 rounded-xl"
                value={formData.chronicConditions}
                onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-green-800 font-medium">Alergias</Label>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="medicalAllergies" className="text-sm text-green-700">
                    Alergias médicas
                  </Label>
                  <Input
                    id="medicalAllergies"
                    placeholder="Penicilina, aspirina, etc."
                    className="border-green-200 rounded-xl"
                    value={formData.allergies.medical}
                    onChange={(e) => handleAllergyChange('medical', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foodAllergies" className="text-sm text-green-700">
                    Alergias alimentarias
                  </Label>
                  <Input
                    id="foodAllergies"
                    placeholder="Nueces, mariscos, etc."
                    className="border-green-200 rounded-xl"
                    value={formData.allergies.food}
                    onChange={(e) => handleAllergyChange('food', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environmentalAllergies" className="text-sm text-green-700">
                    Alergias ambientales
                  </Label>
                  <Input
                    id="environmentalAllergies"
                    placeholder="Polen, polvo, etc."
                    className="border-green-200 rounded-xl"
                    value={formData.allergies.environmental}
                    onChange={(e) => handleAllergyChange('environmental', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-green-800 font-medium">Medicación actual</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMedication}
                  className="border-green-200 text-green-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
              
              {formData.currentMedications.map((medication, index) => (
                <div key={index} className="border border-green-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Medicamento {index + 1}</span>
                    {formData.currentMedications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      placeholder="Nombre del medicamento"
                      className="border-green-200 rounded-xl"
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Dosis (ej: 500mg)"
                      className="border-green-200 rounded-xl"
                      value={medication.dose}
                      onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                    />
                    <Input
                      placeholder="Frecuencia (ej: cada 8 horas)"
                      className="border-green-200 rounded-xl"
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/register/health-mental"
              className="block"
              onClick={() => {
                console.log('Saving step3 data before navigation:', formData);
                updateStepData('step3', formData);
              }}
            >
              <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6 mt-8">
                Continuar
              </Button>
            </Link>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function HealthPhysicalPage() {
  return (
    <PersistentRegistrationProvider>
      <HealthPhysicalPageContent />
    </PersistentRegistrationProvider>
  )
}
