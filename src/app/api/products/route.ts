import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// API Lấy danh sách sản phẩm
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi đọc dữ liệu' }, { status: 500 });
  }
}

// API Thêm sản phẩm mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newProduct = await prisma.product.create({
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
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi lưu dữ liệu' }, { status: 500 });
  }
}
