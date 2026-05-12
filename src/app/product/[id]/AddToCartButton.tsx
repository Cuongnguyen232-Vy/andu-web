'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';

export default function AddToCartButton({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('andu_favorites') || '[]');
    setIsFavorite(favorites.includes(product.id));
  }, [product.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('andu_favorites') || '[]');
    let newFavorites;
    if (favorites.includes(product.id)) {
      newFavorites = favorites.filter((id: string) => id !== product.id);
      setIsFavorite(false);
    } else {
      newFavorites = [...favorites, product.id];
      setIsFavorite(true);
    }
    localStorage.setItem('andu_favorites', JSON.stringify(newFavorites));
  };

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || '/assets/product1.png',
      quantity: quantity,
      stock: product.stock
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '10px', padding: '5px 15px', height: '54px' }}>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', color: '#555' }}
        >
          <Minus size={18} />
        </button>
        <span style={{ width: '40px', textAlign: 'center', fontWeight: 600, fontSize: '1.1rem' }}>{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', color: '#555' }}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Nút Thêm vào giỏ hàng (Chỉ icon) */}
      <button
        onClick={handleAdd}
        disabled={product.stock <= 0}
        title="Thêm vào giỏ hàng"
        style={{
          width: '54px',
          height: '54px',
          backgroundColor: '#fff',
          color: product.stock > 0 ? (added ? 'var(--primary)' : 'var(--primary)') : '#ccc',
          border: `1px solid ${product.stock > 0 ? (added ? 'var(--primary)' : 'var(--primary)') : '#ccc'}`,
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s',
        }}
      >
        <ShoppingCart size={24} />
      </button>

      {/* Nút Mua Ngay */}
      <button
        onClick={() => {
          if (product.stock > 0) {
            sessionStorage.setItem('buyNowItem', JSON.stringify({
              id: product.id,
              name: product.name,
              price: Number(product.price),
              image: product.image || '/assets/product1.png',
              quantity: quantity,
              stock: product.stock
            }));
            window.location.href = '/checkout?buyNow=true';
          }
        }}
        disabled={product.stock <= 0}
        style={{
          flex: 1,
          height: '54px',
          backgroundColor: product.stock > 0 ? 'var(--primary)' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1.05rem',
          fontWeight: 800,
          cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s',
          textTransform: 'uppercase'
        }}
      >
        {product.stock > 0 ? 'MUA NGAY' : 'HẾT HÀNG'}
      </button>

      {/* Nút Yêu thích */}
      <button
        onClick={toggleFavorite}
        title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '10px',
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          color: isFavorite ? '#ef4444' : '#888',
          transition: 'all 0.3s',
        }}
      >
        <Heart size={24} fill={isFavorite ? '#ef4444' : 'none'} />
      </button>
    </div>
  );
}
