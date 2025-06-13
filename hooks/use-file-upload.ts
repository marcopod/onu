import { useState } from 'react';
import { uploadTempFile } from '@/lib/file-upload';
import { TempUploadResult } from '@/lib/types';

export interface FileUploadState {
  isUploading: boolean;
  error: string | null;
  uploadedFile: TempUploadResult | null;
}

export function useFileUpload() {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    error: null,
    uploadedFile: null,
  });

  const uploadFile = async (file: File, uploadType: string): Promise<TempUploadResult | null> => {
    setState(prev => ({ ...prev, isUploading: true, error: null }));

    try {
      const result = await uploadTempFile(file, uploadType);
      setState(prev => ({ ...prev, isUploading: false, uploadedFile: result }));
      return result;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message || 'Upload failed' 
      }));
      return null;
    }
  };

  const clearFile = () => {
    setState({
      isUploading: false,
      error: null,
      uploadedFile: null,
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    uploadFile,
    clearFile,
    clearError,
  };
}

export interface MultiFileUploadState {
  isUploading: boolean;
  error: string | null;
  uploadedFiles: TempUploadResult[];
}

export function useMultiFileUpload() {
  const [state, setState] = useState<MultiFileUploadState>({
    isUploading: false,
    error: null,
    uploadedFiles: [],
  });

  const uploadFiles = async (files: File[], uploadType: string): Promise<TempUploadResult[]> => {
    setState(prev => ({ ...prev, isUploading: true, error: null }));

    try {
      const uploadPromises = files.map(file => uploadTempFile(file, uploadType));
      const results = await Promise.all(uploadPromises);
      
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadedFiles: [...prev.uploadedFiles, ...results] 
      }));
      
      return results;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        error: error.message || 'Upload failed' 
      }));
      return [];
    }
  };

  const removeFile = (tempId: string) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => file.tempId !== tempId)
    }));
  };

  const clearFiles = () => {
    setState({
      isUploading: false,
      error: null,
      uploadedFiles: [],
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    uploadFiles,
    removeFile,
    clearFiles,
    clearError,
  };
}
