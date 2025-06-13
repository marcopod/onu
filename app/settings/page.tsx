"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Share2, Key, Bell, MapPin, Globe, HelpCircle, MessageSquare, Shield, Copy, Check, LogOut } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/route-guard"
import { useAuth } from "@/components/auth/auth-context"
import { toast } from "sonner"

function SettingsPageContent() {
  const { logout } = useAuth()
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    movementAlerts: false,
    language: "es-MX",
    shareCode: "HM-2024-ABC123",
    connectCode: ""
  })
  
  const [copiedCode, setCopiedCode] = useState(false)

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const generateNewCode = () => {
    const newCode = `HM-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    setSettings(prev => ({ ...prev, shareCode: newCode }))
  }

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(settings.shareCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleConnectWithCode = () => {
    if (settings.connectCode.trim()) {
      console.log("Conectando con código:", settings.connectCode)
      alert(`Intentando conectar con el código: ${settings.connectCode}`)
      setSettings(prev => ({ ...prev, connectCode: "" }))
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Sesión cerrada exitosamente")
    } catch (error) {
      toast.error("Error al cerrar sesión")
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
            <h1 className="text-2xl font-bold text-green-800 ml-4">Configuración</h1>
          </div>

          <div className="space-y-8">
            {/* Compartir Help me! */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium text-green-800">Compartir "Help me!"</h2>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                <p className="text-sm text-green-700">
                  Comparte tu código único con personas de confianza para que puedan conectarse contigo de forma segura.
                </p>
                
                <div className="space-y-2">
                  <Label className="text-green-800 font-medium">Tu código de acceso</Label>
                  <div className="flex gap-2">
                    <Input
                      value={settings.shareCode}
                      readOnly
                      className="border-green-200 rounded-xl bg-white"
                    />
                    <Button
                      variant="outline"
                      onClick={copyCodeToClipboard}
                      className="border-green-200 text-green-600 px-3"
                    >
                      {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={generateNewCode}
                  className="w-full border-green-200 text-green-600"
                >
                  Generar nuevo código
                </Button>
              </div>
            </div>

            {/* Conectar con código */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium text-green-800">Conectar con contacto seguro</h2>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-green-800 font-medium">Código enviado por contacto</Label>
                  <Input
                    placeholder="Ingresa el código (ej: HM-2024-ABC123)"
                    value={settings.connectCode}
                    onChange={(e) => handleSettingChange('connectCode', e.target.value)}
                    className="border-green-200 rounded-xl"
                  />
                </div>
                
                <Button
                  onClick={handleConnectWithCode}
                  disabled={!settings.connectCode.trim()}
                  className={`w-full rounded-xl ${
                    settings.connectCode.trim()
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Conectar
                </Button>
              </div>
            </div>

            {/* Notificaciones */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium text-green-800">Notificaciones</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-green-800 font-medium">Activar notificaciones</Label>
                    <p className="text-sm text-gray-600">Recibir alertas y mensajes importantes</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-green-800 font-medium">Notificar sobre movimientos</Label>
                    <p className="text-sm text-gray-600">Alertar a contactos cuando cambies de ubicación</p>
                  </div>
                  <Switch
                    checked={settings.movementAlerts}
                    onCheckedChange={(checked) => handleSettingChange('movementAlerts', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium text-green-800">Ubicación</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-green-800 font-medium">Rastreo de ubicación</Label>
                  <p className="text-sm text-gray-600">Permitir que la app rastree tu ubicación</p>
                </div>
                <Switch
                  checked={settings.locationTracking}
                  onCheckedChange={(checked) => handleSettingChange('locationTracking', checked)}
                />
              </div>
            </div>

            {/* Idioma */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium text-green-800">Idioma</h2>
              </div>
              
              <div className="space-y-2">
                <Label className="text-green-800 font-medium">Seleccionar idioma</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger className="border-green-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es-MX">Español (México)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="fr-FR">Français</SelectItem>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ayuda y soporte */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium text-green-800">Ayuda y soporte</h2>
              </div>
              
              <div className="space-y-3">
                <Link href="/faq">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 rounded-xl py-3 justify-start">
                    Preguntas frecuentes (FAQ)
                  </Button>
                </Link>
                
                <Link href="/support">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 rounded-xl py-3 justify-start">
                    Ayuda / Resolución de dudas
                  </Button>
                </Link>
                
                <Link href="/feedback">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 rounded-xl py-3 justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comentarios y sugerencias
                  </Button>
                </Link>
              </div>
            </div>

            {/* Privacidad y seguridad */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-medium text-green-800">Privacidad y seguridad</h2>
              </div>
              
              <div className="space-y-3">
                <Link href="/privacy">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 rounded-xl py-3 justify-start">
                    Política de privacidad
                  </Button>
                </Link>
                
                <Link href="/terms">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 rounded-xl py-3 justify-start">
                    Términos y condiciones
                  </Button>
                </Link>
                
                <Link href="/data-control">
                  <Button variant="outline" className="w-full border-green-200 text-green-600 rounded-xl py-3 justify-start">
                    Control de datos personales
                  </Button>
                </Link>
              </div>
            </div>

            {/* Cerrar sesión */}
            <div className="space-y-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-4"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Cerrar Sesión
              </Button>
            </div>

            {/* Información de la app */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-2">Help me! v1.0.0</h3>
              <p className="text-sm text-gray-600">
                Aplicación de reporte de acoso y asistencia de emergencia.
                Desarrollada para la seguridad y protección de usuarios.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  )
}
