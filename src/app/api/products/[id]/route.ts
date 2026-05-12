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
    
    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi xóa dữ liệu' }, { status: 500 });
  }
}
