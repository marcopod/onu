"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, User, FileText, Download, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HarassmentReport } from "@/lib/types"
import { toast } from "sonner"

export default function ReportDetailPage() {
  const params = useParams()
  const [report, setReport] = useState<HarassmentReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchReport(params.id as string)
    }
  }, [params.id])

  const fetchReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        setReport(data.data.report)
        setIsAdmin(data.data.isAdmin)
      } else {
        toast.error(data.error || 'Failed to load report')
      }
    } catch (error) {
      console.error('Fetch report error:', error)
      toast.error('Failed to load report')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!report) return

    setIsUpdatingStatus(true)
    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        setReport(prev => prev ? { ...prev, status: newStatus as any } : null)
        toast.success('Estado actualizado correctamente')
      } else {
        toast.error(data.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Update status error:', error)
      toast.error('Failed to update status')
    } finally {
      setIsUpdatingStatus(false)
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'acoso-escolar': 'Acoso escolar (bullying)',
      'acoso-laboral': 'Acoso laboral (mobbing)',
      'acoso-sexual': 'Acoso sexual',
      'acoso-cibernetico': 'Acoso cibernético',
      'violencia-genero': 'Violencia de género',
      'grupos-vulnerables': 'Grupos vulnerables',
      'figura-autoridad': 'Figura de autoridad'
    }
    return labels[category] || category
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Cargando reporte...</p>
        </main>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Reporte no encontrado</p>
          <Link href="/reports">
            <Button className="bg-green-500 hover:bg-green-600">
              Volver a reportes
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="w-full max-w-md p-6">
          <div className="flex items-center mb-6">
            <Link href="/reports" className="text-green-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Detalle del Reporte</h1>
          </div>

          <div className="space-y-6">
            {/* Status and Visibility */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getStatusColor(report.status)}>
                {getStatusLabel(report.status)}
              </Badge>
              {report.isPublic && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Público
                </Badge>
              )}
              <Badge variant="outline" className="text-gray-600">
                ID: {report.id}
              </Badge>
            </div>

            {/* Admin Status Update */}
            {isAdmin && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-medium text-blue-800 mb-2">Actualizar Estado (Admin)</h3>
                <Select 
                  value={report.status} 
                  onValueChange={updateStatus}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger className="border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="reviewed">Revisado</SelectItem>
                    <SelectItem value="resolved">Resuelto</SelectItem>
                    <SelectItem value="dismissed">Desestimado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <h3 className="font-medium text-green-800">Categoría</h3>
              <p className="text-gray-700">{getCategoryLabel(report.category)}</p>
              {report.subcategory && (
                <p className="text-sm text-gray-600">Subcategoría: {report.subcategory}</p>
              )}
            </div>

            {/* Reported User */}
            {(report.reportedUserFullName || report.reportedUserName) && (
              <div className="space-y-2">
                <h3 className="font-medium text-green-800 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Usuario Reportado
                </h3>
                <p className="text-gray-700">{report.reportedUserFullName || report.reportedUserName}</p>
                {isAdmin && report.reportedUserEmail && (
                  <p className="text-sm text-gray-600">{report.reportedUserEmail}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-medium text-green-800">Descripción del Incidente</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
              </div>
            </div>

            {/* Location */}
            {report.location && (
              <div className="space-y-2">
                <h3 className="font-medium text-green-800 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </h3>
                <p className="text-gray-700">{report.location}</p>
              </div>
            )}

            {/* Incident Date */}
            {report.incidentDate && (
              <div className="space-y-2">
                <h3 className="font-medium text-green-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha del Incidente
                </h3>
                <p className="text-gray-700">
                  {new Date(report.incidentDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Evidence Files */}
            {report.evidenceFiles && report.evidenceFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-green-800">Evidencia</h3>
                <div className="space-y-2">
                  {report.evidenceFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{file.fileName}</p>
                          <p className="text-xs text-gray-500">
                            {file.fileType} • {file.fileSize ? (file.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'Tamaño desconocido'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.fileUrl} download={file.fileName}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reporter Info (Admin only) */}
            {isAdmin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Información del Reportador (Admin)</h3>
                <p className="text-sm text-yellow-700">
                  <strong>Nombre:</strong> {report.reporterName}
                </p>
                {report.reporterEmail && (
                  <p className="text-sm text-yellow-700">
                    <strong>Email:</strong> {report.reporterEmail}
                  </p>
                )}
              </div>
            )}

            {/* Timestamps */}
            <div className="space-y-2 text-sm text-gray-500">
              <p><strong>Creado:</strong> {formatDate(report.createdAt)}</p>
              <p><strong>Actualizado:</strong> {formatDate(report.updatedAt)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
