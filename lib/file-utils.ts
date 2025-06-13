// Server-side file utilities (Node.js only)
import { FileUploadResult, TempUploadResult } from './types';
import { copyFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
