'use client';
import { useState } from 'react';
import styles from './SubscriptionForm.module.css';

export default function SubscriptionForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Đăng ký thành công! Voucher 50.000Đ sẽ được gửi vào email của bạn ngay lập tức.');
        setFormData({ name: '', email: '', phone: '' });
      } else {
        alert(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      alert('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.subscriptionSection}>
      {/* Khối nền mờ chứa Form */}
      <div className={styles.overlay}>
        <div className={styles.formCard}>
          <h2 className={styles.title}>ĐĂNG KÝ NGAY, NHẬN CHIẾT KHẤU 50.000Đ</h2>
          <p className={styles.subtitle}>
            Đăng ký ngay bằng địa chỉ email để nhận thông tin ưu đãi lớn nhất từ Andu, đồng thời nhận ngay một voucher chiết khấu trực tiếp 50.000Đ vào hoá đơn tiếp theo!
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" placeholder="Họ và tên" className={styles.input} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" className={styles.input} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="tel" placeholder="Số điện thoại" className={styles.input} required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Đang gửi...' : 'Đăng ký'}</button>
          </form>
        </div>
      </div>

      {/* Dải cam mạng xã hội */}
      <div className={styles.socialStripe}>
        <span className={styles.socialText}>Follow chúng mình để cập nhật mẫu kính mới nhất nha</span>
        <div className={styles.socialIcons}>
          {/* Thay bằng icon thật hoặc SVG tuỳ ý, ở đây dùng text/emoji tạm */}
          <div className={styles.iconWrapper} title="Facebook">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
          </div>
          <div className={styles.iconWrapper} title="Instagram">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
          </div>
          <div className={styles.iconWrapper} title="TikTok">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.71a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
