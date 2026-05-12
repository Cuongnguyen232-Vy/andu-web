import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      id: order.id, 
      paymentStatus: order.paymentStatus,
      status: order.status
    });
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
