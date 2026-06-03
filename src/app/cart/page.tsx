'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Khởi tạo các item trong giỏ hàng đều được check mặc định
  useEffect(() => {
    if (cart.length > 0) {
      const initialChecked: Record<string, boolean> = {};
      cart.forEach(item => {
        // Giữ lại trạng thái check cũ nếu có, nếu không thì mặc định là true
        initialChecked[item.id] = checkedItems[item.id] !== false;
      });
      setCheckedItems(initialChecked);
    }
  }, [cart]);

  const handleToggle = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleAll = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    cart.forEach(item => {
      updated[item.id] = checked;
    });
    setCheckedItems(updated);
  };

  const checkedCount = cart.filter(item => checkedItems[item.id] !== false).length;
  const isAllChecked = cart.length > 0 && checkedCount === cart.length;

  const checkedTotalPrice = cart.reduce((sum, item) => {
    if (checkedItems[item.id] !== false) {
      return sum + (item.price * item.quantity);
    }
    return sum;
  }, 0);

  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    const selectedItems = cart.filter(item => checkedItems[item.id] !== false);
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    // Lưu danh sách sản phẩm được chọn vào sessionStorage để Checkout page đọc
    sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    router.push('/checkout?cartSelect=true');
  };

  const handleRemoveSelected = () => {
    const selectedIds = cart
      .filter(item => checkedItems[item.id] !== false)
      .map(item => item.id);
    
    if (selectedIds.length === 0) {
      alert('Vui lòng chọn các sản phẩm cần xóa.');
      return;
    }

    if (confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) {
      selectedIds.forEach(id => removeFromCart(id));
    }
  };

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
          Giỏ Hàng Của Bạn
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={isAllChecked} 
                    onChange={(e) => handleToggleAll(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} 
                  />
                </div>
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
                  {/* Checkbox chọn sản phẩm */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={checkedItems[item.id] !== false} 
                      onChange={() => handleToggle(item.id)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }} 
                    />
                  </div>

                  {/* Ảnh và thông tin sản phẩm */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0 }}>
                      <Image src={item.image || '/assets/product1.png'} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#222', margin: 0, lineHeight: 1.4 }}>{item.name}</h3>
                    </div>
                  </div>

                  {/* Đơn giá */}
                  <span style={{ textAlign: 'center', fontSize: '0.95rem', color: '#333' }}>
                    {Number(item.price).toLocaleString('vi-VN')}₫
                  </span>

                  {/* Số lượng */}
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
                    {item.stock ? `${item.stock} sp` : 'Còn hàng'}
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
                  onClick={handleRemoveSelected}
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
                <span>Đã chọn</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{checkedCount} sản phẩm</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.95rem', color: '#555' }}>
                <span>Tạm tính</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{checkedTotalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem', color: '#555' }}>
                <span>Phí vận chuyển</span>
                <span style={{ fontWeight: 500, color: '#888', fontSize: '0.85rem' }}>Tính ở bước thanh toán</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '20px', marginBottom: '25px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>Tổng tiền</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#222' }}>{checkedTotalPrice.toLocaleString('vi-VN')}₫</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkedCount === 0}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', width: '100%', padding: '14px', backgroundColor: checkedCount === 0 ? '#ccc' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 700, cursor: checkedCount === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                Thanh toán ngay ({checkedCount})
              </button>

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
            grid-template-columns: 50px minmax(250px, 1fr) 120px 140px 100px 120px 50px;
            align-items: center;
          }
          .cart-footer-buttons {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            border-top: 1px solid #f0f0f0;
          }
          @media (max-width: 1024px) {
            .cart-layout {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 768px) {
            .cart-table-row:first-child {
              display: none !important;
            }
            .cart-table-row {
              display: flex !important;
              flex-direction: column !important;
              align-items: stretch !important;
              padding: 15px !important;
              background-color: #fff;
              border-radius: 12px;
              margin-bottom: 15px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.04);
              border-bottom: none !important;
              position: relative;
            }
            .cart-table-row > div:nth-child(1) {
              position: absolute;
              left: 15px;
              top: 15px;
              z-index: 2;
            }
            .cart-table-row > div:nth-child(2) {
              padding-left: 28px !important;
              margin-bottom: 12px;
            }
            .cart-table-row > span:nth-child(3) {
              display: flex;
              justify-content: space-between;
              padding-left: 28px;
              font-size: 0.9rem;
              color: #666;
            }
            .cart-table-row > span:nth-child(3)::before {
              content: "Đơn giá:";
              font-weight: 600;
              color: #444;
            }
            .cart-table-row > div:nth-child(4) {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center;
              padding-left: 28px;
              margin-top: 8px;
            }
            .cart-table-row > div:nth-child(4)::before {
              content: "Số lượng:";
              font-weight: 600;
              color: #444;
              font-size: 0.9rem;
            }
            .cart-table-row > span:nth-child(5) {
              display: flex;
              justify-content: space-between;
              padding-left: 28px;
              margin-top: 8px;
              font-size: 0.85rem;
            }
            .cart-table-row > span:nth-child(5)::before {
              content: "Kho hàng:";
              font-weight: 600;
              color: #444;
            }
            .cart-table-row > span:nth-child(6) {
              display: flex;
              justify-content: space-between;
              padding-left: 28px;
              margin-top: 8px;
              font-size: 0.95rem;
              color: var(--primary) !important;
              font-weight: 700;
            }
            .cart-table-row > span:nth-child(6)::before {
              content: "Thành tiền:";
              font-weight: 600;
              color: #444;
            }
            .cart-table-row > button:nth-child(7) {
              position: absolute;
              right: 15px;
              top: 15px;
            }
          }
          @media (max-width: 480px) {
            .cart-footer-buttons {
              flex-direction: column;
              gap: 10px;
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
