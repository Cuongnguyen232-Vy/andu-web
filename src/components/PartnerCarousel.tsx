'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './PartnerCarousel.module.css';

const certificates = [
  '/assets/cert1.png',
  '/assets/cert2.png',
  '/assets/cert3.png',
  '/assets/cert4.png',
  '/assets/cert1.png',
  '/assets/cert2.png',
  '/assets/cert3.png',
];

export default function PartnerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setSlidesToShow(1);
      } else if (w < 768) {
        setSlidesToShow(2);
      } else if (w < 1024) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, certificates.length - slidesToShow);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Tự động chuyển slide sau mỗi 3 giây
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div 
      className={styles.partnerCarouselWrapper} 
      style={{ '--slides-to-show': slidesToShow } as React.CSSProperties}
    >
      <button className={styles.carouselBtn} onClick={prevSlide}>&lsaquo;</button>
      
      <div 
        className={styles.carouselViewport}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className={styles.carouselTrack} 
          style={{ transform: `translateX(calc(-${currentIndex} * (100% + var(--gap)) / var(--slides-to-show)))` }}
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
