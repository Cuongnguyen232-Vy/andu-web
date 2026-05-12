import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Đảm bảo thư mục upload tồn tại
    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Tạo tên file an toàn
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filepath = path.join(uploadDir, filename);
    
    // Lưu file vào thư mục public/assets/uploads
    await writeFile(filepath, buffer);
    
    // Trả về đường dẫn public để lưu vào database
    return NextResponse.json({ url: `/assets/uploads/${filename}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Lỗi server khi upload' }, { status: 500 });
  }
}
