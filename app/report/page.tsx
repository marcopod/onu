"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, MapPin, Search, User, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useMultiFileUpload } from "@/hooks/use-file-upload"
import { UserSearchResult, CreateReportData } from "@/lib/types"
import { toast } from "sonner"

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
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    incidentDate: "",
    isPublic: false
  })

  const { uploadedFiles, uploadFiles, removeFile, clearFiles, isUploading, error: uploadError } = useMultiFileUpload()

  // Search for users
  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setUserSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include'
      })
      const data = await response.json()

      if (data.success) {
        setUserSearchResults(data.data.users)
      } else {
        console.error('User search failed:', data.error)
        setUserSearchResults([])
      }
    } catch (error) {
      console.error('User search error:', error)
      setUserSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle user search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userSearchQuery) {
        searchUsers(userSearchQuery)
      } else {
        setUserSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [userSearchQuery])

  const handleFileUpload = async (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      await uploadFiles(fileArray, 'evidence')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const reportData: CreateReportData = {
        reportedUserId: selectedUser?.id,
        reportedUserName: selectedUser?.fullName,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        description: formData.description,
        location: formData.location,
        incidentDate: formData.incidentDate,
        isPublic: formData.isPublic,
        evidenceFiles: uploadedFiles.map(file => ({
          fileUrl: file.url,
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.fileSize
        }))
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reportData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Report submitted successfully')
        router.push('/reports')
      } else {
        toast.error(data.error || 'Failed to submit report')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to submit report')
    } finally {
      setIsSubmitting(false)
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Selection */}
            

            <div className="space-y-4">

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
              <Label htmlFor="incidentDate" className="text-green-800 font-medium">
                Fecha del incidente
              </Label>
              <Input
                id="incidentDate"
                type="date"
                className="border-green-200 rounded-xl"
                value={formData.incidentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, incidentDate: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                Opcional: Ayuda a establecer un contexto temporal del incidente
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">
                Visibilidad del reporte
              </Label>
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.isPublic}
                    onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                    className="text-green-600"
                  />
                  <span className="text-sm">Privado (solo yo y administradores pueden verlo)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.isPublic}
                    onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                    className="text-green-600"
                  />
                  <span className="text-sm">Público (otros usuarios pueden ver este reporte)</span>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Los reportes públicos ayudan a la comunidad a identificar patrones de acoso
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Evidencia (Opcional)</Label>
              <p className="text-sm text-gray-600">
                Fotos, audio, documentos (JPG, PNG, PDF, MP3 - máximo 20MB por archivo)
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-2 border-green-200 h-20 flex flex-col items-center justify-center gap-1 rounded-xl"
                onClick={() => document.getElementById('evidence')?.click()}
                disabled={isUploading}
              >
                <Upload className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-500">
                  {isUploading
                    ? "Subiendo archivos..."
                    : uploadedFiles.length > 0
                    ? `${uploadedFiles.length} archivo(s) subido(s)`
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

              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}

              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                      <span>{file.fileName} ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.tempId)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
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
              type="submit"
              className={`w-full rounded-full py-6 ${
                isFormValid() && !isSubmitting
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!isFormValid() || isSubmitting || isUploading}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
