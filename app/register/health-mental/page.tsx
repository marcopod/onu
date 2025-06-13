"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X } from "lucide-react"
import { PersistentRegistrationProvider, usePersistentCurrentStepData, usePersistentUpdateStepData } from "@/components/auth/persistent-registration-context"
import { RegistrationStep4Data } from "@/lib/types"

function HealthMentalPageContent() {
  const stepData = usePersistentCurrentStepData<RegistrationStep4Data>('step4')
  const updateStepData = usePersistentUpdateStepData()
  const router = useRouter()

  const [formData, setFormData] = useState({
    psychiatricConditions: stepData?.psychiatricConditions || "",
    hasAnxietyAttacks: stepData?.hasAnxietyAttacks || false,
    anxietyFrequency: stepData?.anxietyFrequency || "",
    psychiatricMedications: stepData?.psychiatricMedications || [
      { name: "", dose: "", frequency: "" }
    ],
    familyHistory: stepData?.familyHistory || ""
  })

  // Update form data when step data changes
  useEffect(() => {
    if (stepData) {
      setFormData({
        psychiatricConditions: stepData.psychiatricConditions || "",
        hasAnxietyAttacks: stepData.hasAnxietyAttacks || false,
        anxietyFrequency: stepData.anxietyFrequency || "",
        psychiatricMedications: stepData.psychiatricMedications || [
          { name: "", dose: "", frequency: "" }
        ],
        familyHistory: stepData.familyHistory || ""
      })
    }
  }, [stepData])

  const handleInputChange = (field: string, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    updateStepData('step4', newFormData)
    console.log('Updated step4 data:', newFormData)
  }

  const addMedication = () => {
    const newFormData = {
      ...formData,
      psychiatricMedications: [...formData.psychiatricMedications, { name: "", dose: "", frequency: "" }]
    }
    setFormData(newFormData)
    updateStepData('step4', newFormData)
    console.log('Added psychiatric medication, updated step4 data:', newFormData)
  }

  const removeMedication = (index: number) => {
    if (formData.psychiatricMedications.length > 1) {
      const newFormData = {
        ...formData,
        psychiatricMedications: formData.psychiatricMedications.filter((_, i) => i !== index)
      }
      setFormData(newFormData)
      updateStepData('step4', newFormData)
      console.log('Removed psychiatric medication, updated step4 data:', newFormData)
    }
  }

  const updateMedication = (index: number, field: string, value: string) => {
    const newFormData = {
      ...formData,
      psychiatricMedications: formData.psychiatricMedications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    }
    setFormData(newFormData)
    updateStepData('step4', newFormData)
    console.log('Updated psychiatric medication, updated step4 data:', newFormData)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/register/health-physical" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Salud Mental</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Paso 4 de 4</span>
              <span className="text-sm text-gray-500">Información psicológica</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Esta información es confidencial y será utilizada únicamente para brindar mejor asistencia en caso de emergencia. Puedes omitir cualquier campo que no desees completar.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="psychiatricConditions" className="text-green-800 font-medium">
                Padecimientos psiquiátricos
              </Label>
              <Textarea
                id="psychiatricConditions"
                placeholder="Depresión, ansiedad, trastorno bipolar, etc. (opcional)"
                className="border-green-200 rounded-xl"
                value={formData.psychiatricConditions}
                onChange={(e) => handleInputChange('psychiatricConditions', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Incluye la opción "ninguno" si no tienes padecimientos psiquiátricos
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasAnxietyAttacks"
                  checked={formData.hasAnxietyAttacks}
                  onCheckedChange={(checked) => handleInputChange('hasAnxietyAttacks', checked as boolean)}
                />
                <Label htmlFor="hasAnxietyAttacks" className="text-green-800 font-medium">
                  Experimento ataques de ansiedad
                </Label>
              </div>
              
              {formData.hasAnxietyAttacks && (
                <div className="space-y-2">
                  <Label className="text-green-800 font-medium">
                    Frecuencia aproximada
                  </Label>
                  <Select value={formData.anxietyFrequency} onValueChange={(value) => handleInputChange('anxietyFrequency', value)}>
                    <SelectTrigger className="border-green-200 rounded-xl">
                      <SelectValue placeholder="Selecciona la frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diario</SelectItem>
                      <SelectItem value="semanal">Varias veces por semana</SelectItem>
                      <SelectItem value="mensual">Varias veces por mes</SelectItem>
                      <SelectItem value="ocasional">Ocasionalmente</SelectItem>
                      <SelectItem value="raro">Muy rara vez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-green-800 font-medium">Medicación psiquiátrica</Label>
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
              
              <p className="text-sm text-gray-600">
                Incluye antidepresivos, ansiolíticos, estabilizadores del ánimo, etc.
              </p>
              
              {formData.psychiatricMedications.map((medication, index) => (
                <div key={index} className="border border-green-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Medicamento {index + 1}</span>
                    {formData.psychiatricMedications.length > 1 && (
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
                      placeholder="Nombre del medicamento (ej: Sertralina)"
                      className="border-green-200 rounded-xl"
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Dosis (ej: 50mg)"
                      className="border-green-200 rounded-xl"
                      value={medication.dose}
                      onChange={(e) => updateMedication(index, 'dose', e.target.value)}
                    />
                    <Input
                      placeholder="Frecuencia (ej: una vez al día)"
                      className="border-green-200 rounded-xl"
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              
              {formData.psychiatricMedications.every(med => !med.name.trim()) && (
                <div className="text-center p-4 border border-dashed border-green-200 rounded-xl">
                  <p className="text-sm text-gray-500">
                    Si no tomas medicación psiquiátrica, puedes dejar estos campos vacíos
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyHistory" className="text-green-800 font-medium">
                Historial familiar de salud mental
              </Label>
              <Textarea
                id="familyHistory"
                placeholder="Antecedentes de salud mental en la familia (opcional)"
                className="border-green-200 rounded-xl"
                value={formData.familyHistory}
                onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Incluye información sobre padecimientos hereditarios de salud mental en familiares directos
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Recursos de ayuda</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Si necesitas ayuda inmediata para salud mental:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Línea de la Vida: 800 911 2000</li>
                <li>• SAPTEL: 55 5259 8121</li>
                <li>• Emergencias: 911</li>
              </ul>
            </div>

            <Button
              className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6 mt-8"
              onClick={() => {
                // Save final step data and redirect to complete registration
                console.log('Saving final step4 data and completing registration:', formData);
                updateStepData('step4', formData);

                // Add empty step5 data for compatibility with registration API
                updateStepData('step5', { experiences: [] });

                // Redirect to registration complete page
                router.push('/register/complete');
              }}
            >
              Completar Registro
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function HealthMentalPage() {
  return (
    <PersistentRegistrationProvider>
      <HealthMentalPageContent />
    </PersistentRegistrationProvider>
  )
}
