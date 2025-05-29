"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, MapPin, ChevronDown } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const harassmentCategories = {
  "acoso-escolar": {
    label: "Acoso escolar (bullying)",
    subcategories: {
      "fisico": "Golpes, empujones o cualquier forma de violencia física.",
      "verbal": "Insultos, burlas, amenazas o humillaciones.",
      "social": "Exclusión, difusión de rumores o daño a la reputación."
    }
  },
  "acoso-laboral": {
    label: "Acoso laboral (mobbing)",
    subcategories: {
      "psicologico": "Humillaciones, aislamiento u hostigamiento que afecta la salud mental.",
      "sexual": "Comentarios, insinuaciones o tocamientos no deseados en el entorno laboral."
    }
  },
  "acoso-sexual": {
    label: "Acoso sexual",
    subcategories: {
      "verbal": "Comentarios o propuestas sexuales no deseadas.",
      "fisico": "Contacto físico no consentido de naturaleza sexual.",
      "digital": "Envío de contenido sexual no solicitado por internet o mensajes."
    }
  },
  "acoso-cibernetico": {
    label: "Acoso cibernético (cyberbullying)",
    subcategories: {
      "redes-sociales": "Ataques, amenazas o difusión de rumores por redes sociales.",
      "medios-tecnologicos": "Acoso vía correo electrónico, mensajes o cualquier medio digital."
    }
  },
  "violencia-genero": {
    label: "Acoso en pareja / violencia de género",
    subcategories: {
      "emocional": "Manipulación, control o coacción dentro de la relación.",
      "fisico": "Agresiones físicas en contexto de pareja.",
      "economico": "Control de recursos financieros para limitar la autonomía de la pareja."
    }
  },
  "grupos-vulnerables": {
    label: "Acoso a grupos vulnerables",
    subcategories: {
      "menores": "Abuso físico, sexual, emocional o explotación de personas menores de 18 años.",
      "tercera-edad": "Maltrato o abuso a adultos mayores.",
      "discapacidad": "Aislamiento, discriminación o violencia hacia personas con discapacidad.",
      "racial": "Hostigamiento por motivos de raza o etnia.",
      "orientacion-sexual": "Hostigamiento por identidad de género u orientación sexual."
    }
  },
  "figura-autoridad": {
    label: "Acoso por figura de autoridad",
    subcategories: {
      "profesores": "Conductas inapropiadas de docentes hacia estudiantes.",
      "instituciones": "Abuso de poder en entornos institucionales (hospitales, escuelas, etc.)."
    }
  }
}

export default function ReportPage() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    evidence: [] as File[]
  })

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setFormData(prev => ({ ...prev, evidence: fileArray }))
    }
  }

  const getSubcategoryDescription = () => {
    if (selectedCategory && selectedSubcategory) {
      return harassmentCategories[selectedCategory as keyof typeof harassmentCategories]?.subcategories[selectedSubcategory as keyof typeof harassmentCategories[keyof typeof harassmentCategories]['subcategories']]
    }
    return ""
  }

  const isFormValid = () => {
    return selectedCategory !== "" &&
           selectedSubcategory !== "" &&
           formData.description.length >= 50
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Reportar Incidente</h1>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <Label className="text-green-800 font-medium">
                Clasificación del acoso *
              </Label>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm text-green-700">Categoría principal</Label>
                  <Select value={selectedCategory} onValueChange={(value) => {
                    setSelectedCategory(value)
                    setSelectedSubcategory("")
                  }}>
                    <SelectTrigger className="border-green-200 rounded-xl">
                      <SelectValue placeholder="Selecciona el tipo de acoso" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(harassmentCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <Label className="text-sm text-green-700">Subcategoría</Label>
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                      <SelectTrigger className="border-green-200 rounded-xl">
                        <SelectValue placeholder="Selecciona la subcategoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(harassmentCategories[selectedCategory as keyof typeof harassmentCategories].subcategories).map(([key, description]) => (
                          <SelectItem key={key} value={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {getSubcategoryDescription() && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Descripción:</strong> {getSubcategoryDescription()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-green-800 font-medium">
                Descripción del incidente *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe detalladamente lo que ocurrió (mínimo 50 caracteres)..."
                className="min-h-[120px] border-green-200 rounded-xl"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                {formData.description.length}/50 caracteres mínimos
              </p>
              {formData.description.length > 0 && formData.description.length < 50 && (
                <p className="text-sm text-red-500">
                  La descripción debe tener al menos 50 caracteres
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-green-800 font-medium">
                Ubicación del incidente
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  placeholder="Ingresa la ubicación o usa el mapa"
                  className="pl-10 border-green-200 rounded-xl"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
              <div className="h-[120px] bg-gray-100 rounded-xl flex items-center justify-center border border-green-200">
                <span className="text-gray-500">Vista previa del mapa</span>
              </div>
              <p className="text-xs text-gray-500">
                La ubicación ayuda a las autoridades y otros usuarios a identificar zonas de riesgo
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Evidencia (Opcional)</Label>
              <p className="text-sm text-gray-600">
                Fotos, audio, documentos (JPG, PNG, PDF, MP3 - máximo 20MB total)
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-2 border-green-200 h-20 flex flex-col items-center justify-center gap-1 rounded-xl"
                onClick={() => document.getElementById('evidence')?.click()}
              >
                <Upload className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-500">
                  {formData.evidence.length > 0
                    ? `${formData.evidence.length} archivo(s) seleccionado(s)`
                    : "Subir foto, audio o documento"
                  }
                </span>
              </Button>
              <input
                id="evidence"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf,.mp3,.wav"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              {formData.evidence.length > 0 && (
                <div className="space-y-1">
                  {formData.evidence.map((file, index) => (
                    <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-medium text-red-800 mb-2">¿Necesitas ayuda inmediata?</h3>
              <p className="text-sm text-red-700 mb-3">
                Si estás en peligro inmediato, usa el botón de emergencia o contacta:
              </p>
              <div className="flex gap-2">
                <Link href="/emergency">
                  <Button size="sm" className="bg-red-500 hover:bg-red-600">
                    Emergencia
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="border-red-200 text-red-700">
                  911
                </Button>
              </div>
            </div>

            <Button
              className={`w-full rounded-full py-6 ${
                isFormValid()
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!isFormValid()}
            >
              Enviar Reporte
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
