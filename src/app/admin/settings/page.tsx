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
    footerDesc: 'Nâng tầm phong cách, bảo vệ tầm nhìn của bạn mỗi ngày với công nghệ và thiết kế độc quyền.',

    // Cấu hình mới thêm
    maxCoins: 15000,
    shipNhanh: 30000,
    shipHoaToc: 50000,
    shipTietKiem: 15000,
    couponProductPctCode: 'ANDU10',
    couponProductPctVal: 10,
    couponProductFlatCode: 'ANDU50',
    couponProductFlatVal: 50000,
    couponShipCode: 'FREESHIP',
    couponShipVal: 100,
    depositPercent: 50,
    enableFreeShipOver500k: true,
    enableCOD: true,
    enableVNPay: true,
    enableBankTransfer: true,
    vnpTmnCode: 'KOGW3BGB',
    vnpHashSecret: 'UHSKWYRTEUJDZVOMJPOWIRNQMSLKJHDF',
    vnpUrlMode: 'sandbox'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setShopInfo(prev => ({ ...prev, [name]: checked }));
    } else {
      const isNumeric = [
        'maxCoins', 'depositPercent', 'shipNhanh', 'shipHoaToc', 'shipTietKiem',
        'couponProductPctVal', 'couponProductFlatVal', 'couponShipVal'
      ].includes(name);
      
      const parsedValue = isNumeric ? (parseInt(value) || 0) : value;
      setShopInfo(prev => ({ ...prev, [name]: parsedValue }));
    }
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
      } else if (data.error) {
        alert('Lỗi từ server: ' + data.error);
      }
    } catch (err: any) {
      alert('Lỗi khi tải ảnh lên: ' + err.message);
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
                <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                  <input type="file" id="bannerUpload" accept="image/*" onChange={(e) => handleFileUpload(e, 'bannerImage')} style={{ display: 'none' }} />
                  <label htmlFor="bannerUpload" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#f0f0f0', color: '#333', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, border: '1px solid #ddd' }}>
                    {isUploading ? 'Đang tải...' : '🖼️ Tải từ máy'}
                  </label>
                </div>
                <input 
                  type="text" 
                  placeholder="Hoặc dán Link ảnh (Ví dụ: https://...)" 
                  value={shopInfo.bannerImage} 
                  onChange={e => setShopInfo({...shopInfo, bannerImage: e.target.value})} 
                  style={{ width: '100%', minWidth: '250px', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}
                />
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
              <div key={cat.key} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', backgroundColor: '#fafafa', padding: '10px', borderRadius: '8px' }}>
                <div style={{ width: '80px', height: '100px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#eaeaea' }}>
                  <img src={(shopInfo as any)[cat.key]} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '0 0 8px' }}>{cat.title}</p>
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                    <input type="file" id={`upload-${cat.key}`} accept="image/*" onChange={(e) => handleFileUpload(e, cat.key)} style={{ display: 'none' }} />
                    <label htmlFor={`upload-${cat.key}`} style={{ display: 'inline-block', padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#fff', color: '#333', borderRadius: '4px', cursor: 'pointer', border: '1px solid #ccc' }}>
                      Tải từ máy
                    </label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Hoặc dán Link ảnh" 
                    value={(shopInfo as any)[cat.key]} 
                    onChange={e => setShopInfo({...shopInfo, [cat.key]: e.target.value})} 
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.8rem' }}
                  />
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

      {/* Cấu hình Ví Xu & Đặt Cọc */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '25px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🪙 Cấu hình xu Shopee & Tiền cọc kính cận
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Số xu giảm tối đa mỗi đơn (1 xu = 1₫)</label>
              <input type="number" name="maxCoins" value={shopInfo.maxCoins} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Phần trăm cọc tròng kính / cắt cận (%)</label>
              <input type="number" name="depositPercent" value={shopInfo.depositPercent} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>
          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 30px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? '✓ Đã lưu!' : 'Lưu cấu hình'}
          </button>
        </form>
      </div>

      {/* Cấu hình Biểu Phí Vận Chuyển */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '25px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🚚 Cấu hình Biểu phí vận chuyển
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Giao hàng nhanh (₫)</label>
              <input type="number" name="shipNhanh" value={shopInfo.shipNhanh} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Giao hỏa tốc 2H (₫)</label>
              <input type="number" name="shipHoaToc" value={shopInfo.shipHoaToc} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Giao hàng tiết kiệm (₫)</label>
              <input type="number" name="shipTietKiem" value={shopInfo.shipTietKiem} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>
          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 30px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? '✓ Đã lưu!' : 'Lưu biểu phí'}
          </button>
        </form>
      </div>

      {/* Cấu hình Vouchers / Coupon */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '25px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🎟️ Cấu hình Mã giảm giá (Coupon Codes)
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Coupon 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
            <div>
              <label style={labelStyle}>Mã giảm giá theo % sản phẩm</label>
              <input name="couponProductPctCode" value={shopInfo.couponProductPctCode} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Giá trị giảm (%)</label>
              <input type="number" name="couponProductPctVal" value={shopInfo.couponProductPctVal} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>
          {/* Coupon 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
            <div>
              <label style={labelStyle}>Mã giảm tiền mặt cố định</label>
              <input name="couponProductFlatCode" value={shopInfo.couponProductFlatCode} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Số tiền giảm (₫)</label>
              <input type="number" name="couponProductFlatVal" value={shopInfo.couponProductFlatVal} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>
          {/* Coupon 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Mã giảm phí vận chuyển (Freeship)</label>
              <input name="couponShipCode" value={shopInfo.couponShipCode} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Giá trị giảm phí ship (%)</label>
              <input type="number" name="couponShipVal" value={shopInfo.couponShipVal} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>
          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 30px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? '✓ Đã lưu!' : 'Lưu mã giảm giá'}
          </button>
        </form>
      </div>

      {/* Trạng thái Bật/Tắt các Cổng/Chính sách */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          ⚙️ Bật/Tắt phương thức vận chuyển & thanh toán
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>Miễn phí ship trên 500k</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0' }}>Tự động miễn phí vận chuyển khi tổng đơn từ 500k trở lên</p>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input type="checkbox" name="enableFreeShipOver500k" checked={shopInfo.enableFreeShipOver500k} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: shopInfo.enableFreeShipOver500k ? 'var(--primary)' : '#ccc',
                transition: '0.4s', borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '4px', bottom: '4px',
                  backgroundColor: 'white', transition: '0.4s', borderRadius: '50%',
                  transform: shopInfo.enableFreeShipOver500k ? 'translateX(24px)' : 'none'
                }} />
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>Thanh toán COD</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0' }}>Cho phép khách hàng thanh toán bằng tiền mặt khi nhận hàng</p>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input type="checkbox" name="enableCOD" checked={shopInfo.enableCOD} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: shopInfo.enableCOD ? 'var(--primary)' : '#ccc',
                transition: '0.4s', borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '4px', bottom: '4px',
                  backgroundColor: 'white', transition: '0.4s', borderRadius: '50%',
                  transform: shopInfo.enableCOD ? 'translateX(24px)' : 'none'
                }} />
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>Thanh toán VNPay (Banking)</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0' }}>Kích hoạt quét mã QR VNPay hoặc ngân hàng qua cổng VNPAY</p>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input type="checkbox" name="enableVNPay" checked={shopInfo.enableVNPay} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: shopInfo.enableVNPay ? 'var(--primary)' : '#ccc',
                transition: '0.4s', borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '4px', bottom: '4px',
                  backgroundColor: 'white', transition: '0.4s', borderRadius: '50%',
                  transform: shopInfo.enableVNPay ? 'translateX(24px)' : 'none'
                }} />
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>Chuyển khoản thủ công qua ngân hàng (Bank Transfer)</p>
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '4px 0 0' }}>Hiển thị số tài khoản ngân hàng của shop để khách chuyển khoản thủ công</p>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
              <input type="checkbox" name="enableBankTransfer" checked={shopInfo.enableBankTransfer} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: shopInfo.enableBankTransfer ? 'var(--primary)' : '#ccc',
                transition: '0.4s', borderRadius: '34px'
              }}>
                <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '4px', bottom: '4px',
                  backgroundColor: 'white', transition: '0.4s', borderRadius: '50%',
                  transform: shopInfo.enableBankTransfer ? 'translateX(24px)' : 'none'
                }} />
              </span>
            </label>
          </div>

          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 30px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', marginTop: '10px' }}>
            {saved ? '✓ Đã lưu!' : 'Lưu cổng thanh toán'}
          </button>
        </form>
      </div>

      {/* Cấu hình Cổng Thanh Toán VNPay */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222', marginBottom: '25px', paddingBottom: '12px', borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '1px' }}>
          💳 Cấu hình Cổng VNPay
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Mã website (vnp_TmnCode)</label>
              <input name="vnpTmnCode" value={shopInfo.vnpTmnCode || ''} onChange={handleChange} style={inputStyle} placeholder="Ví dụ: KOGW3BGB" onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
            <div>
              <label style={labelStyle}>Chuỗi bảo mật (vnp_HashSecret)</label>
              <input name="vnpHashSecret" value={shopInfo.vnpHashSecret || ''} onChange={handleChange} style={inputStyle} placeholder="Ví dụ: UHSKWYRTE..." onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Môi trường kết nối VNPay</label>
            <select name="vnpUrlMode" value={shopInfo.vnpUrlMode || 'sandbox'} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}>
              <option value="sandbox">Thử nghiệm (Sandbox)</option>
              <option value="production">Môi trường thật (Production)</option>
            </select>
            <p style={{ fontSize: '0.82rem', color: '#888', marginTop: '6px' }}>
              * Chọn Sandbox khi test với thẻ test của VNPay. Chọn Production khi chạy chính thức với tài khoản doanh nghiệp thật.
            </p>
          </div>
          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 30px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
            {saved ? '✓ Đã lưu!' : 'Lưu cấu hình VNPay'}
          </button>
        </form>
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
      
      {/* Bổ sung các media queries cho màn hình mobile của trang settings */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .admin-stats-grid, div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
        }
      `}} />
    </div>
  );
}
