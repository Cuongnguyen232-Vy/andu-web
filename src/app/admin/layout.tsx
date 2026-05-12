'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Star, Users, Settings, LogOut, Menu, X, Mail } from 'lucide-react';
import { useState } from 'react';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Tổng quan', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={18} /> },
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
    { name: 'Đánh giá', path: '/admin/reviews', icon: <Star size={18} /> },
    { name: 'Khách hàng', path: '/admin/customers', icon: <Users size={18} /> },
    { name: 'Email ĐK', path: '/admin/subscriptions', icon: <Mail size={18} /> },
    { name: 'Cài đặt', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname?.startsWith(path);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className={styles.adminContainer}>
      {/* Nền xám mờ trên mobile khi mở menu */}
      {isMobileMenuOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo} style={{ justifyContent: 'space-between' }}>
          <Image src="/assets/logo.png" alt="Andu Logo" width={60} height={60} style={{ objectFit: 'cover', borderRadius: '50%' }} />
          <button className={styles.closeMenuBtn} onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} color="#fff" />
          </button>
        </div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.background = 'rgba(248,113,113,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} color="#333" />
          </button>
          
          <div className={styles.userProfile}>
            <span style={{ color: '#8b8fa3' }}>Admin</span>
            <div className={styles.avatar}>A</div>
          </div>
        </header>
        <div className={styles.pageContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
