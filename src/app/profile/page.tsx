'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Mail, Save, ChevronLeft, ShoppingBag } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  address: string | null;
}

interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward { code: number; name: string; }

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', addressDetail: '' });

  // Địa chỉ cascading
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState({ code: '', name: '' });
  const [selectedDistrict, setSelectedDistrict] = useState({ code: '', name: '' });
  const [selectedWard, setSelectedWard] = useState({ code: '', name: '' });
  const [locating, setLocating] = useState(false);

  // Định vị GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`);
          const data = await response.json();
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, addressDetail: data.display_name }));
          }
        } catch {
          alert('Không thể lấy địa chỉ từ vị trí của bạn.');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Bạn đã từ chối quyền truy cập vị trí.');
        } else {
          alert('Không thể lấy vị trí. Vui lòng nhập thủ công.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fetch user
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setFormData({
            name: data.user.name || '',
            phone: data.user.phone || '',
            addressDetail: '',
          });
          // Nếu đã có address cũ, hiển thị trong ô chi tiết
          if (data.user.address) {
            setFormData(prev => ({ ...prev, addressDetail: data.user.address }));
          }
        } else {
          router.push('/dang-nhap');
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); router.push('/dang-nhap'); });
  }, [router]);

  // Fetch tỉnh
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(() => {});
  }, []);

  // Fetch quận khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince.code) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setDistricts(data.districts || []);
          setWards([]);
          setSelectedDistrict({ code: '', name: '' });
          setSelectedWard({ code: '', name: '' });
        })
        .catch(() => {});
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince.code]);

  // Fetch phường khi chọn quận
  useEffect(() => {
    if (selectedDistrict.code) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setWards(data.wards || []);
          setSelectedWard({ code: '', name: '' });
        })
        .catch(() => {});
    } else {
      setWards([]);
    }
  }, [selectedDistrict.code]);

  // Tổng hợp địa chỉ đầy đủ
  const fullAddress = [formData.addressDetail, selectedWard.name, selectedDistrict.name, selectedProvince.name].filter(Boolean).join(', ');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      alert('Vui lòng nhập số điện thoại.');
      return;
    }
    // Kiểm tra đã chọn tỉnh/quận/phường chưa (nếu đang chọn mới)
    const addressToSave = (selectedProvince.code && selectedDistrict.code && selectedWard.code)
      ? fullAddress
      : formData.addressDetail; // Giữ nguyên nếu không chọn dropdown mới

    if (!addressToSave) {
      alert('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: addressToSave,
        })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setFormData(prev => ({ ...prev, addressDetail: data.user.address || '' }));
        // Reset dropdown sau khi lưu
        setSelectedProvince({ code: '', name: '' });
        setSelectedDistrict({ code: '', name: '' });
        setSelectedWard({ code: '', name: '' });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert('Lỗi cập nhật. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const profileComplete = user?.phone && user?.address;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#333',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    backgroundColor: '#fff'
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 36px 12px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#333',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    cursor: 'pointer',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    color: '#333',
    fontSize: '0.9rem'
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <p style={{ color: '#888' }}>Đang tải...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', paddingBottom: '80px' }}>
      <Header />
      <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '130px', paddingLeft: '20px', paddingRight: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#888', textDecoration: 'none' }}>
            <ChevronLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#222', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
            Tài khoản của tôi
          </h1>
        </div>

        {/* Thông báo */}
        {!profileComplete && (
          <div style={{ padding: '16px 20px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '1.3rem' }}>⚠️</span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#856404', fontSize: '0.95rem' }}>Hồ sơ chưa hoàn thiện</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#856404' }}>
                Vui lòng cập nhật <strong>số điện thoại</strong> và <strong>địa chỉ giao hàng</strong> để đặt hàng nhanh hơn.
              </p>
            </div>
          </div>
        )}
        {profileComplete && (
          <div style={{ padding: '16px 20px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.3rem' }}>✅</span>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#155724', fontSize: '0.95rem' }}>Hồ sơ đã hoàn thiện</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#155724' }}>Bạn có thể đặt hàng nhanh mà không cần nhập lại thông tin.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '35px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700 }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#222' }}>{user.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#888' }}>{user.email}</p>
              <span style={{ display: 'inline-block', marginTop: '4px', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: user.role === 'admin' ? '#d4edda' : '#e2e3e5', color: user.role === 'admin' ? '#155724' : '#383d41' }}>
                {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tên */}
            <div>
              <label style={labelStyle}>Họ và tên</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
              </div>
            </div>

            {/* Email (readonly) */}
            <div>
              <label style={labelStyle}>Email <span style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 400 }}>(không thể thay đổi)</span></label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input value={user.email} readOnly style={{ ...inputStyle, backgroundColor: '#f9f9f9', color: '#999', cursor: 'not-allowed' }} />
              </div>
            </div>

            {/* SĐT */}
            <div>
              <label style={labelStyle}>
                Số điện thoại <span style={{ color: 'red' }}>*</span>
                {!user.phone && <span style={{ fontSize: '0.8rem', color: '#dc3545', fontWeight: 500, marginLeft: '8px' }}>Chưa cập nhật</span>}
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="VD: 0912345678" maxLength={11} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = '#e0e0e0'} />
              </div>
            </div>

            {/* Địa chỉ hiện tại */}
            {user.address && (
              <div style={{ padding: '14px 18px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.82rem', color: '#888', display: 'block', marginBottom: '4px' }}>Địa chỉ hiện tại</span>
                <p style={{ margin: 0, fontWeight: 500, color: '#333', fontSize: '0.92rem', lineHeight: 1.5 }}>{user.address}</p>
              </div>
            )}

            {/* Cập nhật địa chỉ mới */}
            <div>
              <label style={labelStyle}>
                {user.address ? 'Thay đổi địa chỉ' : 'Địa chỉ giao hàng'} <span style={{ color: 'red' }}>*</span>
                {!user.address && <span style={{ fontSize: '0.8rem', color: '#dc3545', fontWeight: 500, marginLeft: '8px' }}>Chưa cập nhật</span>}
              </label>

              {/* Tỉnh / Quận / Phường */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <select
                  value={selectedProvince.code}
                  onChange={e => {
                    const p = provinces.find(p => String(p.code) === e.target.value);
                    setSelectedProvince({ code: e.target.value, name: p?.name || '' });
                  }}
                  style={selectStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                >
                  <option value="">-- Tỉnh/TP --</option>
                  {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>

                <select
                  value={selectedDistrict.code}
                  onChange={e => {
                    const d = districts.find(d => String(d.code) === e.target.value);
                    setSelectedDistrict({ code: e.target.value, name: d?.name || '' });
                  }}
                  disabled={!selectedProvince.code}
                  style={{ ...selectStyle, opacity: selectedProvince.code ? 1 : 0.5 }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                >
                  <option value="">-- Quận/Huyện --</option>
                  {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                </select>

                <select
                  value={selectedWard.code}
                  onChange={e => {
                    const w = wards.find(w => String(w.code) === e.target.value);
                    setSelectedWard({ code: e.target.value, name: w?.name || '' });
                  }}
                  disabled={!selectedDistrict.code}
                  style={{ ...selectStyle, opacity: selectedDistrict.code ? 1 : 0.5 }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                >
                  <option value="">-- Phường/Xã --</option>
                  {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                </select>
              </div>

              {/* Địa chỉ chi tiết + Nút định vị */}
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', zIndex: 1 }} />
                <input
                  value={formData.addressDetail}
                  onChange={e => setFormData({ ...formData, addressDetail: e.target.value })}
                  placeholder="Số nhà, tên đường, ngõ/ngách"
                  style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '120px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 12px',
                    backgroundColor: locating ? '#f0f0f0' : '#e8f5e9',
                    color: locating ? '#999' : 'var(--primary)',
                    border: '1px solid',
                    borderColor: locating ? '#ddd' : '#c8e6c9',
                    borderRadius: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: locating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <MapPin size={14} />
                  {locating ? 'Đang tìm...' : 'Định vị'}
                </button>
              </div>

              {/* Preview địa chỉ mới */}
              {selectedProvince.name && selectedDistrict.name && selectedWard.name && formData.addressDetail && (
                <div style={{ marginTop: '10px', padding: '10px 14px', backgroundColor: '#f0faf5', borderRadius: '6px', border: '1px solid #c3e6cb' }}>
                  <span style={{ fontSize: '0.78rem', color: '#155724', fontWeight: 600 }}>Địa chỉ sẽ lưu:</span>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#155724', lineHeight: 1.4 }}>{fullAddress}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', backgroundColor: saved ? '#28a745' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.3s' }}>
              {saved ? (
                <><Save size={18} /> Đã lưu thành công!</>
              ) : saving ? (
                'Đang lưu...'
              ) : (
                <><Save size={18} /> Lưu thông tin</>
              )}
            </button>
          </form>
        </div>

        {/* Link nhanh */}
        <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
          <Link href="/products" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '10px', textDecoration: 'none', color: '#333', fontWeight: 600, fontSize: '0.9rem' }}>
            <ShoppingBag size={18} /> Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </main>
  );
}
