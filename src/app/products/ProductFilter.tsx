'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ArrowUpDown, Heart } from 'lucide-react';

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const showFavorites = searchParams.get('favorites') === 'true';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const selectStyle: React.CSSProperties = {
    padding: '10px 40px 10px 16px',
    borderRadius: '30px',
    border: '1px solid #eaeaea',
    outline: 'none',
    backgroundColor: '#fff',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#333',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease'
  };

  return (
    <div className="product-filter-container">
      <div className="filter-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#135c41' }}>
          <Filter size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Danh mục</span>
        </div>
        <select 
          value={currentCategory} 
          onChange={(e) => updateFilters('category', e.target.value)}
          style={selectStyle}
          className="filter-select"
          onMouseOver={e => e.currentTarget.style.borderColor = '#135c41'}
          onMouseOut={e => e.currentTarget.style.borderColor = '#eaeaea'}
        >
          <option value="">Tất cả sản phẩm</option>
          <option value="Gọng kính">Gọng kính</option>
          <option value="Tròng kính">Tròng kính</option>
          <option value="Kính râm">Kính râm</option>
          <option value="Phụ kiện">Phụ kiện</option>
        </select>

        {/* Nút lọc sản phẩm yêu thích */}
        <button
          onClick={() => updateFilters('favorites', showFavorites ? '' : 'true')}
          className="btn-favorite"
          style={{
            backgroundColor: showFavorites ? '#ef4444' : '#f9f9f9',
            color: showFavorites ? '#fff' : '#555',
            border: `1px solid ${showFavorites ? '#ef4444' : '#ddd'}`,
          }}
        >
          <Heart size={18} fill={showFavorites ? '#fff' : 'none'} />
          Yêu thích
        </button>
      </div>

      <div className="filter-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#135c41' }}>
          <ArrowUpDown size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sắp xếp</span>
        </div>
        <select 
          value={currentSort} 
          onChange={(e) => updateFilters('sort', e.target.value)}
          style={selectStyle}
          className="filter-select"
          onMouseOver={e => e.currentTarget.style.borderColor = '#135c41'}
          onMouseOut={e => e.currentTarget.style.borderColor = '#eaeaea'}
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến Cao</option>
          <option value="price_desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-filter-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding: 20px 25px;
          background-color: #fff;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .filter-group {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        .btn-favorite {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        @media (max-width: 768px) {
          .product-filter-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            padding: 15px;
          }
          .filter-group {
            flex-wrap: wrap;
            width: 100%;
          }
          .filter-select {
            flex: 1;
            min-width: 150px;
          }
          .btn-favorite {
            margin-left: 0 !important;
            flex-grow: 1;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}
