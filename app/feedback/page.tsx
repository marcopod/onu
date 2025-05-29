"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Star, Heart, Lightbulb, CheckCircle } from "lucide-react"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    category: "",
    subject: "",
    message: "",
    wouldRecommend: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Enviando feedback:", formData)
    setIsSubmitted(true)
    // Aquí iría la lógica real de envío
  }

  const isFormValid = () => {
    return formData.rating !== "" &&
           formData.category !== "" &&
           formData.message.trim().length >= 10
  }

  const StarRating = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star.toString())}
            className={`p-1 ${
              parseInt(value) >= star ? 'text-yellow-500' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-800">¡Gracias por tu feedback!</h1>
              <p className="text-gray-600">
                Tus comentarios son muy valiosos para nosotros y nos ayudan a mejorar Help me!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700">
                Tu feedback ha sido registrado y será revisado por nuestro equipo de desarrollo.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/settings">
                <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full">
                  Volver a configuración
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
                className="w-full border-green-200 text-green-600 rounded-full"
              >
                Enviar más comentarios
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/settings" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Comentarios</h1>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <h2 className="font-medium text-green-800">Tu opinión importa</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Ayúdanos a mejorar Help me! compartiendo tu experiencia, sugerencias o reportando problemas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal (opcional) */}
            <div className="space-y-4">
              <h3 className="font-medium text-green-800">Información de contacto (opcional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-800">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  className="border-green-200 rounded-xl"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com (opcional)"
                  className="border-green-200 rounded-xl"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Solo si quieres que te contactemos sobre tu feedback
                </p>
              </div>
            </div>

            {/* Calificación */}
            <div className="space-y-4">
              <h3 className="font-medium text-green-800">Calificación general *</h3>
              <div className="space-y-2">
                <Label className="text-green-800">¿Cómo calificarías Help me!?</Label>
                <StarRating 
                  value={formData.rating} 
                  onChange={(value) => handleInputChange('rating', value)} 
                />
                {formData.rating && (
                  <p className="text-sm text-gray-600">
                    {formData.rating === "1" && "Muy malo"}
                    {formData.rating === "2" && "Malo"}
                    {formData.rating === "3" && "Regular"}
                    {formData.rating === "4" && "Bueno"}
                    {formData.rating === "5" && "Excelente"}
                  </p>
                )}
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label className="text-green-800 font-medium">Tipo de comentario *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="border-green-200 rounded-xl">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Sugerencia de mejora</SelectItem>
                  <SelectItem value="feature">Nueva funcionalidad</SelectItem>
                  <SelectItem value="bug">Reporte de error</SelectItem>
                  <SelectItem value="usability">Facilidad de uso</SelectItem>
                  <SelectItem value="design">Diseño y apariencia</SelectItem>
                  <SelectItem value="performance">Rendimiento</SelectItem>
                  <SelectItem value="general">Comentario general</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recomendación */}
            <div className="space-y-3">
              <Label className="text-green-800 font-medium">¿Recomendarías Help me! a otros?</Label>
              <RadioGroup 
                value={formData.wouldRecommend} 
                onValueChange={(value) => handleInputChange('wouldRecommend', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Sí</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="maybe" />
                  <Label htmlFor="maybe">Tal vez</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Asunto */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-green-800 font-medium">
                Asunto
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Resumen de tu comentario"
                className="border-green-200 rounded-xl"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
              />
            </div>

            {/* Mensaje */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-green-800 font-medium">
                Tu comentario *
              </Label>
              <Textarea
                id="message"
                placeholder="Comparte tu experiencia, sugerencias o reporta problemas (mínimo 10 caracteres)"
                className="border-green-200 rounded-xl min-h-[120px]"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                {formData.message.length}/10 caracteres mínimos
              </p>
            </div>

            <Button 
              type="submit"
              className={`w-full rounded-full py-6 ${
                isFormValid() 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!isFormValid()}
            >
              Enviar comentarios
            </Button>
          </form>

          {/* Ideas de feedback */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">Ideas para tu feedback</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ¿Qué funciones te gustaría que agregáramos?</li>
              <li>• ¿Hay algo que te resulta confuso o difícil de usar?</li>
              <li>• ¿Cómo podríamos mejorar la experiencia de emergencia?</li>
              <li>• ¿Qué opinas del diseño y los colores?</li>
              <li>• ¿La app funciona bien en tu dispositivo?</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
