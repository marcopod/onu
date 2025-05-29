"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, MessageCircle, Clock, CheckCircle } from "lucide-react"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    priority: "medium"
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Enviando solicitud de soporte:", formData)
    setIsSubmitted(true)
    // Aquí iría la lógica real de envío
  }

  const isFormValid = () => {
    return formData.name.trim() !== "" &&
           formData.email.includes('@') &&
           formData.category !== "" &&
           formData.subject.trim() !== "" &&
           formData.message.trim().length >= 20
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-800">¡Solicitud enviada!</h1>
              <p className="text-gray-600">
                Hemos recibido tu solicitud de soporte. Te responderemos en un plazo de 24-48 horas.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700">
                <strong>Número de ticket:</strong> #HM-{Date.now().toString().slice(-6)}
              </p>
              <p className="text-sm text-green-700 mt-1">
                Guarda este número para hacer seguimiento de tu solicitud.
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
                Enviar otra solicitud
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
            <h1 className="text-2xl font-bold text-green-800 ml-4">Soporte Técnico</h1>
          </div>

          {/* Información de contacto rápido */}
          <div className="mb-6 space-y-3">
            <h2 className="font-medium text-green-800">Contacto directo</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-xl">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Email</p>
                  <p className="text-sm text-gray-600">soporte@helpme.app</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-xl">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Teléfono</p>
                  <p className="text-sm text-gray-600">+52 55 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border border-green-200 rounded-xl">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Horario</p>
                  <p className="text-sm text-gray-600">Lun-Vie 9:00-18:00 (GMT-6)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de soporte */}
          <div className="space-y-6">
            <h2 className="font-medium text-green-800">Enviar solicitud de soporte</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-800 font-medium">
                  Nombre completo *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  className="border-green-200 rounded-xl"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-800 font-medium">
                  Correo electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="border-green-200 rounded-xl"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-800 font-medium">Categoría del problema *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="border-green-200 rounded-xl">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Problema técnico</SelectItem>
                    <SelectItem value="account">Problemas de cuenta</SelectItem>
                    <SelectItem value="emergency">Funciones de emergencia</SelectItem>
                    <SelectItem value="privacy">Privacidad y seguridad</SelectItem>
                    <SelectItem value="feature">Solicitud de función</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-green-800 font-medium">Prioridad</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger className="border-green-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja - No urgente</SelectItem>
                    <SelectItem value="medium">Media - Normal</SelectItem>
                    <SelectItem value="high">Alta - Urgente</SelectItem>
                    <SelectItem value="critical">Crítica - Emergencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-green-800 font-medium">
                  Asunto *
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Resumen breve del problema"
                  className="border-green-200 rounded-xl"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-green-800 font-medium">
                  Descripción detallada *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Describe tu problema o pregunta con el mayor detalle posible (mínimo 20 caracteres)"
                  className="border-green-200 rounded-xl min-h-[120px]"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  {formData.message.length}/20 caracteres mínimos
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
                Enviar solicitud
              </Button>
            </form>
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Antes de contactarnos</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Revisa las <Link href="/faq" className="underline">preguntas frecuentes</Link></li>
              <li>• Asegúrate de tener la última versión de la app</li>
              <li>• Para emergencias reales, usa el botón de emergencia o llama al 911</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
