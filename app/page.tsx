import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Home, MessageCircleWarning, Settings, MapPin, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col items-center p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6 flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold text-green-800 mt-8">Help me!</h1>

          {/* Botón principal de emergencia */}
          <Link href="/emergency" className="w-full">
            <Button className="w-full h-40 bg-red-500 hover:bg-red-600 rounded-2xl flex flex-col items-center justify-center gap-2 text-white shadow-lg transform transition-transform hover:scale-105">
              <Shield className="h-16 w-16" />
              <span className="text-xl font-medium">PEDIR AYUDA</span>
              <span className="text-sm">Emergencia</span>
            </Button>
          </Link>

          {/* Accesos rápidos */}
          <div className="w-full grid grid-cols-2 gap-4">
            <Link href="/report" className="w-full">
              <Button variant="outline" className="w-full h-24 border-green-200 rounded-xl flex flex-col items-center justify-center gap-2 text-green-700 hover:bg-green-50">
                <MessageCircleWarning className="h-8 w-8" />
                <span className="text-sm font-medium">Reportar</span>
              </Button>
            </Link>

            <Link href="/chat" className="w-full">
              <Button variant="outline" className="w-full h-24 border-green-200 rounded-xl flex flex-col items-center justify-center gap-2 text-green-700 hover:bg-green-50">
                <Users className="h-8 w-8" />
                <span className="text-sm font-medium">Chat</span>
              </Button>
            </Link>
          </div>

          {/* Información de estado */}
          <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Estado de seguridad</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-green-700">
              Ubicación activa • 3 contactos de emergencia configurados
            </p>
          </div>

          {/* Navegación inferior */}
          <div className="mt-auto w-full">
            <nav className="flex items-center justify-between bg-green-500 rounded-full p-2">
              <Link href="/" className="p-2 rounded-full bg-white text-green-500">
                <Home className="h-6 w-6" />
                <span className="sr-only">Home</span>
              </Link>
              <Link href="/report" className="p-2 rounded-full text-white hover:bg-green-600">
                <MessageCircleWarning className="h-6 w-6" />
                <span className="sr-only">Report</span>
              </Link>
              <Link href="/location" className="p-2 rounded-full text-white hover:bg-green-600">
                <MapPin className="h-6 w-6" />
                <span className="sr-only">Location</span>
              </Link>
              <Link href="/chat" className="p-2 rounded-full text-white hover:bg-green-600">
                <Users className="h-6 w-6" />
                <span className="sr-only">Chat</span>
              </Link>
              <Link href="/settings" className="p-2 rounded-full text-white hover:bg-green-600">
                <Settings className="h-6 w-6" />
                <span className="sr-only">Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      </main>
    </div>
  )
}
