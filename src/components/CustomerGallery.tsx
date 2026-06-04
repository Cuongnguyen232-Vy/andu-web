'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './CustomerGallery.module.css';

const galleryImages = [
  '/assets/gallery1.png',
  '/assets/gallery2.png',
  '/assets/gallery3.png',
  '/assets/gallery1.png',
  '/assets/gallery2.png',
  '/assets/gallery3.png',
];

export default function CustomerGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setSlidesToShow(1);
      } else if (w < 768) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, galleryImages.length - slidesToShow);

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === maxIndex ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
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
    <section className={styles.gallerySection}>
      <h2 className={styles.title}>HÌNH ẢNH KHÁCH HÀNG</h2>
      
      <div 
        className={styles.carouselContainer}
        style={{ '--slides-to-show': slidesToShow } as React.CSSProperties}
      >
        <button className={`${styles.navButton} ${styles.prevButton}`} onClick={prevSlide}>
          &lsaquo;
        </button>

        <div 
          className={styles.sliderWindow}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className={styles.sliderTrack} 
            style={{ transform: `translateX(calc(-${currentIndex} * (100% + var(--gap)) / var(--slides-to-show)))` }}
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
