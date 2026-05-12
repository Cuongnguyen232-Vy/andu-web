'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import PartnerCarousel from '@/components/PartnerCarousel';
import Testimonial from '@/components/Testimonial';
import CustomerGallery from '@/components/CustomerGallery';
import SubscriptionForm from '@/components/SubscriptionForm';
import NewProducts from '@/components/NewProducts';
import FloatingContact from '@/components/FloatingContact';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.8, ease: "easeOut" as const }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [bestSellerTab, setBestSellerTab] = useState('Gọng kính');
  const [shopSettings, setShopSettings] = useState<any>(null);

  useEffect(() => {
    // Tải cấu hình CMS
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setShopSettings(data))
      .catch(err => console.log(err));
      
    // Tải sản phẩm
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Lấy 4 sản phẩm theo tab hiện tại làm Best Seller (tạm thời lấy ngẫu nhiên/mới nhất)
          const filtered = data.filter((p: any) => p.category === bestSellerTab).slice(0, 4);
          setBestSellers(filtered);
        }
      });
  }, [bestSellerTab]);

  return (
    <main className={styles.main}>
      <Header />

      {/* Hero Section */}
      <section className={styles.hero}>
        <a 
          href="https://www.facebook.com/kinhmatandu?locale=vi_VN" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ width: '100%', display: 'block' }}
        >
          <Image 
            src={shopSettings?.bannerImage || "/assets/anh1.png"} 
            alt="Andu Hero Banner" 
            width={1920}
            height={1080}
            className={styles.heroBanner}
            priority
          />
        </a>
      </section>

      {/* Marquee Banner */}
      <Marquee />

      {/* Category Section */}
      <section className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <h2>DANH MỤC SẢN PHẨM</h2>
          <div className={styles.underline}></div>
        </div>
        <div className={styles.categoryGrid}>
          <div className={styles.categoryCard}>
            <Image src={shopSettings?.cat1Image || "/assets/category1.png"} alt="Gọng Kính Cận" fill style={{ objectFit: 'cover' }} />
            <div className={styles.categoryOverlay}>
              <h3>GỌNG KÍNH CẬN</h3>
              <Link href="/products?category=Gọng%20kính" className={styles.btnOutline}>XEM THÊM</Link>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <Image src={shopSettings?.cat2Image || "/assets/category2.png"} alt="Kính Râm Cơ Bản" fill style={{ objectFit: 'cover' }} />
            <div className={styles.categoryOverlay}>
              <h3>KÍNH RÂM CƠ BẢN</h3>
              <Link href="/products?category=Kính%20râm" className={styles.btnOutline}>XEM THÊM</Link>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <Image src={shopSettings?.cat3Image || "/assets/category3.png"} alt="Tròng Kính" fill style={{ objectFit: 'cover' }} />
            <div className={styles.categoryOverlay}>
              <h3>TRÒNG KÍNH</h3>
              <Link href="/products?category=Tròng%20kính" className={styles.btnOutline}>XEM THÊM</Link>
            </div>
          </div>
          <div className={styles.categoryCard}>
            <Image src={shopSettings?.cat4Image || "/assets/category4.png"} alt="Phụ Kiện" fill style={{ objectFit: 'cover' }} />
            <div className={styles.categoryOverlay}>
              <h3>PHỤ KIỆN</h3>
              <Link href="/products?category=Phụ%20kiện" className={styles.btnOutline}>XEM THÊM</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Seller Section */}
      <section id="collection" className={styles.collection}>
        <div className={styles.collectionContainer}>
          <motion.div 
            className={styles.sectionHeader}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            custom={0}
          >
            <h2>BEST SELLER</h2>
            <div className={styles.tabList}>
              {['Gọng kính', 'Tròng kính', 'Kính râm'].map(tab => (
                <span 
                  key={tab} 
                  className={`${styles.tabItem} ${bestSellerTab === tab ? styles.active : ''}`}
                  onClick={() => setBestSellerTab(tab)}
                >
                  {tab}
                </span>
              ))}
              <Link href="/products" className={styles.viewAll}>Xem tất cả <span>&rarr;</span></Link>
            </div>
          </motion.div>

          <motion.div 
            className={styles.productGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {bestSellers.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '40px 0' }}>Chưa có sản phẩm Best Seller nào.</div>
            ) : (
              bestSellers.map((item, index) => (
                <motion.div key={item.id} variants={fadeUpVariant} custom={index + 1} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <ProductCard product={item} />
                </motion.div>
              ))
            )}
          </motion.div>

          <motion.div 
            className={styles.btnWrapper}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            custom={5}
          >
            <Link href="/products" className={styles.btnOutline}>Xem toàn bộ sản phẩm</Link>
          </motion.div>
        </div>
      </section>

      {/* Story / About Section */}
      <section className={styles.storySection}>
        <div className={styles.storyContent}>
          <p>
            {shopSettings?.storyText || 'Cùng Andu Eyewear khám phá những xu hướng kính mắt thời thượng nhất. Sự kết hợp hoàn hảo giữa chế tác tinh xảo và thiết kế độc bản, mang đến trải nghiệm khác biệt để tôn vinh mọi đường nét trên khuôn mặt bạn.'}
          </p>
          <button className={styles.btnExpand}>BẮT ĐẦU</button>
        </div>
      </section>

      {/* New Products Section */}
      <NewProducts />

      {/* Partner Section */}
      <section className={styles.partnerSection}>
        <div className={styles.partnerHeader}>
          <h2>TỰ HÀO LÀ ĐỐI TÁC CHIẾN LƯỢC<br/>CỦA CÁC THƯƠNG HIỆU LỚN TRÊN THẾ GIỚI</h2>
          <p>Cửa hàng kính mắt Andu luôn tự hào vì là đối tác của các thương hiệu nổi tiếng trên thế giới</p>
        </div>
        <PartnerCarousel />
      </section>

      {/* Testimonial Section */}
      <Testimonial />

      {/* Customer Gallery Section */}
      <CustomerGallery />

      {/* Subscription Form Section */}
      <SubscriptionForm />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Image src="/assets/logo.png" alt="Andu Logo" width={90} height={90} className={styles.footerLogo} />
            <p className={styles.footerDesc}>{shopSettings?.footerDesc || 'Nâng tầm phong cách, bảo vệ tầm nhìn của bạn mỗi ngày với công nghệ và thiết kế độc quyền.'}</p>
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
              <h4>Hỗ Trợ</h4>
              <ul>
                <li><a href="#">Chính sách đổi trả</a></li>
                <li><a href="#">Hướng dẫn chọn size</a></li>
                <li><a href="#">Kiểm tra thị lực</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2026 Andu Eyewear. All rights reserved.</p>
        </div>
      </footer>
      {/* Floating Contact Buttons */}
      <FloatingContact />
    </main>
  );
}
