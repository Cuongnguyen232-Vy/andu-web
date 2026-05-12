import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
    }

    // Kiểm tra xem email đã đăng ký chưa
    const existing = await prisma.subscription.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json({ error: 'Email này đã đăng ký nhận ưu đãi trước đó!' }, { status: 400 });
    }

    // Tạo mới
    const newSub = await prisma.subscription.create({
      data: {
        name,
        email,
        phone
      }
    });

    return NextResponse.json({ success: true, data: newSub });
  } catch (error: any) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: 'Lỗi server khi đăng ký nhận tin' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subs = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(subs);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}
