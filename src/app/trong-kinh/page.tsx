import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getProductsByCategory(category: string) {
  return await prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function TrongKinhPage() {
  const products = await getProductsByCategory('Tròng kính');

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header />
      <div style={{ padding: '140px 5% 80px', maxWidth: '1500px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '30px' }}>
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Trang chủ</Link> / <span style={{ color: 'var(--primary)' }}>Tròng kính</span>
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '50px' }}>
          TRÒNG KÍNH
        </h1>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
            <p style={{ fontSize: '1.2rem' }}>Chưa có sản phẩm nào trong danh mục này.</p>
            <Link href="/products" style={{ marginTop: '20px', display: 'inline-block', color: 'var(--primary)', fontWeight: 600 }}>← Xem tất cả sản phẩm</Link>
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
