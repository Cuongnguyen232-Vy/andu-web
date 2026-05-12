import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'andu-eyewear-secret-key-2026');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bảo vệ tất cả route /admin/*
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('andu-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/dang-nhap?redirect=admin', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Chỉ role=admin mới được vào
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dang-nhap?error=unauthorized', request.url));
      }
      
      return NextResponse.next();
    } catch {
      // Token hết hạn hoặc không hợp lệ
      return NextResponse.redirect(new URL('/dang-nhap?redirect=admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
