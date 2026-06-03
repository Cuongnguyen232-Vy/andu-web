'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập gửi feedback (có thể kết nối API sau)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSent(true);
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px', border: '1.5px solid #e0e0e0',
    borderRadius: '8px', fontSize: '0.95rem', color: '#333', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box', backgroundColor: '#fff'
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '140px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
        
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          {' / '}
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Góp ý</span>
        </p>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#135c41', marginBottom: '10px', textAlign: 'center' }}>
            Góp Ý & Phản Hồi
          </h1>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.92rem', marginBottom: '30px' }}>
            Andu luôn lắng nghe để tốt hơn mỗi ngày. Hãy để lại góp ý để chúng tôi cải thiện sản phẩm và dịch vụ.
          </p>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💚</div>
              <h2 style={{ color: '#135c41', fontWeight: 700, marginBottom: '10px' }}>Cảm ơn bạn!</h2>
              <p style={{ color: '#666' }}>Góp ý của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại nếu cần.</p>
              <button onClick={() => { setSent(false); setFormData({ name: '', phone: '', email: '', content: '' }); }} style={{ marginTop: '20px', padding: '10px 25px', backgroundColor: '#135c41', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Gửi góp ý khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nhập họ tên" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>Số điện thoại</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="VD: 0912345678" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>Nội dung góp ý <span style={{ color: 'red' }}>*</span></label>
                <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={5} placeholder="Chia sẻ trải nghiệm, đề xuất cải thiện..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '14px', backgroundColor: loading ? '#999' : '#135c41', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {loading ? 'Đang gửi...' : 'Gửi góp ý'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
