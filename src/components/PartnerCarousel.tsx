'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './PartnerCarousel.module.css';

const certificates = [
  '/assets/cert1.png',
  '/assets/cert2.png',
  '/assets/cert3.png',
  '/assets/cert4.png',
  '/assets/cert1.png', // Lặp lại để slide mượt mà
  '/assets/cert2.png',
  '/assets/cert3.png',
];

export default function PartnerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển slide sau mỗi 3 giây
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    // Tính toán số lượng hiển thị dựa vào window width nếu muốn responsive chính xác
    // Ở đây mặc định hiển thị 4 cái, nên max index = tổng - 4
    setCurrentIndex((prev) => (prev >= certificates.length - 4 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? certificates.length - 4 : prev - 1));
  };

  return (
    <div className={styles.partnerCarouselWrapper}>
      <button className={styles.carouselBtn} onClick={prevSlide}>&lsaquo;</button>
      
      <div className={styles.carouselViewport}>
        <div 
          className={styles.carouselTrack} 
          style={{ transform: `translateX(calc(-${currentIndex} * (25% + 5px)))` }}
        >
          {certificates.map((src, i) => (
            <div key={i} className={styles.certCard}>
              <Image 
                src={src} 
                alt={`Certificate ${i+1}`} 
                fill 
                style={{ objectFit: 'contain', padding: '15px' }} 
              />
            </div>
          ))}
        </div>
      </div>

      <button className={styles.carouselBtn} onClick={nextSlide}>&rsaquo;</button>
    </div>
  );
}
