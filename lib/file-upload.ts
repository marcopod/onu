import { FileUploadResult, TempUploadResult } from './types';

export interface UploadOptions {
  uploadType: 'profile' | 'identity' | 'evidence';
  userId: string;
}

// Upload file to temporary location (for registration flow)
export async function uploadTempFile(file: File, uploadType: string): Promise<TempUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', uploadType);

  const response = await fetch('/api/upload/temp', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Upload failed');
  }

  return result.data;
}

// Note: moveTempFilesToUser function moved to server-side file-utils.ts
// This is a client-side only file now

export async function uploadFile(file: File, options: UploadOptions): Promise<FileUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', options.uploadType);
  formData.append('userId', options.userId);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Upload failed');
  }

  return result.data;
}

export async function uploadMultipleFiles(
  files: File[], 
  options: UploadOptions
): Promise<FileUploadResult[]> {
  const uploadPromises = files.map(file => uploadFile(file, options));
  return Promise.all(uploadPromises);
}

export function validateFile(
  file: File, 
  uploadType: 'profile' | 'identity' | 'evidence'
): { isValid: boolean; error?: string } {
  const allowedTypes = {
    profile: ['image/jpeg', 'image/jpg', 'image/png'],
    identity: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    evidence: [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  };

  const maxSizes = {
    profile: 5 * 1024 * 1024, // 5MB
    identity: 10 * 1024 * 1024, // 10MB
    evidence: 20 * 1024 * 1024 // 20MB
  };

  if (!allowedTypes[uploadType].includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed: ${allowedTypes[uploadType].join(', ')}`
    };
  }

  if (file.size > maxSizes[uploadType]) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${maxSizes[uploadType] / (1024 * 1024)}MB`
    };
  }

  return { isValid: true };
}

export function validateMultipleFiles(
  files: File[], 
  uploadType: 'evidence'
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  let totalSize = 0;

  for (const file of files) {
    const validation = validateFile(file, uploadType);
    if (!validation.isValid) {
      errors.push(`${file.name}: ${validation.error}`);
    }
    totalSize += file.size;
  }

  // Check total size for evidence files
  if (uploadType === 'evidence' && totalSize > 20 * 1024 * 1024) {
    errors.push(`Total file size exceeds 20MB (current: ${(totalSize / 1024 / 1024).toFixed(2)}MB)`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
