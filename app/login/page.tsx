"use client"

import Link from "next/link"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { toast } from "sonner"

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isFormValid = () => {
    return formData.email.trim() !== "" &&
           formData.password.trim() !== "" &&
           validateEmail(formData.email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      toast.error("Por favor, completa todos los campos correctamente")
      return
    }

    setIsLoading(true)

    try {
      await login({
        email: formData.email,
        password: formData.password
      })

      toast.success("¡Inicio de sesión exitoso!")
      router.push(redirectTo)
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
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
            <h1 className="text-2xl font-bold text-green-800 ml-4">Iniciar Sesión</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-800 font-medium">
                Correo Electrónico *
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  className="pl-10 border-green-200 rounded-xl"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              </div>
              {formData.email && !validateEmail(formData.email) && (
                <p className="text-sm text-red-500">Formato de correo inválido</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-800 font-medium">
                Contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  className="pl-10 pr-10 border-green-200 rounded-xl"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full rounded-full py-6 mt-8 ${
                isFormValid() && !isLoading
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-green-600 font-medium hover:text-green-700">
                Crear cuenta nueva
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
