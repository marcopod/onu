"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, AlertTriangle, Shield, Users, MapPin, Clock } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/route-guard"

function EmergencyPageContent() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)

  const emergencyContacts = [
    { name: "María González", relationship: "Madre", phone: "+52 55 1234 5678" },
    { name: "Carlos Pérez", relationship: "Hermano", phone: "+52 55 8765 4321" },
    { name: "Ana López", relationship: "Amiga", phone: "+52 55 9876 5432" }
  ]

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
        { enableHighAccuracy: true }
      )
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isEmergencyActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    } else if (countdown === 0 && isEmergencyActive) {
      // Aquí se ejecutaría el envío de la alerta
      handleSendEmergencyAlert()
    }
    return () => clearInterval(interval)
  }, [isEmergencyActive, countdown])

  const handleEmergencyPress = () => {
    setIsEmergencyActive(true)
    setCountdown(5) // 5 segundos de cuenta regresiva
  }

  const handleCancelEmergency = () => {
    setIsEmergencyActive(false)
    setCountdown(0)
  }

  const handleSendEmergencyAlert = () => {
    // Simular envío de alerta
    console.log("Enviando alerta de emergencia...")
    console.log("Ubicación:", currentLocation)
    console.log("Contactos notificados:", emergencyContacts)

    // Aquí iría la lógica real de envío
    setIsEmergencyActive(false)
    alert("¡Alerta de emergencia enviada! Tus contactos han sido notificados.")
  }

  const handleCallAuthorities = () => {
    // Simular llamada a autoridades
    if (currentLocation) {
      console.log("Llamando a autoridades con ubicación:", currentLocation)
      alert("Conectando con servicios de emergencia... Tu ubicación será compartida automáticamente.")
    }
  }

  const handleContactEmergencyContact = (contact: typeof emergencyContacts[0]) => {
    // Simular contacto con persona de emergencia
    console.log("Contactando a:", contact)
    alert(`Enviando ubicación y alerta a ${contact.name} (${contact.relationship})`)
  }

  if (isEmergencyActive) {
    return (
      <div className="flex flex-col min-h-screen bg-red-50">
        <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-16 w-16 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">{countdown}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-red-600">¡ALERTA DE EMERGENCIA!</h1>
              <p className="text-red-700">
                Se enviará tu ubicación a contactos de emergencia en {countdown} segundos
              </p>
            </div>

            <Button
              onClick={handleCancelEmergency}
              className="w-full bg-gray-600 hover:bg-gray-700 rounded-full py-6 text-xl font-medium"
            >
              CANCELAR
            </Button>
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
            <Link href="/" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Emergencia</h1>
          </div>

          {/* Botón de emergencia principal */}
          <div className="flex flex-col items-center mb-8 space-y-6">
            <div className="relative">
              <Button
                onClick={handleEmergencyPress}
                className="w-48 h-48 bg-red-500 hover:bg-red-600 rounded-full flex flex-col items-center justify-center gap-3 text-white shadow-lg transform transition-transform hover:scale-105"
              >
                <Shield className="h-20 w-20" />
                <span className="text-xl font-bold">PEDIR AYUDA</span>
                <span className="text-sm">AHORA</span>
              </Button>
              <div className="absolute -inset-4 bg-red-200 rounded-full animate-ping opacity-20"></div>
            </div>

            <p className="text-center text-gray-600 text-sm max-w-xs">
              Mantén presionado para activar la alerta de emergencia. Se enviará tu ubicación a tus contactos de confianza.
            </p>
          </div>

          {/* Ubicación actual */}
          {currentLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Ubicación actual</span>
              </div>
              <p className="text-sm text-blue-700">
                Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Esta ubicación se compartirá automáticamente en caso de emergencia
              </p>
            </div>
          )}

          {/* Opciones de contacto */}
          <div className="space-y-4">
            <h3 className="font-medium text-green-800 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contactar autoridades
            </h3>

            <Button
              onClick={handleCallAuthorities}
              className="w-full bg-red-500 hover:bg-red-600 rounded-full py-4 flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">Llamar al 911</span>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-red-200 text-red-700 rounded-xl py-3"
                onClick={() => alert("Conectando con Línea de la Vida: 800 911 2000")}
              >
                Línea de la Vida
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-700 rounded-xl py-3"
                onClick={() => alert("Conectando con SAPTEL: 55 5259 8121")}
              >
                SAPTEL
              </Button>
            </div>
          </div>

          {/* Contactos de emergencia */}
          <div className="mt-8 space-y-4">
            <h3 className="font-medium text-green-800 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contactos de emergencia
            </h3>

            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleContactEmergencyContact(contact)}
                  className="w-full border-green-200 rounded-xl py-4 justify-start text-left"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-green-800">{contact.name}</span>
                    <span className="text-sm text-gray-600">{contact.relationship} • {contact.phone}</span>
                  </div>
                </Button>
              ))}
            </div>

            <Link href="/chat">
              <Button variant="outline" className="w-full border-green-200 rounded-xl py-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span>Ir al chat de emergencia</span>
                </div>
              </Button>
            </Link>
          </div>

          {/* Información adicional */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Información importante</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• La alerta se envía automáticamente después de 5 segundos</li>
              <li>• Tu ubicación se comparte con contactos de confianza</li>
              <li>• Puedes cancelar la alerta antes de que se envíe</li>
              <li>• En emergencias reales, llama directamente al 911</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function EmergencyPage() {
  return (
    <ProtectedRoute>
      <EmergencyPageContent />
    </ProtectedRoute>
  )
}
