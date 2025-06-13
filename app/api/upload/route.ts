import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('uploadType') as string; // 'profile', 'identity', 'evidence'
    const userId = formData.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!uploadType || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing uploadType or userId' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = {
      profile: ['image/jpeg', 'image/jpg', 'image/png'],
      identity: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
      evidence: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    const maxSizes = {
      profile: 5 * 1024 * 1024, // 5MB
      identity: 10 * 1024 * 1024, // 10MB
      evidence: 20 * 1024 * 1024 // 20MB
    };

    if (!allowedTypes[uploadType as keyof typeof allowedTypes]?.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    if (file.size > maxSizes[uploadType as keyof typeof maxSizes]) {
      return NextResponse.json(
        { success: false, error: 'File too large' },
        { status: 400 }
      );
    }

    // Create upload directory structure
    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadType, userId);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uploadType}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    const fileUrl = `/uploads/${uploadType}/${userId}/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadType
      }
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
