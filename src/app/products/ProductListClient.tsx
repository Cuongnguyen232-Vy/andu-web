'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

export default function ProductListClient({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const showFavorites = searchParams.get('favorites') === 'true';
    
    if (showFavorites) {
      const favorites = JSON.parse(localStorage.getItem('andu_favorites') || '[]');
      setProducts(initialProducts.filter(p => favorites.includes(p.id)));
    } else {
      setProducts(initialProducts);
    }
  }, [searchParams, initialProducts]);

  // Prevent hydration mismatch by returning empty or basic skeleton before mount
  if (!mounted) {
    return <div style={{ minHeight: '50vh' }}>Đang tải...</div>;
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>Không tìm thấy sản phẩm nào phù hợp.</p>
        <Link href="/products" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: 'var(--primary)', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: 600 }}>
          Xem tất cả sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="product-list-grid">
        {products.map((item: any) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <ProductCard product={item} />
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .product-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 40px 30px;
        }
        @media (max-width: 768px) {
          .product-list-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
        }
      `}} />
    </>
  );
}
