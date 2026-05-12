'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Ảnh chính */}
      <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
        <Image 
          src={images[activeIndex] || '/assets/product1.png'} 
          alt={productName} 
          fill 
          style={{ objectFit: 'cover' }} 
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
          {images.map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{ 
                width: '75px', height: '75px', position: 'relative', borderRadius: '10px', overflow: 'hidden', 
                border: idx === activeIndex ? '2.5px solid var(--primary)' : '1.5px solid #ddd', 
                cursor: 'pointer', flexShrink: 0,
                opacity: idx === activeIndex ? 1 : 0.7,
                transition: 'all 0.2s',
              }}
            >
              <Image src={img} alt={`${productName} - ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
