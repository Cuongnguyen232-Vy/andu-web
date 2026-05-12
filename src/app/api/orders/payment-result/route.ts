import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (status === 'success') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'paid',
          status: 'processing' // Cập nhật sang Đang xử lý
        }
      });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'unpaid',
          status: 'cancelled' // Hủy đơn
        }
      });
      // Optionally restock the items here
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi payment-result:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
