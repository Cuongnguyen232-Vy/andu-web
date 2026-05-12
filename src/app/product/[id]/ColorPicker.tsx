'use client';

import { useState } from 'react';

const COLOR_MAP: Record<string, string> = {
  '#000000': 'Đen', '#FFFFFF': 'Trắng', '#8B4513': 'Nâu', '#808080': 'Xám',
  '#FFD700': 'Vàng', '#DC143C': 'Đỏ', '#1E90FF': 'Xanh dương', '#228B22': 'Xanh lá',
  '#FF69B4': 'Hồng', '#C0C0C0': 'Bạc', '#B76E79': 'Vàng hồng', '#E8E8E8': 'Trong suốt',
};

interface ColorItem {
  hex: string;
  stock: number;
}

interface ColorPickerProps {
  colors: string; // JSON string from DB
}

export default function ColorPicker({ colors }: ColorPickerProps) {
  const [selected, setSelected] = useState(0);

  // Parse colors - tương thích cả format cũ (string[]) và mới (object[])
  let colorsList: ColorItem[] = [];
  try {
    const raw = colors ? JSON.parse(colors) : [];
    if (raw.length > 0 && typeof raw[0] === 'string') {
      colorsList = raw.map((hex: string) => ({ hex, stock: 0 }));
    } else {
      colorsList = raw;
    }
  } catch(e) {}

  if (colorsList.length === 0) return null;

  const current = colorsList[selected];

  return (
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#444', marginBottom: '12px' }}>Màu sắc:</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {colorsList.map((item, idx) => (
          <div 
            key={idx} 
            title={COLOR_MAP[item.hex] || item.hex}
            onClick={() => setSelected(idx)}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', backgroundColor: item.hex,
              border: idx === selected ? '2.5px solid var(--primary)' : '2px solid #ddd', 
              cursor: 'pointer', position: 'relative',
              boxShadow: idx === selected ? '0 0 0 2px var(--primary)' : 'none',
              transition: 'all 0.2s',
              opacity: item.stock === 0 && item.stock !== undefined ? 0.4 : 1,
            }}
          >
            {idx === selected && (
              <span style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                fontSize: '16px', fontWeight: 700,
                color: item.hex === '#FFFFFF' || item.hex === '#FFD700' || item.hex === '#E8E8E8' || item.hex === '#C0C0C0' ? '#333' : '#fff' 
              }}>✓</span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
        <span style={{ fontSize: '0.88rem', color: '#555', fontWeight: 500 }}>
          {COLOR_MAP[current.hex] || current.hex}
        </span>
        {current.stock > 0 ? (
          <span style={{ fontSize: '0.78rem', color: 'green', fontWeight: 500 }}>• Còn {current.stock} sản phẩm</span>
        ) : current.stock === 0 && colorsList.some(c => c.stock > 0) ? (
          <span style={{ fontSize: '0.78rem', color: 'red', fontWeight: 500 }}>• Hết hàng</span>
        ) : null}
      </div>
    </div>
  );
}
