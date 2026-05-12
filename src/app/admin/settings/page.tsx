'use client';

import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [shopInfo, setShopInfo] = useState({
    shopName: 'Andu Eyewear',
    phone: '0987 654 321',
    email: 'contact@andu.vn',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    zalo: '0987654321',
    facebook: 'https://facebook.com/andueyewear',
    instagram: 'https://instagram.com/andueyewear',
    promoText: '🎁 TẶNG HỘP KÍNH CAO CẤP KHI MUA GỌNG KÍNH',
    bannerImage: '/assets/banner1.jpg',
    cat1Image: '/assets/category1.png',
    cat2Image: '/assets/category2.png',
    cat3Image: '/assets/category3.png',
    cat4Image: '/assets/category4.png',
    storyText: 'Cùng Andu Eyewear khám phá những xu hướng kính mắt thời thượng nhất. Sự kết hợp hoàn hảo giữa chế tác tinh xảo và thiết kế độc bản, mang đến trải nghiệm khác biệt để tôn vinh mọi đường nét trên khuôn mặt bạn.',
    footerDesc: 'Nâng tầm phong cách, bảo vệ tầm nhìn của bạn mỗi ngày với công nghệ và thiết kế độc quyền.'
  });

  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.shopName) {
          setShopInfo(prev => ({...prev, ...data}));
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShopInfo({ ...shopInfo, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.url) {
        setShopInfo(prev => ({ ...prev, [key]: data.url }));
        setSaved(false);
      }
    } catch (err) {
      alert('Lỗi khi tải ảnh lên!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopInfo)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Lỗi khi lưu cài đặt');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#333',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    color: '#333',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#135c41', fontWeight: 700, marginBottom: '30px' }}>Cài đặt hệ thống</h1>

      {/* Cấu hình Giao diện Khách Hàng (CMS) */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '25px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🎨 Cài đặt Giao diện (CMS)
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Ảnh Banner Trang Chủ</label>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ width: '300px', height: '120px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f0f0f0', position: 'relative' }}>
                {shopInfo.bannerImage ? (
                  <img src={shopInfo.bannerImage} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>Chưa có ảnh</div>
                )}
              </div>
              <div>
                <input type="file" id="bannerUpload" accept="image/*" onChange={(e) => handleFileUpload(e, 'bannerImage')} style={{ display: 'none' }} />
                <label htmlFor="bannerUpload" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#f0f0f0', color: '#333', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, border: '1px solid #ddd' }}>
                  {isUploading ? 'Đang tải...' : '🖼️ Thay ảnh Banner'}
                </label>
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>Kích thước khuyến nghị: 1920x800px</p>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />
          
          <label style={labelStyle}>Ảnh 4 Danh Mục Sản Phẩm (Hiển thị ngay dưới Banner)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            {[
              { key: 'cat1Image', title: 'Danh mục 1 (Gọng Kính)' },
              { key: 'cat2Image', title: 'Danh mục 2 (Kính Râm)' },
              { key: 'cat3Image', title: 'Danh mục 3 (Tròng Kính)' },
              { key: 'cat4Image', title: 'Danh mục 4 (Phụ Kiện)' },
            ].map((cat, i) => (
              <div key={cat.key} style={{ display: 'flex', gap: '15px', alignItems: 'center', backgroundColor: '#fafafa', padding: '10px', borderRadius: '8px' }}>
                <div style={{ width: '80px', height: '100px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#eaeaea' }}>
                  <img src={(shopInfo as any)[cat.key]} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>{cat.title}</p>
                  <input type="file" id={`upload-${cat.key}`} accept="image/*" onChange={(e) => handleFileUpload(e, cat.key)} style={{ display: 'none' }} />
                  <label htmlFor={`upload-${cat.key}`} style={{ display: 'inline-block', padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#fff', color: '#333', borderRadius: '4px', cursor: 'pointer', border: '1px solid #ccc' }}>
                    Tải ảnh lên
                  </label>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />

          <div>
            <label style={labelStyle}>Dòng thông báo Khuyến mãi (Chạy trên cùng website)</label>
            <input name="promoText" value={shopInfo.promoText} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>

          <div>
            <label style={labelStyle}>Đoạn văn giới thiệu (Nằm giữa trang chủ)</label>
            <textarea name="storyText" rows={3} value={shopInfo.storyText} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>

          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 30px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', marginTop: '10px' }}>
            {saved ? '✓ Đã lưu thay đổi!' : 'Lưu Giao Diện'}
          </button>
        </form>
      </div>

      {/* Thông tin cửa hàng */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '25px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🏪 Thông tin cửa hàng (Hiển thị ở Footer)
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Tên cửa hàng</label>
              <input name="shopName" value={shopInfo.shopName} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Số điện thoại</label>
              <input name="phone" value={shopInfo.phone} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email liên hệ</label>
            <input name="email" type="email" value={shopInfo.email} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>

          <div>
            <label style={labelStyle}>Địa chỉ cửa hàng</label>
            <input name="address" value={shopInfo.address} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>

          <div>
            <label style={labelStyle}>Mô tả ngắn ở Footer (Dưới Logo)</label>
            <textarea name="footerDesc" rows={2} value={shopInfo.footerDesc} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Zalo</label>
              <input name="zalo" value={shopInfo.zalo} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Facebook</label>
              <input name="facebook" value={shopInfo.facebook} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Instagram</label>
              <input name="instagram" value={shopInfo.instagram} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>

          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 30px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? '✓ Đã lưu!' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>

      {/* Chính sách vận chuyển */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🚚 Chính sách vận chuyển & thanh toán
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>Miễn phí vận chuyển</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0' }}>Áp dụng cho tất cả đơn hàng</p>
            </div>
            <span style={{ padding: '4px 14px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem' }}>Đang bật</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>Thanh toán COD</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0' }}>Thanh toán khi nhận hàng</p>
            </div>
            <span style={{ padding: '4px 14px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem' }}>Đang bật</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>Chuyển khoản ngân hàng</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0' }}>Khách chuyển khoản trước khi giao</p>
            </div>
            <span style={{ padding: '4px 14px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '20px', fontWeight: 600, fontSize: '0.82rem' }}>Đang bật</span>
          </div>
        </div>
      </div>

      {/* Thông tin hệ thống */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          ℹ️ Thông tin hệ thống
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.92rem' }}>
          <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
            <span style={{ color: '#888' }}>Phiên bản: </span>
            <span style={{ fontWeight: 600, color: '#222' }}>Andu v1.0.0</span>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
            <span style={{ color: '#888' }}>Framework: </span>
            <span style={{ fontWeight: 600, color: '#222' }}>Next.js 16</span>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
            <span style={{ color: '#888' }}>Database: </span>
            <span style={{ fontWeight: 600, color: '#222' }}>SQLite (Prisma ORM)</span>
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
            <span style={{ color: '#888' }}>Ngôn ngữ: </span>
            <span style={{ fontWeight: 600, color: '#222' }}>TypeScript</span>
          </div>
        </div>
      </div>
    </div>
  );
}
