"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, Navigation, Clock, Calendar, Filter, Home, MessageCircleWarning, Settings } from "lucide-react"

interface LocationEntry {
  id: string
  latitude: number
  longitude: number
  address: string
  timestamp: Date
  accuracy: number
}

export default function LocationPage() {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null)
  const [locationHistory, setLocationHistory] = useState<LocationEntry[]>([
    {
      id: "1",
      latitude: 19.4326,
      longitude: -99.1332,
      address: "Centro Histórico, Ciudad de México",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      accuracy: 10
    },
    {
      id: "2", 
      latitude: 19.4284,
      longitude: -99.1276,
      address: "Zócalo, Ciudad de México",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      accuracy: 15
    },
    {
      id: "3",
      latitude: 19.4355,
      longitude: -99.1421,
      address: "Alameda Central, Ciudad de México", 
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
      accuracy: 8
    }
  ])
  const [searchFilter, setSearchFilter] = useState("")
  const [isTracking, setIsTracking] = useState(true)

  useEffect(() => {
    if (navigator.geolocation && isTracking) {
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
  }, [isTracking])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short' 
    })
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `hace ${diffHours}h ${diffMinutes}m`
    } else {
      return `hace ${diffMinutes}m`
    }
  }

  const filteredLocations = locationHistory.filter(location =>
    location.address.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Mi Ubicación</h1>
          </div>

          {/* Mapa satelital */}
          <div className="space-y-4">
            <div className="relative h-48 bg-gray-100 rounded-xl border border-green-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Vista satelital del mapa</p>
                  {currentLocation && (
                    <p className="text-xs text-gray-500 mt-1">
                      {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Marcadores simulados */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-8 right-6 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute bottom-6 left-8 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              
              {/* Ubicación actual */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
            </div>

            {/* Estado del tracking */}
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {isTracking ? "Rastreando ubicación" : "Rastreo pausado"}
                </span>
              </div>
              <Button
                size="sm"
                variant={isTracking ? "outline" : "default"}
                onClick={() => setIsTracking(!isTracking)}
                className={isTracking ? "border-green-200 text-green-700" : "bg-green-500 hover:bg-green-600"}
              >
                {isTracking ? "Pausar" : "Activar"}
              </Button>
            </div>
          </div>

          {/* Filtro de búsqueda */}
          <div className="mt-6 space-y-2">
            <Label className="text-green-800 font-medium">Buscar en historial</Label>
            <div className="relative">
              <Input
                placeholder="Buscar ubicación..."
                className="pl-10 border-green-200 rounded-xl"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            </div>
          </div>

          {/* Lista de ubicaciones */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-green-800 font-medium">Historial de ubicaciones</Label>
              <span className="text-sm text-gray-500">{filteredLocations.length} registros</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredLocations.map((location) => (
                <div key={location.id} className="border border-green-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {location.address}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(location.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(location.timestamp)}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-1">
                        Precisión: {location.accuracy}m • {getTimeAgo(location.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">Información de privacidad</h3>
            <p className="text-sm text-blue-700">
              Tu ubicación se almacena de forma segura y solo se comparte con contactos de emergencia cuando actives una alerta. 
              Puedes pausar el rastreo en cualquier momento.
            </p>
          </div>

          {/* Navegación inferior */}
          <div className="mt-8 w-full">
            <nav className="flex items-center justify-between bg-green-500 rounded-full p-2">
              <Link href="/" className="p-2 rounded-full text-white">
                <Home className="h-6 w-6" />
                <span className="sr-only">Home</span>
              </Link>
              <Link href="/report" className="p-2 rounded-full text-white">
                <MessageCircleWarning className="h-6 w-6" />
                <span className="sr-only">Report</span>
              </Link>
              <Link href="/location" className="p-2 rounded-full bg-white text-green-500">
                <MapPin className="h-6 w-6" />
                <span className="sr-only">Location</span>
              </Link>
              <Link href="/settings" className="p-2 rounded-full text-white">
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
