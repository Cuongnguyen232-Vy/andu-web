import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, customerAddress, notes, paymentMethod, totalAmount, items } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Cập nhật tồn kho (Stock)
    const order = await prisma.$transaction(async (tx) => {
      // 1. Tạo đơn hàng
      const newOrder = await tx.order.create({
        data: {
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress: customerAddress,
          notes: notes || '',
          totalAmount: Math.round(totalAmount),
          status: 'pending',
          paymentMethod: paymentMethod || 'cod',
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              name: item.name,
              image: item.image,
              quantity: item.quantity,
              price: Math.round(item.price) // Đảm bảo là Int
            }))
          }
        }
      });

      // 2. Trừ tồn kho
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Order Error Details:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
