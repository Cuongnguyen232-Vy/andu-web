'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ColorItem {
  hex: string;
  stock: number;
}

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    colors?: string | null;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Tính phần trăm giảm giá
  let discountPercent = 0;
  if (product.originalPrice && product.originalPrice > product.price) {
    discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  // Parse màu sắc
  let colorsList: ColorItem[] = [];
  try {
    const raw = product.colors ? JSON.parse(product.colors) : [];
    if (raw.length > 0 && typeof raw[0] === 'string') {
      colorsList = raw.map((hex: string) => ({ hex, stock: 0 }));
    } else {
      colorsList = raw;
    }
  } catch(e) {}

  return (
    <Link href={`/product/${product.id}`} className="product-card-wrapper" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Container Ảnh - Dùng padding-top: 100% để khung luôn vuông tuyệt đối không bị kéo giãn */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
        <Image 
          src={product.image || '/assets/product1.png'} 
          alt={product.name}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          className="product-card-img"
        />
        
        {/* Badge Giảm giá */}
        {discountPercent > 0 && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#ff3333', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(255, 51, 51, 0.3)', zIndex: 2 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>-{discountPercent}%</span>
          </div>
        )}

        {/* Badge Hết hàng */}
        {product.stock <= 0 && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', zIndex: 2 }}>
            HẾT HÀNG
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm (Xếp dọc hoàn toàn) */}
      <div className="product-info-container">
        
        {/* Vùng tự co giãn để đẩy Giá và Nút mua xuống đáy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Tên sản phẩm */}
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 700, color: '#222', margin: '0 0 8px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}>
            {product.name}
          </h3>
          
          {/* Màu sắc */}
          {colorsList.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {colorsList.map((c, i) => (
                <div key={i} style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: c.hex, border: '1px solid #ddd' }} />
              ))}
            </div>
          )}

          {/* Đánh giá */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', color: '#ffc107' }}>
              {[1,2,3,4,5].map(star => <Star key={star} size={12} fill="currentColor" stroke="none" />)}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '2px', whiteSpace: 'nowrap' }}>(1 đánh giá)</span>
          </div>
        </div>

        {/* Cụm Giá tiền và Nút Mua (Sẽ luôn nằm dưới cùng) */}
        <div>
          <div className="product-price-wrapper">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-original-price">
                {product.originalPrice.toLocaleString('vi-VN')}<u>đ</u>
              </span>
            )}
            <span className="product-sale-price">
              {product.price.toLocaleString('vi-VN')}<u>đ</u>
            </span>
          </div>
          
          <button 
            style={{ 
              backgroundColor: '#a68c85', 
              color: '#fff', border: 'none', borderRadius: '4px', 
              padding: '10px 10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              transition: 'background-color 0.2s', width: '100%', textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#a68c85'}
            onClick={(e) => {
              // Prevent event if needed
            }}
          >
            MUA NGAY
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-card-wrapper:hover .product-card-img {
          transform: scale(1.05);
        }
        .product-info-container {
          padding: 16px 0 0 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .product-price-wrapper {
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 4px 8px;
          margin-bottom: 12px;
        }
        .product-original-price {
          font-size: 0.9rem;
          color: #999;
          text-decoration: line-through;
          font-weight: 500;
        }
        .product-sale-price {
          font-size: 1.15rem;
          color: var(--primary);
          font-weight: 800;
        }
        @media (max-width: 768px) {
          .product-original-price {
            font-size: 0.8rem;
          }
          .product-sale-price {
            font-size: 1rem;
          }
        }
      `}} />
    </Link>
  );
}
