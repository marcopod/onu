import { FileUploadResult } from './types';
import { copyFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface UploadOptions {
  uploadType: 'profile' | 'identity' | 'evidence';
  userId: string;
}

export interface TempUploadResult {
  tempId: string;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadType: string;
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

// Move temporary files to permanent location after user registration
export async function moveTempFilesToUser(tempFiles: TempUploadResult[], userId: string): Promise<FileUploadResult[]> {
  const results: FileUploadResult[] = [];

  for (const tempFile of tempFiles) {
    try {
      // Create user directory
      const userDir = join(process.cwd(), 'public', 'uploads', tempFile.uploadType, userId);
      if (!existsSync(userDir)) {
        await mkdir(userDir, { recursive: true });
      }

      // Generate new filename
      const timestamp = Date.now();
      const fileExtension = tempFile.fileName.split('.').pop();
      const newFileName = `${tempFile.uploadType}_${timestamp}.${fileExtension}`;

      // Copy from temp to permanent location
      const tempPath = join(process.cwd(), 'public', tempFile.url.substring(1)); // Remove leading /
      const permanentPath = join(userDir, newFileName);

      await copyFile(tempPath, permanentPath);

      // Clean up temp file
      await unlink(tempPath);

      // Generate permanent URL
      const permanentUrl = `/uploads/${tempFile.uploadType}/${userId}/${newFileName}`;

      results.push({
        url: permanentUrl,
        fileName: tempFile.fileName,
        fileSize: tempFile.fileSize,
        fileType: tempFile.fileType
      });

    } catch (error) {
      console.error('Error moving temp file:', error);
      // Continue with other files even if one fails
    }
  }

  return results;
}

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
