'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './Marquee.module.css';

const announcements = [
  "SALE\n50%\nTẤT CẢ\nGỌNG KÍNH",
  "MIỄN PHÍ\nGIAO HÀNG\nTOÀN QUỐC",
  "TẶNG\nHỘP KÍNH\nCAO CẤP"
];

export default function Marquee() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % announcements.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);

  return (
    <>
      {/* Cột Trái */}
      <div className={`${styles.verticalBar} ${styles.leftBar}`}>
        <button onClick={prevSlide} className={styles.navButton}>
          <ChevronUp size={16} />
        </button>
        <div className={styles.textContainer}>
          <span key={currentIndex} className={styles.announcementTextLeft}>
            {announcements[currentIndex]}
          </span>
        </div>
        <button onClick={nextSlide} className={styles.navButton}>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Cột Phải */}
      <div className={`${styles.verticalBar} ${styles.rightBar}`}>
        <button onClick={prevSlide} className={styles.navButton}>
          <ChevronUp size={16} />
        </button>
        <div className={styles.textContainer}>
          <span key={currentIndex} className={styles.announcementTextRight}>
            {announcements[currentIndex]}
          </span>
        </div>
        <button onClick={nextSlide} className={styles.navButton}>
          <ChevronDown size={16} />
        </button>
      </div>
    </>
  );
}
