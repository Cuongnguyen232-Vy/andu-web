import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        material: body.material,
        shape: body.shape,
        price: body.price,
        originalPrice: body.originalPrice,
        stock: body.stock,
        description: body.description,
        promos: body.promos,
        image: body.image,
        images: body.images,
        colors: body.colors,
      }
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi cập nhật dữ liệu' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await prisma.$transaction(async (tx) => {
      // 1. Xóa các đánh giá liên quan
      await tx.review.deleteMany({
        where: { productId: id }
      });
      
      // 2. Xóa các chi tiết đơn hàng liên quan
      await tx.orderItem.deleteMany({
        where: { productId: id }
      });

      // 3. Xóa các đơn hàng rỗng (không còn sản phẩm nào)
      await tx.order.deleteMany({
        where: {
          items: {
            none: {}
          }
        }
      });
      
      // 4. Xóa sản phẩm
      await tx.product.delete({
        where: { id }
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    return NextResponse.json({ error: 'Lỗi xóa dữ liệu sản phẩm' }, { status: 500 });
  }
}
