'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';
import styles from './NewProducts.module.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.15, duration: 0.6, ease: "easeOut" as const }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function NewProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Gọng kính');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Lọc theo tab hiện tại và lấy 4 sản phẩm mới nhất
          const filtered = data.filter((p: any) => p.category === activeTab).slice(0, 4);
          setProducts(filtered);
        }
      });
  }, [activeTab]);

  return (
    <section className={styles.newProductsSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          custom={0}
        >
          <h2 className={styles.title}>SẢN PHẨM MỚI</h2>
          <div className={styles.tabList}>
            {['Gọng kính', 'Tròng kính', 'Kính râm'].map(tab => (
              <span 
                key={tab} 
                className={`${styles.tabItem} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </span>
            ))}
            <Link href="/products" className={styles.viewAll}>Xem tất cả <span>&rarr;</span></Link>
          </div>
        </motion.div>

        <motion.div 
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '40px 0' }}>Chưa có sản phẩm nào.</div>
          ) : (
            products.map((item, index) => (
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
          <Link href="/products" className={styles.btnOutline}>XEM TOÀN BỘ SẢN PHẨM</Link>
        </motion.div>
      </div>
    </section>
  );
}
