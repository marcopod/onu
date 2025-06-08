"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, X, Upload, Calendar, MapPin } from "lucide-react"

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([
    {
      category: "",
      location: "",
      date: "",
      description: "",
      reportedToAuthorities: false,
      evidence: [] as File[],
      evidenceErrors: [] as string[]
    }
  ])

  const addExperience = () => {
    setExperiences(prev => [...prev, {
      category: "",
      location: "",
      date: "",
      description: "",
      reportedToAuthorities: false,
      evidence: [],
      evidenceErrors: []
    }])
  }

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateExperience = (index: number, field: string, value: any) => {
    setExperiences(prev => prev.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    ))
  }

  const validateEvidenceFiles = (files: File[]) => {
    const maxTotalSize = 20 * 1024 * 1024 // 20MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

    let totalSize = 0
    const errors: string[] = []

    for (const file of files) {
      totalSize += file.size

      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Formato no válido. Solo se permiten JPG, PNG, PDF y DOCX`)
      }
    }

    if (totalSize > maxTotalSize) {
      errors.push(`El tamaño total de archivos excede los 20MB (actual: ${(totalSize / 1024 / 1024).toFixed(2)}MB)`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      totalSize
    }
  }

  const handleFileUpload = (index: number, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      const validation = validateEvidenceFiles(fileArray)

      if (validation.isValid) {
        updateExperience(index, 'evidence', fileArray)
        updateExperience(index, 'evidenceErrors', [])
      } else {
        updateExperience(index, 'evidenceErrors', validation.errors)
      }
    }
  }

  const hasValidExperience = () => {
    return experiences.some(exp =>
      exp.category !== "" &&
      exp.date !== "" &&
      exp.description.length >= 100
    )
  }

  const harassmentCategories = [
    { value: "fisico", label: "Físico" },
    { value: "verbal", label: "Verbal" },
    { value: "digital", label: "Digital" },
    { value: "sexual", label: "Sexual" },
    { value: "otro", label: "Otro" }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/register/health-mental" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Experiencias Previas</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-600 font-medium">Paso 5 de 5</span>
              <span className="text-sm text-gray-500">Registro de incidentes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-800">
              <strong>Información sensible:</strong> Esta sección es completamente opcional. Solo comparte lo que te sientas cómodo/a compartiendo. Esta información nos ayudará a brindarte mejor apoyo.
            </p>
          </div>

          <form className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-green-800 font-medium">Incidentes de acoso</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExperience}
                className="border-green-200 text-green-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>

            {experiences.map((experience, index) => (
              <div key={index} className="border border-green-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Incidente {index + 1}</span>
                  {experiences.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-green-800 font-medium">
                      Categoría / Tipo de acoso *
                    </Label>
                    <Select
                      value={experience.category}
                      onValueChange={(value) => updateExperience(index, 'category', value)}
                    >
                      <SelectTrigger className="border-green-200 rounded-xl">
                        <SelectValue placeholder="Selecciona el tipo de acoso" />
                      </SelectTrigger>
                      <SelectContent>
                        {harassmentCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-800 font-medium">
                      Ubicación del incidente
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Lugar donde ocurrió el incidente"
                        className="pl-10 border-green-200 rounded-xl"
                        value={experience.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-800 font-medium">
                      Fecha del incidente *
                    </Label>
                    <div className="relative">
                      <Input
                        type="date"
                        className="pl-10 border-green-200 rounded-xl"
                        value={experience.date}
                        onChange={(e) => updateExperience(index, 'date', e.target.value)}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-800 font-medium">
                      Descripción del incidente *
                    </Label>
                    <Textarea
                      placeholder="Describe lo que ocurrió (mínimo 100 caracteres)"
                      className="border-green-200 rounded-xl min-h-[120px]"
                      value={experience.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      {experience.description.length}/100 caracteres mínimos
                    </p>
                    {experience.description.length > 0 && experience.description.length < 100 && (
                      <p className="text-sm text-red-500">
                        La descripción debe tener al menos 100 caracteres
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`reported-${index}`}
                      checked={experience.reportedToAuthorities}
                      onCheckedChange={(checked) => updateExperience(index, 'reportedToAuthorities', checked)}
                    />
                    <Label htmlFor={`reported-${index}`} className="text-green-800 font-medium">
                      Reporté este incidente a las autoridades
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-green-800 font-medium">Evidencia adjunta (opcional)</Label>
                    <p className="text-sm text-gray-600">
                      Imágenes, documentos (JPG, PNG, PDF, DOCX - máximo 20MB total)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-2 border-green-200 h-20 flex flex-col items-center justify-center gap-1"
                      onClick={() => document.getElementById(`evidence-${index}`)?.click()}
                    >
                      <Upload className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">
                        {experience.evidence.length > 0
                          ? `${experience.evidence.length} archivo(s) seleccionado(s)`
                          : "Subir evidencia"
                        }
                      </span>
                    </Button>
                    <input
                      id={`evidence-${index}`}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.docx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(index, e.target.files)}
                    />

                    {experience.evidence.length > 0 && (
                      <div className="space-y-1">
                        {experience.evidence.map((file, fileIndex) => (
                          <div key={fileIndex} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                        ))}
                      </div>
                    )}

                    {experience.evidenceErrors && experience.evidenceErrors.length > 0 && (
                      <div className="space-y-1">
                        {experience.evidenceErrors.map((error, errorIndex) => (
                          <p key={errorIndex} className="text-sm text-red-500">
                            {error}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {experiences.every(exp => exp.category === "" && exp.description === "") && (
              <div className="text-center p-6 border border-dashed border-green-200 rounded-xl">
                <p className="text-sm text-gray-500 mb-2">
                  Si no has experimentado acoso previamente, puedes omitir esta sección
                </p>
                <p className="text-xs text-gray-400">
                  O agrega un incidente si deseas reportar experiencias pasadas
                </p>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-medium text-green-800 mb-2">¡Casi terminamos!</h3>
              <p className="text-sm text-green-700">
                Una vez que completes el registro, tendrás acceso a todas las funciones de la aplicación para reportar incidentes y solicitar ayuda.
              </p>
            </div>

            <Link href="/register/complete" className="block">
              <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6 mt-8">
                Completar Registro
              </Button>
            </Link>
          </form>
        </div>
      </main>
    </div>
  )
}
