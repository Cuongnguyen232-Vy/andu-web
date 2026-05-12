import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const config = await prisma.setting.findUnique({
      where: { key: 'store_config' }
    });

    if (!config) {
      return NextResponse.json({
        shopName: 'Andu Eyewear',
        phone: '0987 654 321',
        email: 'contact@andu.vn',
        address: '123 Đường Láng, Đống Đa, Hà Nội',
        promoText: '🎁 TẶNG HỘP KÍNH CAO CẤP KHI MUA GỌNG KÍNH',
        bannerImage: '/assets/banner1.jpg',
        cat1Image: '/assets/category1.png',
        cat2Image: '/assets/category2.png',
        cat3Image: '/assets/category3.png',
        cat4Image: '/assets/category4.png',
        storyText: 'Cùng Andu Eyewear khám phá những xu hướng kính mắt thời thượng nhất. Sự kết hợp hoàn hảo giữa chế tác tinh xảo và thiết kế độc bản, mang đến trải nghiệm khác biệt để tôn vinh mọi đường nét trên khuôn mặt bạn.',
        footerDesc: 'Nâng tầm phong cách, bảo vệ tầm nhìn của bạn mỗi ngày với công nghệ và thiết kế độc quyền.'
      });
    }

    return NextResponse.json(JSON.parse(config.value));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Lưu vào bảng Setting (nếu đã có thì update, chưa có thì tạo)
    const config = await prisma.setting.upsert({
      where: { key: 'store_config' },
      update: { value: JSON.stringify(body) },
      create: { 
        id: 'store_config',
        key: 'store_config', 
        value: JSON.stringify(body) 
      }
    });

    return NextResponse.json({ success: true, data: JSON.parse(config.value) });
  } catch (error) {
    console.error("Lỗi khi lưu cấu hình:", error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
