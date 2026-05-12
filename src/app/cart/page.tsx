'use client';

import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', paddingBottom: '80px' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '130px', paddingLeft: '20px', paddingRight: '20px' }}>
        
        {/* Breadcrumb */}
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          {' / '}
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Giỏ hàng</span>
        </p>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#222', marginBottom: '30px', fontFamily: 'var(--font-heading, serif)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Sản Phẩm
        </h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <ShoppingBag size={60} color="#ccc" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '1.3rem', color: '#666', marginBottom: '20px' }}>Giỏ hàng của bạn đang trống</h2>
            <Link href="/products" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '30px', fontWeight: 600, textDecoration: 'none' }}>
              Tiếp tục mua hàng
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            
            {/* Bảng sản phẩm - kiểu Anna */}
            <div className="cart-table-wrapper">
              {/* Header bảng */}
              <div className="cart-table-row" style={{ padding: '16px 20px', borderBottom: '2px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                <span></span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>Thông tin sản phẩm</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Giá</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Số lượng</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Còn lại</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Tổng cộng</span>
                <span></span>
              </div>

              {/* Danh sách sản phẩm */}
              {cart.map((item) => (
                <div key={item.id} className="cart-table-row" style={{ padding: '20px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.2s' }}>
                  {/* Ảnh nhỏ */}
                  <div style={{ width: '45px', height: '45px', position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0 }}>
                    <Image src={item.image || '/assets/product1.png'} alt={item.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  
                  {/* Tên sản phẩm */}
                  <div style={{ paddingLeft: '15px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#222', margin: 0, lineHeight: 1.4 }}>{item.name}</h3>
                  </div>

                  {/* Đơn giá */}
                  <span style={{ textAlign: 'center', fontSize: '0.95rem', color: '#333' }}>
                    {Number(item.price).toLocaleString('vi-VN')}₫
                  </span>

                  {/* Số lượng - kiểu Anna */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '1rem' }}
                      >
                        −
                      </button>
                      <span style={{ width: '36px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem', borderLeft: '1px solid #eee', borderRight: '1px solid #eee', lineHeight: '32px' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ width: '32px', height: '32px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '1rem' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Còn lại (Stock) */}
                  <span style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888' }}>
                    {item.stock ? `${item.stock} sp` : '—'}
                  </span>

                  {/* Thành tiền */}
                  <span style={{ textAlign: 'right', fontWeight: 700, color: '#222', fontSize: '0.95rem' }}>
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </span>

                  {/* Xóa */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#ff4d4f')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#ccc')}
                    title="Xóa sản phẩm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {/* Footer giỏ hàng */}
              <div className="cart-footer-buttons">
                <button 
                  onClick={() => { if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm?')) { cart.forEach(i => removeFromCart(i.id)); } }}
                  style={{ padding: '10px 24px', border: '1px solid #ddd', borderRadius: '30px', backgroundColor: '#f9f9f9', color: '#666', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  Xóa sản phẩm đã chọn
                </button>
                <Link href="/products" style={{ padding: '10px 24px', border: '1px solid var(--primary)', borderRadius: '30px', backgroundColor: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Tiếp tục mua hàng
                </Link>
              </div>
            </div>

            {/* Sidebar tóm tắt - kiểu Anna */}
            <div style={{ backgroundColor: '#f5f5f5', borderRadius: '12px', padding: '30px', position: 'sticky', top: '120px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Tóm tắt đơn hàng</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.95rem', color: '#555' }}>
                <span>Tạm tính</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem', color: '#555' }}>
                <span>Phí vận chuyển</span>
                <span style={{ fontWeight: 500, color: '#888', fontSize: '0.85rem' }}>Tính ở bước thanh toán</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '20px', marginBottom: '25px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>Tổng</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#222' }}>{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>

              <Link href="/checkout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%', padding: '14px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Thanh toán ngay
              </Link>

              <div style={{ marginTop: '25px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '10px' }}>Chúng tôi chấp nhận thanh toán</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ padding: '4px 10px', backgroundColor: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#1a1f71', border: '1px solid #eee' }}>VISA</span>
                  <span style={{ padding: '4px 10px', backgroundColor: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#eb001b', border: '1px solid #eee' }}>MasterCard</span>
                  <span style={{ padding: '4px 10px', backgroundColor: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#333', border: '1px solid #eee' }}>COD</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <style dangerouslySetInnerHTML={{__html: `
          .cart-layout {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 30px;
            align-items: start;
          }
          .cart-table-wrapper {
            background-color: #fff;
            border-radius: 12px;
            overflow-x: auto;
            box-shadow: 0 2px 15px rgba(0,0,0,0.04);
          }
          .cart-table-row {
            display: grid;
            grid-template-columns: 50px minmax(200px, 1fr) 130px 140px 100px 120px 50px;
            align-items: center;
          }
          .cart-footer-buttons {
            display: flex;
            gap: 12px;
            padding: 20px;
            border-top: 1px solid #f0f0f0;
          }
          @media (max-width: 1024px) {
            .cart-layout {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 480px) {
            .cart-footer-buttons {
              flex-direction: column;
            }
            .cart-footer-buttons button, .cart-footer-buttons a {
              width: 100%;
              justify-content: center;
            }
          }
        `}} />
      </div>
    </main>
  );
}
