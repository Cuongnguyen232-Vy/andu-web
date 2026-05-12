'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './CustomerGallery.module.css';

const galleryImages = [
  '/assets/gallery1.png',
  '/assets/gallery2.png',
  '/assets/gallery3.png',
  '/assets/gallery1.png', // Loop images for carousel effect
  '/assets/gallery2.png',
  '/assets/gallery3.png',
];

export default function CustomerGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // We display 3 images at a time (on desktop), so maxIndex is length - 3
  const maxIndex = galleryImages.length - 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1));
    }, 4000); // Tự động trượt mỗi 4s
    return () => clearInterval(timer);
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1));
  };

  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.title}>HÌNH ẢNH KHÁCH HÀNG</h2>
      
      <div className={styles.carouselContainer}>
        <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prevSlide}>
          &lsaquo;
        </button>

        <div className={styles.sliderWindow}>
          <div 
            className={styles.sliderTrack} 
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {galleryImages.map((src, idx) => (
              <div key={idx} className={styles.slide}>
                <div className={styles.imageWrapper}>
                  <Image 
                    src={src} 
                    alt={`Khách hàng Andu ${idx + 1}`} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className={`${styles.navButton} ${styles.nextButton}`} onClick={nextSlide}>
          &rsaquo;
        </button>
      </div>
    </section>
  );
}
