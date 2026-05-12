import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getProducts(loai?: string) {
  const whereClause: any = {};
  
  if (loai) {
    whereClause.OR = [
      { material: loai.toLowerCase() },
      { shape: loai.toLowerCase() }
    ];
  } else {
    // Nếu không chọn loại cụ thể, chỉ hiện Gọng kính mặc định
    whereClause.category = 'Gọng kính';
  }

  return await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });
}

const LOAI_LABELS: Record<string, string> = {
  titan: 'Gọng Titan',
  nhua: 'Gọng Nhựa',
  'kim-loai': 'Gọng Kim Loại',
  'nhua-pha-kim-loai': 'Gọng Nhựa Pha Kim Loại',
  oval: 'Gọng Kính Oval',
  tron: 'Gọng Kính Tròn',
  vuong: 'Gọng Kính Vuông',
  'chu-nhat': 'Gọng Kính Chữ Nhật',
  'da-giac': 'Gọng Kính Đa Giác',
  'mat-meo': 'Gọng Kính Mắt Mèo',
};

export default async function GongKinhPage({ searchParams }: { searchParams: Promise<{ loai?: string }> }) {
  const { loai } = await searchParams;
  const products = await getProducts(loai);
  const pageTitle = loai ? (LOAI_LABELS[loai] || loai.toUpperCase()) : 'GỌNG KÍNH';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header />
      <div style={{ padding: '140px 5% 80px', maxWidth: '1500px', margin: '0 auto' }}>

        {/* Tiêu đề + Filter tabs */}
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>
          {pageTitle}
        </h1>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {[
            { label: 'Tất cả', value: '' },
            { label: 'Titan', value: 'titan' },
            { label: 'Nhựa', value: 'nhua' },
            { label: 'Kim Loại', value: 'kim-loai' },
            { label: 'Oval', value: 'oval' },
            { label: 'Tròn', value: 'tron' },
            { label: 'Vuông', value: 'vuong' },
            { label: 'Mắt Mèo', value: 'mat-meo' },
          ].map((chip) => {
            const isActive = (!loai && !chip.value) || loai === chip.value;
            return (
              <Link
                key={chip.value}
                href={chip.value ? `/gong-kinh?loai=${chip.value}` : '/gong-kinh'}
                style={{
                  padding: '8px 18px',
                  borderRadius: '30px',
                  border: `1.5px solid ${isActive ? 'var(--primary)' : '#ddd'}`,
                  backgroundColor: isActive ? 'var(--primary)' : 'white',
                  color: isActive ? 'white' : '#555',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {chip.label}
              </Link>
            );
          })}
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
              {loai ? `Chưa có sản phẩm "${pageTitle}" nào. Hãy vào Admin thêm sản phẩm với chất liệu tương ứng!` : 'Chưa có sản phẩm nào. Vào Admin để thêm nhé!'}
            </p>
            <Link href="/products" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Xem tất cả sản phẩm</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px 30px' }}>
            {products.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `.product-card:hover { transform: translateY(-8px); }`}} />
    </main>
  );
}
