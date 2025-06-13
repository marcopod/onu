"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Filter, Search, Eye, Calendar, User, MapPin, FileText, Home, MessageCircleWarning, Settings, ClipboardList } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { HarassmentReport } from "@/lib/types"
import { toast } from "sonner"
import { ProtectedRoute } from "@/components/auth/route-guard"

function ReportsPageContent() {
  const [reports, setReports] = useState<HarassmentReport[]>([])
  const [filteredReports, setFilteredReports] = useState<HarassmentReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    fetchReports()
  }, [])

  useEffect(() => {
    filterReports()
  }, [reports, searchQuery, statusFilter, categoryFilter])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports', {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setReports(data.data.reports)
        setIsAdmin(data.data.isAdmin)
      } else {
        toast.error(data.error || 'Failed to load reports')
      }
    } catch (error) {
      console.error('Fetch reports error:', error)
      toast.error('Failed to load reports')
    } finally {
      setIsLoading(false)
    }
  }

  const filterReports = () => {
    let filtered = reports

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reporterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportedUserFullName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(report => report.category === categoryFilter)
    }

    setFilteredReports(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'dismissed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'reviewed': return 'Revisado'
      case 'resolved': return 'Resuelto'
      case 'dismissed': return 'Desestimado'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const categories = [
    { value: "all", label: "Todas las categorías" },
    { value: "acoso-escolar", label: "Acoso escolar" },
    { value: "acoso-laboral", label: "Acoso laboral" },
    { value: "acoso-sexual", label: "Acoso sexual" },
    { value: "acoso-cibernetico", label: "Acoso cibernético" },
    { value: "violencia-genero", label: "Violencia de género" },
    { value: "grupos-vulnerables", label: "Grupos vulnerables" },
    { value: "figura-autoridad", label: "Figura de autoridad" }
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
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
            <h1 className="text-2xl font-bold text-green-800 ml-4">
              Reportes {isAdmin && "(Admin)"}
            </h1>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Input
                placeholder="Buscar reportes..."
                className="pl-10 border-green-200 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-green-200 rounded-xl">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="reviewed">Revisado</SelectItem>
                  <SelectItem value="resolved">Resuelto</SelectItem>
                  <SelectItem value="dismissed">Desestimado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-green-200 rounded-xl">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4 mb-20">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se encontraron reportes</p>
                <Link href="/report">
                  <Button className="mt-4 bg-green-500 hover:bg-green-600">
                    Crear primer reporte
                  </Button>
                </Link>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusLabel(report.status)}
                        </Badge>
                        {report.isPublic && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            Público
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-green-800 mb-1">
                        {report.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {report.subcategory && ` - ${report.subcategory}`}
                      </h3>
                    </div>
                    <Link href={`/reports/${report.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(report.createdAt)}
                    </div>
                    {report.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location.substring(0, 20)}...
                      </div>
                    )}
                    {(report.reportedUserFullName || report.reportedUserName) && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {report.reportedUserFullName || report.reportedUserName}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Navegación inferior */}
          <div className="mt-auto w-full">
            <nav className="flex items-center justify-between bg-green-500 rounded-full p-2">
              <Link href="/" className="p-2 rounded-full bg-white text-green-500">
                <Home className="h-6 w-6" />
                <span className="sr-only">Home</span>
              </Link>
              
              <Link href="/reports" className="p-2 rounded-full text-white hover:bg-green-600">
                <ClipboardList className="h-6 w-6" />
                <span className="sr-only">Reports</span>
              </Link>

              <Link href="/location" className="p-2 rounded-full text-white hover:bg-green-600">
                <MapPin className="h-6 w-6" />
                <span className="sr-only">Location</span>
              </Link>

              <Link href="/profile" className="p-2 rounded-full text-white hover:bg-green-600">
                <User className="h-6 w-6" />
                <span className="sr-only">Profile</span>
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

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsPageContent />
    </ProtectedRoute>
  )
}
