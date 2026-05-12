'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [promoText, setPromoText] = useState('🎁 TẶNG HỘP KÍNH CAO CẤP KHI MUA GỌNG KÍNH');
  const { totalItems } = useCart();

  useEffect(() => {
    // Lấy thông tin user hiện tại
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});

    // Lấy cấu hình khuyến mãi
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.promoText) setPromoText(data.promoText);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const promos = Array(6).fill(promoText);

  return (
    <header className={styles.headerWrapper}>
      {/* Top Promotion Bar */}
      <div className={`${styles.topBar} ${isScrolled ? styles.topBarHidden : ''}`}>
        <div className={styles.topBarTrack}>
          {promos.map((text, i) => (
            <span key={i} className={styles.topBarItem}>{text}</span>
          ))}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/assets/logo.png" alt="Andu Logo" width={48} height={48} className={styles.logoImage} />
        </Link>

        <div className={styles.links}>
          {/* Trang chủ */}
          <div className={styles.navItem}>
            <Link href="/" className={styles.navLink}>Trang chủ</Link>
          </div>

          {/* GỌNG KÍNH — Mega Menu */}
          <div className={styles.navItem}>
            <Link href="/gong-kinh" className={styles.navLink}>
              Gọng Kính <ChevronDown size={13} />
            </Link>
            <div className={`${styles.megaMenu} ${isScrolled ? styles.megaMenuScrolled : ''}`}>
              <div className={styles.megaCol}>
                <p className={styles.megaColTitle}>Chất liệu</p>
                <Link href="/gong-kinh?loai=titan" className={styles.megaLink}>Gọng Titan</Link>
                <Link href="/gong-kinh?loai=nhua" className={styles.megaLink}>Gọng Nhựa</Link>
                <Link href="/gong-kinh?loai=kim-loai" className={styles.megaLink}>Gọng Kim Loại</Link>
                <Link href="/gong-kinh?loai=nhua-pha-kim-loai" className={styles.megaLink}>Gọng nhựa pha kim loại</Link>
              </div>
              <div className={styles.megaCol}>
                <p className={styles.megaColTitle}>Hình dáng</p>
                <Link href="/gong-kinh?loai=oval" className={styles.megaLink}>Gọng Kính Oval</Link>
                <Link href="/gong-kinh?loai=tron" className={styles.megaLink}>Gọng Kính Tròn</Link>
                <Link href="/gong-kinh?loai=vuong" className={styles.megaLink}>Gọng Kính Vuông</Link>
                <Link href="/gong-kinh?loai=chu-nhat" className={styles.megaLink}>Gọng Kính Chữ Nhật</Link>
                <Link href="/gong-kinh?loai=da-giac" className={styles.megaLink}>Gọng Kính Đa Giác</Link>
                <Link href="/gong-kinh?loai=mat-meo" className={styles.megaLink}>Gọng Kính Mắt Mèo</Link>
              </div>
              <div className={styles.megaCol}>
                <p className={styles.megaColTitle}>Bộ sưu tập</p>
                <Link href="/gong-kinh" className={styles.megaLink}>Classic Collection</Link>
                <Link href="/gong-kinh" className={styles.megaLink}>Minimalist</Link>
                <Link href="/gong-kinh" className={styles.megaLink}>Bold & Statement</Link>
              </div>
              {/* Ảnh minh họa bên phải */}
              <div className={styles.megaImages}>
                <img src="/assets/product1.png" alt="Gọng kính" className={styles.megaImg} />
                <img src="/assets/product2.png" alt="Gọng kính" className={styles.megaImg} />
              </div>
            </div>
          </div>

          {/* TRÒNG KÍNH — Mega Menu */}
          <div className={styles.navItem}>
            <Link href="/trong-kinh" className={styles.navLink}>
              Tròng kính <ChevronDown size={13} />
            </Link>
            <div className={`${styles.megaMenu} ${isScrolled ? styles.megaMenuScrolled : ''}`}>
              <div className={styles.megaCol}>
                <p className={styles.megaColTitle}>Loại tròng</p>
                <Link href="/trong-kinh" className={styles.megaLink}>Tròng kính cận</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Tròng kính viễn</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Tròng kính loạn</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Tròng kính đa tròng</Link>
              </div>
              <div className={styles.megaCol}>
                <p className={styles.megaColTitle}>Tính năng</p>
                <Link href="/trong-kinh" className={styles.megaLink}>Chống ánh sáng xanh</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Chống tia UV</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Tròng đổi màu</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Chống trầy cao cấp</Link>
              </div>
              <div className={styles.megaCol}>
                <p className={styles.megaColTitle}>Thương hiệu</p>
                <Link href="/trong-kinh" className={styles.megaLink}>Essilor</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Zeiss</Link>
                <Link href="/trong-kinh" className={styles.megaLink}>Hoya</Link>
              </div>
              <div className={styles.megaImages}>
                <img src="/assets/product1.png" alt="Tròng kính" className={styles.megaImg} />
                <img src="/assets/product2.png" alt="Tròng kính" className={styles.megaImg} />
              </div>
            </div>
          </div>

          {/* KÍNH RÂM */}
          <div className={styles.navItem}>
            <Link href="/kinh-ram" className={styles.navLink}>Kính râm</Link>
          </div>

          {/* CỬA HÀNG */}
          <div className={styles.navItem}>
            <Link href="/cua-hang" className={styles.navLink}>Cửa hàng</Link>
          </div>

          {/* XEM THÊM — simple dropdown */}
          <div className={styles.navItem} style={{ position: 'relative' }}>
            <span className={styles.navLink}>
              Xem thêm <ChevronDown size={13} />
            </span>
            <div className={styles.dropdown}>
              <Link href="/products" className={styles.dropdownLink}>Tất cả sản phẩm</Link>
              <Link href="/cua-hang" className={styles.dropdownLink}>Hệ thống cửa hàng</Link>
              <Link href="/" className={styles.dropdownLink}>Đánh giá khách hàng</Link>
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className={styles.actions}>
          {/* User dropdown */}
          <div className={styles.navItem} style={{ height: '75px', position: 'relative' }}>
            <button className={styles.iconBtn} aria-label="Tài khoản"><User size={20} strokeWidth={1.8} /></button>
            <div className={styles.dropdown} style={{ right: 0, left: 'auto', minWidth: '180px' }}>
              {user ? (
                <>
                  <div style={{ padding: '10px 15px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
                    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2px' }}>Xin chào,</p>
                    <p style={{ fontWeight: 700, color: '#333' }}>{user.name}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin" className={styles.dropdownLink}>⚙️ Quản trị Admin</Link>
                  )}
                  <Link href="/profile" className={styles.dropdownLink}>👤 Tài khoản của tôi</Link>
                  <Link href="/don-hang" className={styles.dropdownLink}>📦 Đơn hàng của tôi</Link>
                  <button 
                    onClick={() => {
                      fetch('/api/auth/me', { method: 'DELETE' }).then(() => window.location.reload());
                    }} 
                    className={styles.dropdownLink} 
                    style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: 'red' }}
                  >
                    🚪 Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/dang-nhap" className={styles.dropdownLink}>🔑 Đăng nhập</Link>
                  <Link href="/dang-ky" className={styles.dropdownLink}>📝 Đăng ký</Link>
                </>
              )}
            </div>
          </div>
          <button className={styles.iconBtn} aria-label="Tìm kiếm" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={20} strokeWidth={1.8} />
          </button>
          <Link href="/cart" className={styles.iconBtn} aria-label="Giỏ hàng" style={{ position: 'relative' }}>
            <ShoppingBag size={20} strokeWidth={1.8} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -8, backgroundColor: 'red', color: 'white', 
                fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px'
              }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button className={styles.menuBtn} aria-label="Menu" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Thanh Tìm kiếm (Search Bar Dropdown) */}
      {isSearchOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'white', padding: '15px 20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', zIndex: 99 }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '8px 15px', maxWidth: '800px', margin: '0 auto' }}>
            <Search size={18} color="#888" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, gọng kính..." 
              autoFocus
              style={{ border: 'none', background: 'transparent', padding: '8px 10px', width: '100%', outline: 'none', fontSize: '1rem' }} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  window.location.href = `/products`; // Tạm thời chuyển về trang sản phẩm
                }
              }}
            />
            <button onClick={() => setIsSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.2rem' }}>✕</button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', backgroundColor: 'white', zIndex: 9999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #eee' }}>
            <Image src="/assets/logo.png" alt="Logo" width={45} height={45} />
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '5px' }}>✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', padding: '25px', gap: '25px', fontSize: '1.15rem', fontWeight: 600, color: '#333' }}>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Trang chủ</Link>
            <Link href="/gong-kinh" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Gọng kính</Link>
            <Link href="/trong-kinh" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Tròng kính</Link>
            <Link href="/kinh-ram" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Kính râm</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Tất cả sản phẩm</Link>
            <div style={{ height: '1px', backgroundColor: '#eee', margin: '5px 0' }} />
            <Link href="/cua-hang" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Hệ thống cửa hàng</Link>
            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'inherit' }}>Tài khoản của tôi</Link>
          </div>
        </div>
      )}
    </header>
  );
}
