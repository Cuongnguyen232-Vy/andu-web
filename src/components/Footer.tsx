'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const [shopSettings, setShopSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setShopSettings(data))
      .catch(err => console.log('Lỗi tải cấu hình Footer:', err));
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <Image src="/assets/logo.png" alt="Andu Logo" width={90} height={90} className={styles.footerLogo} />
          <p className={styles.footerDesc}>
            {shopSettings?.footerDesc || 'Nâng tầm phong cách, bảo vệ tầm nhìn của bạn mỗi ngày với công nghệ và thiết kế độc quyền.'}
          </p>
        </div>
        
        <div className={styles.footerLinks}>
          <div className={styles.footerCol}>
            <h4>Thông Tin Liên Hệ</h4>
            <p><span>📍</span> {shopSettings?.address || '36 Chùa Láng, Hà Nội, Việt Nam'}</p>
            <p><span>📞</span> {shopSettings?.phone || '081 227 4744'}</p>
            <p><span>✉️</span> {shopSettings?.email || 'cskh@kinhmatandu.com'}</p>
            <p><span>💬</span> {shopSettings?.shopName || 'Kính Mắt AnDu'} - 36 Chùa Láng</p>
            <p><span>🔗</span> kinhmatandu.com</p>
          </div>
          
          <div className={styles.footerCol}>
            <h4>Chính Sách</h4>
            <ul>
              <li><Link href="/chinh-sach-thanh-toan">Chính sách thanh toán</Link></li>
              <li><Link href="/chinh-sach-bao-hanh">Chính sách bảo hành, đổi trả</Link></li>
              <li><Link href="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>Hỗ Trợ</h4>
            <ul>
              <li><Link href="/gop-y">Góp ý & Phản hồi</Link></li>
              <li><Link href="/products">Cửa hàng</Link></li>
              <li><Link href="/don-hang">Tra cứu đơn hàng</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Andu Eyewear. All rights reserved.</p>
      </div>
    </footer>
  );
}
