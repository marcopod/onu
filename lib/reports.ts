// Utility functions for harassment reports

export const harassmentCategories = {
  "acoso-escolar": {
    label: "Acoso escolar (bullying)",
    subcategories: {
      "fisico": "Golpes, empujones o cualquier forma de violencia física.",
      "verbal": "Insultos, burlas, amenazas o humillaciones.",
      "social": "Exclusión, difusión de rumores o daño a la reputación."
    }
  },
  "acoso-laboral": {
    label: "Acoso laboral (mobbing)",
    subcategories: {
      "psicologico": "Humillaciones, aislamiento u hostigamiento que afecta la salud mental.",
      "sexual": "Comentarios, insinuaciones o tocamientos no deseados en el entorno laboral."
    }
  },
  "acoso-sexual": {
    label: "Acoso sexual",
    subcategories: {
      "verbal": "Comentarios o propuestas sexuales no deseadas.",
      "fisico": "Contacto físico no consentido de naturaleza sexual.",
      "digital": "Envío de contenido sexual no solicitado por internet o mensajes."
    }
  },
  "acoso-cibernetico": {
    label: "Acoso cibernético (cyberbullying)",
    subcategories: {
      "redes-sociales": "Ataques, amenazas o difusión de rumores por redes sociales.",
      "medios-tecnologicos": "Acoso vía correo electrónico, mensajes o cualquier medio digital."
    }
  },
  "violencia-genero": {
    label: "Acoso en pareja / violencia de género",
    subcategories: {
      "emocional": "Manipulación, control o coacción dentro de la relación.",
      "fisico": "Agresiones físicas en contexto de pareja.",
      "economico": "Control de recursos financieros para limitar la autonomía de la pareja."
    }
  },
  "grupos-vulnerables": {
    label: "Acoso a grupos vulnerables",
    subcategories: {
      "menores": "Abuso físico, sexual, emocional o explotación de personas menores de 18 años.",
      "tercera-edad": "Maltrato o abuso a adultos mayores.",
      "discapacidad": "Aislamiento, discriminación o violencia hacia personas con discapacidad.",
      "racial": "Hostigamiento por motivos de raza o etnia.",
      "orientacion-sexual": "Hostigamiento por identidad de género u orientación sexual."
    }
  },
  "figura-autoridad": {
    label: "Acoso por figura de autoridad",
    subcategories: {
      "profesores": "Conductas inapropiadas de docentes hacia estudiantes.",
      "instituciones": "Abuso de poder en entornos institucionales (hospitales, escuelas, etc.)."
    }
  }
} as const;

export type HarassmentCategoryKey = keyof typeof harassmentCategories;

export function getCategoryLabel(category: string): string {
  return harassmentCategories[category as HarassmentCategoryKey]?.label || category;
}

export function getSubcategoryDescription(category: string, subcategory: string): string {
  const categoryData = harassmentCategories[category as HarassmentCategoryKey];
  if (!categoryData) return "";
  
  return categoryData.subcategories[subcategory as keyof typeof categoryData.subcategories] || "";
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'reviewed': return 'bg-blue-100 text-blue-800';
    case 'resolved': return 'bg-green-100 text-green-800';
    case 'dismissed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'reviewed': return 'Revisado';
    case 'resolved': return 'Resuelto';
    case 'dismissed': return 'Desestimado';
    default: return status;
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function validateReportData(data: {
  category: string;
  subcategory?: string;
  description: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.category) {
    errors.push('Category is required');
  }

  if (!data.description || data.description.trim().length < 50) {
    errors.push('Description must be at least 50 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Check if user has admin privileges
export function isUserAdmin(userEmail?: string): boolean {
  if (!userEmail) return false;
  
  // Simple admin check - you can enhance this with a proper role system
  return userEmail.includes('admin') || 
         userEmail.endsWith('@admin.com') ||
         userEmail === 'admin@example.com';
}

// Get file type icon based on file extension
export function getFileTypeIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '🖼️';
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return '🎵';
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎥';
    default:
      return '📎';
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
