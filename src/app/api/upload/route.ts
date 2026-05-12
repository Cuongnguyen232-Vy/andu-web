import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 });
    }

    // Vercel Blob Upload
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(file.name, file, {
        access: 'public',
      });
      return NextResponse.json({ url: blob.url });
    } else {
      // Fallback cho Local (khi đang code trên máy)
      const { writeFile, mkdir } = require('fs/promises');
      const { existsSync } = require('fs');
      const path = require('path');
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      return NextResponse.json({ url: `/assets/uploads/${filename}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Lỗi server khi upload' }, { status: 500 });
  }
}
