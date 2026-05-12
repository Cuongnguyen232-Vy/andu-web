import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'andu-eyewear-secret-key-2026');

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('andu-token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Lấy thông tin đầy đủ từ DB (bao gồm phone, address)
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
      }
    });
    
    if (!dbUser) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({ user: dbUser });
  } catch {
    return NextResponse.json({ user: null });
  }
}

// Cập nhật profile
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('andu-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 });
    }
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const body = await request.json();
    const { name, phone, address } = body;
    
    const updatedUser = await prisma.user.update({
      where: { id: payload.id as string },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
      }
    });
    
    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi cập nhật' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('andu-token');
  return response;
}
