import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductFilter from './ProductFilter';
import ProductListClient from './ProductListClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const category = params.category as string;
  const sort = params.sort as string;

  // Build query
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  let where: any = {};
  if (category) {
    where.category = category;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy
  });

  return (
    <main style={{ width: '100%', backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header />
      
      <div className="products-container">
        <h1 className="products-title">
          {category ? category : 'TẤT CẢ SẢN PHẨM'}
        </h1>

        <ProductFilter />
        
        <ProductListClient initialProducts={products} />
      </div>
      
      {/* Thêm CSS inline cho hiệu ứng responsive */}
      <style dangerouslySetInnerHTML={{__html: `
        .products-container {
          padding: 150px calc(5% + 90px) 100px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .products-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          font-family: var(--font-heading);
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 20px;
          text-align: center;
        }
        .product-card:hover { transform: translateY(-10px); }
        
        @media (max-width: 1024px) {
          .products-container {
            padding: 120px 5% 80px;
          }
        }
        @media (max-width: 768px) {
          .products-container {
            padding: 150px 15px 60px; /* Tăng padding-top để không bị lẹm chữ vào Header */
          }
          .products-title {
            font-size: 1.8rem;
          }
        }
      `}} />
    </main>
  );
}
