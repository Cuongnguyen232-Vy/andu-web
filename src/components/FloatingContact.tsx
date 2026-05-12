'use client';
import styles from './FloatingContact.module.css';

export default function FloatingContact() {
  return (
    <div className={styles.floatingContainer}>
      {/* Nút Gọi Điện (Màu xanh lá) */}
      <a href="tel:0909090909" className={`${styles.button} ${styles.phone}`} title="Gọi ngay">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>

      {/* Nút Zalo (Màu xanh Zalo) */}
      <a href="https://zalo.me/0909090909" target="_blank" rel="noreferrer" className={`${styles.button} ${styles.zalo}`} title="Chat Zalo">
        <span style={{color: 'white', fontWeight: 800, fontSize: '15px', letterSpacing: '0.5px'}}>Zalo</span>
      </a>

      {/* Nút Messenger (Màu xanh Messenger) */}
      <a href="https://m.me/yourpage" target="_blank" rel="noreferrer" className={`${styles.button} ${styles.messenger}`} title="Chat Messenger">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.13 2 11.25C2 14.13 3.42 16.69 5.63 18.25V22L9.13 19.94C10.04 20.25 11 20.44 12 20.44C17.52 20.44 22 16.31 22 11.25C22 6.13 17.52 2 12 2ZM13.31 14.69L10.56 11.69L5.31 14.69L11 8.62L13.75 11.62L18.94 8.62L13.31 14.69Z"/>
        </svg>
      </a>

      {/* Nút Hệ thống cửa hàng (Màu cam) */}
      <a href="#store" className={`${styles.button} ${styles.store}`} title="Hệ thống Cửa hàng">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </a>
    </div>
  );
}
