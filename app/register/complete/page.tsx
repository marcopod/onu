"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, FileText, Shield, Phone } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { usePersistentRegistration, PersistentRegistrationProvider } from "@/components/auth/persistent-registration-context"
import { toast } from "sonner"

function RegistrationCompleteContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const { register } = useAuth()
  const { data, resetRegistration } = usePersistentRegistration()
  const router = useRouter()

  const handleRegistrationSubmit = async () => {
    if (isSubmitting || isCompleted) return

    setIsSubmitting(true)

    try {
      // Debug: Log the registration data
      console.log('=== REGISTRATION COMPLETE DEBUG ===');
      console.log('Full registration data:', JSON.stringify(data, null, 2));
      console.log('Step1 exists:', !!data.step1);
      console.log('Step1 fullName:', data.step1?.fullName);
      console.log('Step1 email:', data.step1?.email);
      console.log('Step1 password:', data.step1?.password ? '[PRESENT]' : '[MISSING]');
      console.log('Step1 confirmPassword:', data.step1?.confirmPassword ? '[PRESENT]' : '[MISSING]');
      console.log('================================');

      // Validate that we have the required data
      if (!data.step1?.fullName || !data.step1?.email || !data.step1?.password) {
        console.log('VALIDATION FAILED:');
        console.log('- fullName missing:', !data.step1?.fullName);
        console.log('- email missing:', !data.step1?.email);
        console.log('- password missing:', !data.step1?.password);
        toast.error("Datos de registro incompletos. Por favor, completa el registro nuevamente.")
        router.push('/register')
        return
      }

      await register(data as any) // Type assertion since we validated required fields
      setIsCompleted(true)
      toast.success("¡Registro completado exitosamente!")

      // Reset registration data
      resetRegistration()
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || "Error al completar el registro")
      router.push('/register')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // Auto-submit registration when component mounts
    handleRegistrationSubmit()
  }, []) // Empty dependency array to run only once

  if (isSubmitting) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
          <div className="w-full max-w-md p-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
              <h1 className="text-2xl font-bold text-green-800 mb-2">Completando Registro...</h1>
              <p className="text-gray-600">
                Estamos procesando tu información. Por favor espera un momento.
              </p>
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
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">¡Registro Completado!</h1>
            <p className="text-gray-600">
              Tu cuenta ha sido creada exitosamente. Ahora tienes acceso a todas las funciones de la aplicación.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-medium text-green-800 mb-2">¿Qué puedes hacer ahora?</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Reportar incidentes de acoso
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Acceder a recursos de seguridad
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contactar servicios de emergencia
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-medium text-blue-800 mb-2">Información importante</h3>
              <p className="text-sm text-blue-700">
                Toda la información que proporcionaste está protegida y será utilizada únicamente para brindarte mejor asistencia en caso de emergencia.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Recursos de ayuda inmediata</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Emergencias: 911</li>
                <li>• Línea de la Vida: 800 911 2000</li>
                <li>• SAPTEL: 55 5259 8121</li>
                <li>• Línea Mujeres: 800 108 4053</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/" className="block">
              <Button className="w-full bg-green-500 hover:bg-green-600 rounded-full py-6">
                <Home className="h-5 w-5 mr-2" />
                Ir al Inicio
              </Button>
            </Link>

            <Link href="/report" className="block">
              <Button variant="outline" className="w-full border-green-200 text-green-600 rounded-full py-6">
                <FileText className="h-5 w-5 mr-2" />
                Hacer un Reporte
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Si necesitas modificar tu información, puedes hacerlo desde tu perfil en cualquier momento.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function RegistrationCompletePage() {
  return (
    <PersistentRegistrationProvider>
      <RegistrationCompleteContent />
    </PersistentRegistrationProvider>
  )
}
