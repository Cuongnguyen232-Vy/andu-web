'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin } from 'lucide-react';

// Interfaces cho API Tỉnh/Huyện/Xã
interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward { code: number; name: string; }

// ===== Phí vận chuyển theo khu vực =====
const SHIPPING_ZONES: Record<string, { fee: number; label: string }> = {
  // Nội thành HN & HCM: Miễn phí
  'Thành phố Hà Nội': { fee: 0, label: 'Nội thành - Miễn phí' },
  'Thành phố Hồ Chí Minh': { fee: 0, label: 'Nội thành - Miễn phí' },
  // Các tỉnh lân cận HN
  'Tỉnh Bắc Ninh': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Hưng Yên': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Hải Dương': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Thành phố Hải Phòng': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Vĩnh Phúc': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Bắc Giang': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Hà Nam': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Nam Định': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Ninh Bình': { fee: 15000, label: 'Lân cận Hà Nội' },
  'Tỉnh Thái Bình': { fee: 15000, label: 'Lân cận Hà Nội' },
  // Các tỉnh lân cận HCM
  'Tỉnh Bình Dương': { fee: 15000, label: 'Lân cận TP.HCM' },
  'Tỉnh Đồng Nai': { fee: 15000, label: 'Lân cận TP.HCM' },
  'Tỉnh Long An': { fee: 15000, label: 'Lân cận TP.HCM' },
  'Tỉnh Bà Rịa - Vũng Tàu': { fee: 15000, label: 'Lân cận TP.HCM' },
  'Tỉnh Tây Ninh': { fee: 15000, label: 'Lân cận TP.HCM' },
};
const DEFAULT_SHIPPING = { fee: 30000, label: 'Liên tỉnh' };

function getShippingFee(provinceName: string): { fee: number; label: string } {
  if (!provinceName) return { fee: 0, label: 'Chưa chọn khu vực' };
  return SHIPPING_ZONES[provinceName] || DEFAULT_SHIPPING;
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [isBuyNow, setIsBuyNow] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('buyNow') === 'true') {
      const buyNowItem = sessionStorage.getItem('buyNowItem');
      if (buyNowItem) {
        const item = JSON.parse(buyNowItem);
        setCheckoutItems([item]);
        setCheckoutTotal(item.price * item.quantity);
        setIsBuyNow(true);
      }
    } else {
      setCheckoutItems(cart);
      setCheckoutTotal(totalPrice);
    }
  }, [cart, totalPrice]);
  
  // === Kiểm tra đăng nhập ===
  const [loggedInUser, setLoggedInUser] = useState<{
    id: string; name: string; email: string; phone: string | null; address: string | null;
  } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Danh sách địa chỉ
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    provinceCode: '',
    provinceName: '',
    districtCode: '',
    districtName: '',
    wardCode: '',
    wardName: '',
    address: '',
    notes: '',
    paymentMethod: 'cod'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locating, setLocating] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  // Lưu lại thông tin đơn hàng + sản phẩm khi đặt thành công
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    totalAmount: number;
    shippingFee: number;
    items: { name: string; quantity: number; price: number; image: string }[];
  } | null>(null);

  // User đã đăng nhập VÀ có đầy đủ SĐT + địa chỉ => checkout nhanh
  const isQuickCheckout = !!(loggedInUser?.phone && loggedInUser?.address);

  // Tính phí ship theo tỉnh đã chọn (chỉ khi guest, logged user dùng address sẵn)
  const shippingInfo = isQuickCheckout
    ? { fee: 30000, label: 'Phí cố định' } // logged-in user: phí mặc định (có thể tùy chỉnh sau)
    : getShippingFee(formData.provinceName);
  const grandTotal = checkoutTotal + shippingInfo.fee;

  // ===== Fetch user đã đăng nhập =====
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.id) {
          setLoggedInUser(data.user);
          // Auto-fill form nếu có phone + address
          if (data.user.phone && data.user.address) {
            setFormData(prev => ({
              ...prev,
              name: data.user.name || '',
              phone: data.user.phone || '',
              email: data.user.email || '',
              address: data.user.address || '',
            }));
          } else {
            // Đăng nhập nhưng chưa có profile đầy đủ -> fill name + email
            setFormData(prev => ({
              ...prev,
              name: data.user.name || '',
              email: data.user.email || '',
            }));
          }
        }
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  // ===== Fetch Tỉnh/Thành phố khi mount (chỉ cho guest) =====
  useEffect(() => {
    if (!isQuickCheckout) {
      fetch('https://provinces.open-api.vn/api/p/')
        .then(res => res.json())
        .then(data => setProvinces(data))
        .catch(err => console.error('Lỗi load tỉnh:', err));
    }
  }, [isQuickCheckout]);

  // ===== Fetch Quận/Huyện khi chọn Tỉnh =====
  useEffect(() => {
    if (formData.provinceCode) {
      fetch(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setDistricts(data.districts || []);
          setWards([]);
          setFormData(prev => ({ ...prev, districtCode: '', districtName: '', wardCode: '', wardName: '' }));
        })
        .catch(err => console.error('Lỗi load quận:', err));
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [formData.provinceCode]);

  // ===== Fetch Phường/Xã khi chọn Quận =====
  useEffect(() => {
    if (formData.districtCode) {
      fetch(`https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`)
        .then(res => res.json())
        .then(data => {
          setWards(data.wards || []);
          setFormData(prev => ({ ...prev, wardCode: '', wardName: '' }));
        })
        .catch(err => console.error('Lỗi load phường:', err));
    } else {
      setWards([]);
    }
  }, [formData.districtCode]);

  // ===== Handlers =====
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'provinceCode') {
      const province = provinces.find(p => String(p.code) === value);
      setFormData(prev => ({ ...prev, provinceCode: value, provinceName: province?.name || '' }));
    } else if (name === 'districtCode') {
      const district = districts.find(d => String(d.code) === value);
      setFormData(prev => ({ ...prev, districtCode: value, districtName: district?.name || '' }));
    } else if (name === 'wardCode') {
      const ward = wards.find(w => String(w.code) === value);
      setFormData(prev => ({ ...prev, wardCode: value, wardName: ward?.name || '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ===== Lấy vị trí GPS =====
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Dùng Nominatim (OpenStreetMap) để reverse geocode
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=vi`);
          const data = await response.json();
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }));
          }
        } catch (error) {
          console.error('Lỗi định vị:', error);
          alert('Không thể lấy địa chỉ từ vị trí của bạn.');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép trong cài đặt trình duyệt.');
        } else {
          alert('Không thể lấy vị trí. Vui lòng nhập thủ công.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fullAddress = isQuickCheckout
    ? (loggedInUser?.address || '')
    : [formData.address, formData.wardName, formData.districtName, formData.provinceName].filter(Boolean).join(', ');

  // ===== Validate SĐT Việt Nam =====
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s|-/g, '');
    const vnPhoneRegex = /^0[3-9]\d{8}$/;
    return vnPhoneRegex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;

    // Quick checkout: dùng thông tin từ profile
    const submitName = isQuickCheckout ? loggedInUser!.name : formData.name;
    const submitPhone = isQuickCheckout ? loggedInUser!.phone! : formData.phone;
    const submitEmail = isQuickCheckout ? loggedInUser!.email : formData.email;
    const submitAddress = fullAddress;

    // Validate SĐT (chỉ guest)
    if (!isQuickCheckout && !validatePhone(submitPhone)) {
      setPhoneError('Số điện thoại không hợp lệ. VD: 0912345678 (10 số, bắt đầu bằng 0)');
      return;
    }
    setPhoneError('');

    // Validate địa chỉ (chỉ guest)
    if (!isQuickCheckout && (!formData.provinceCode || !formData.districtCode || !formData.wardCode)) {
      alert('Vui lòng chọn đầy đủ Tỉnh/Quận/Phường.');
      return;
    }
    
    // Lưu snapshot giỏ hàng trước khi clear
    const cartSnapshot = checkoutItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: submitName,
          customerPhone: submitPhone,
          customerEmail: submitEmail,
          customerAddress: submitAddress,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod,
          totalAmount: grandTotal,
          shippingFee: shippingInfo.fee,
          items: checkoutItems
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        
        if (formData.paymentMethod === 'banking') {
          // Gọi API VNPay để lấy URL chuyển hướng
          try {
            const vnpayRes = await fetch('/api/vnpay/create-payment-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: orderData.id, amount: grandTotal })
            });
            const vnpayData = await vnpayRes.json();
            if (vnpayData.url) {
              window.location.href = vnpayData.url; // Chuyển hướng sang VNPay
              return;
            } else {
              alert('Lỗi khởi tạo cổng VNPay');
              setLoading(false);
              return;
            }
          } catch (e) {
            alert('Lỗi kết nối VNPay');
            setLoading(false);
            return;
          }
        }

        if (formData.paymentMethod === 'momo') {
          // Chuyển sang trang MoMo QR (mock-gateway tạm thời, sau này thay bằng API MoMo thật)
          router.push(`/mock-gateway?orderId=${orderData.id}&amount=${grandTotal}&method=momo`);
          return;
        }

        if (formData.paymentMethod === 'bank_transfer') {
          // Chuyển sang trang QR chuyển khoản cá nhân
          router.push(`/mock-gateway?orderId=${orderData.id}&amount=${grandTotal}&method=bank_transfer`);
          return;
        }

        setOrderResult({
          orderId: orderData.id,
          customerName: submitName,
          customerPhone: submitPhone,
          shippingAddress: submitAddress,
          paymentMethod: formData.paymentMethod,
          totalAmount: grandTotal,
          shippingFee: shippingInfo.fee,
          items: cartSnapshot
        });
        setSuccess(true);
        clearCart();
      } else {
        const errData = await response.json();
        alert('Có lỗi xảy ra: ' + (errData.error || 'Vui lòng thử lại.'));
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi kết nối, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Success Page =====
  if (success && orderResult) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', paddingBottom: '80px' }}>
        <Header />
        <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '140px', paddingLeft: '20px', paddingRight: '20px' }}>
          {/* Icon + Tiêu đề */}
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{ width: '70px', height: '70px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', fontWeight: 700 }}>✓</div>
            <h1 style={{ fontSize: '1.5rem', color: '#222', marginBottom: '8px', fontWeight: 700, letterSpacing: '1px' }}>ĐẶT HÀNG THÀNH CÔNG!</h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Cảm ơn bạn đã mua sắm tại <strong style={{ color: 'var(--primary)' }}>Andu Eyewear</strong></p>
          </div>

          {/* Thông tin đơn hàng */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
            {/* Mã đơn */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px', borderBottom: '1px solid #f0f0f0', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Mã đơn hàng</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px' }}>#{orderResult.orderId.slice(0, 8).toUpperCase()}</span>
            </div>

            {/* Thông tin khách hàng */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px', fontSize: '0.92rem' }}>
              <div>
                <span style={{ color: '#888', display: 'block', marginBottom: '4px', fontSize: '0.82rem' }}>Người nhận</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{orderResult.customerName}</span>
              </div>
              <div>
                <span style={{ color: '#888', display: 'block', marginBottom: '4px', fontSize: '0.82rem' }}>Số điện thoại</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{orderResult.customerPhone}</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ color: '#888', display: 'block', marginBottom: '4px', fontSize: '0.82rem' }}>Địa chỉ giao hàng</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{orderResult.shippingAddress}</span>
              </div>
              <div>
                <span style={{ color: '#888', display: 'block', marginBottom: '4px', fontSize: '0.82rem' }}>Thanh toán</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{orderResult.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}</span>
              </div>
            </div>

            {/* Thông tin chuyển khoản (Chỉ hiện nếu chọn Banking) */}
            {orderResult.paymentMethod === 'banking' && (
              <div style={{ backgroundColor: '#f0f4f8', border: '1px solid #dce4ec', borderRadius: '10px', padding: '20px', marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '150px', height: '150px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                  <img 
                    src={`https://img.vietqr.io/image/vcb-0123456789-compact.png?amount=${orderResult.totalAmount}&addInfo=DH${orderResult.orderId.slice(0, 8).toUpperCase()}&accountName=NGUYEN VAN A`} 
                    alt="VietQR" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#113', marginBottom: '15px', fontWeight: 700 }}>Thông tin chuyển khoản</h3>
                  <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#444' }}>Ngân hàng: <strong>Vietcombank (VCB)</strong></p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#444' }}>Số tài khoản: <strong>0123456789</strong></p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#444' }}>Chủ tài khoản: <strong>NGUYEN VAN A</strong></p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#444' }}>Số tiền: <strong style={{ color: 'var(--primary)' }}>{orderResult.totalAmount.toLocaleString('vi-VN')}₫</strong></p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#444' }}>Nội dung CK: <strong>DH{orderResult.orderId.slice(0, 8).toUpperCase()}</strong></p>
                  <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 500 }}>
                    Vui lòng quét mã QR hoặc chuyển khoản với đúng nội dung trên để đơn hàng được xử lý tự động.
                  </div>
                </div>
              </div>
            )}

            {/* Danh sách sản phẩm */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '18px' }}>
              <span style={{ fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '14px' }}>Sản phẩm đã đặt</span>
              {orderResult.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: idx < orderResult.items.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f5f5f5', position: 'relative', flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#222' }}>{item.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#888' }}>SL: {item.quantity} × {item.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#222', fontSize: '0.95rem' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
            </div>

            {/* Tổng tiền */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid #eee', paddingTop: '18px', marginTop: '18px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>Tổng thanh toán</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{orderResult.totalAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          {/* Thông báo + Nút quay lại */}
          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>Chúng tôi sẽ liên hệ qua SĐT <strong>{orderResult.customerPhone}</strong> để xác nhận đơn hàng.</p>
            <Link href="/" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '30px', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>← Quay về trang chủ</Link>
          </div>
        </div>
      </main>
    );
  }

  // ===== Styles =====
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '0.95rem',
    color: '#333',
    transition: 'border-color 0.2s',
    outline: 'none',
    backgroundColor: '#fff',
    boxSizing: 'border-box'
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
    cursor: 'pointer'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 600,
    color: '#333',
    fontSize: '0.9rem'
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', paddingBottom: '80px' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '130px', paddingLeft: '20px', paddingRight: '20px' }}>
        
        {/* Breadcrumb */}
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          {' / '}
          <Link href="/cart" style={{ color: '#888', textDecoration: 'none' }}>Giỏ hàng</Link>
          {' / '}
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Thanh toán</span>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <Link href="/cart" style={{ display: 'flex', alignItems: 'center', color: '#888', textDecoration: 'none' }}>
            <ChevronLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#222', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
            Thanh toán
          </h1>
        </div>

        {checkoutItems.length === 0 && !success ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '12px' }}>
            <p style={{ color: '#999', marginBottom: '20px' }}>Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
            <Link href="/products" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>← Quay lại cửa hàng</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', alignItems: 'start' }}>
            
            {/* Form thông tin */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '35px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px', color: '#222' }}>Thông tin giao hàng</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {isQuickCheckout ? (
                  /* ====== LUỒNG 1: ĐÃ ĐĂNG NHẬP + CÓ PROFILE ====== */
                  <>
                    <div style={{ padding: '20px', backgroundColor: '#f0faf5', border: '1px solid #c3e6cb', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '1.1rem' }}>✅</span>
                        <span style={{ fontWeight: 700, color: '#155724', fontSize: '0.95rem' }}>Đặt hàng nhanh</span>
                        <span style={{ fontSize: '0.82rem', color: '#888', marginLeft: 'auto' }}>Thông tin từ tài khoản</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.92rem' }}>
                        <div>
                          <span style={{ color: '#888', fontSize: '0.82rem' }}>Người nhận</span>
                          <p style={{ margin: '3px 0 0', fontWeight: 600, color: '#222' }}>{loggedInUser.name}</p>
                        </div>
                        <div>
                          <span style={{ color: '#888', fontSize: '0.82rem' }}>Số điện thoại</span>
                          <p style={{ margin: '3px 0 0', fontWeight: 600, color: '#222' }}>{loggedInUser.phone}</p>
                        </div>
                        <div>
                          <span style={{ color: '#888', fontSize: '0.82rem' }}>Email</span>
                          <p style={{ margin: '3px 0 0', fontWeight: 500, color: '#333' }}>{loggedInUser.email}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <span style={{ color: '#888', fontSize: '0.82rem' }}>Địa chỉ giao hàng</span>
                          <p style={{ margin: '3px 0 0', fontWeight: 500, color: '#333', lineHeight: 1.5 }}>{loggedInUser.address}</p>
                        </div>
                      </div>
                      <Link href="/profile" style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Chỉnh sửa thông tin →
                      </Link>
                    </div>
                  </>
                ) : (
                  /* ====== LUỒNG 2: KHÁCH VÃNG LAI (GUEST) ====== */
                  <>
                    {loggedInUser && !isQuickCheckout && (
                      <div style={{ padding: '14px 18px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>⚠️</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: '0.88rem', color: '#856404' }}>
                            Cập nhật <strong>SĐT</strong> và <strong>địa chỉ</strong> trong hồ sơ để đặt hàng nhanh lần sau.
                          </span>
                        </div>
                        <Link href="/profile" style={{ fontSize: '0.82rem', color: '#856404', fontWeight: 700, textDecoration: 'underline', whiteSpace: 'nowrap' }}>Cập nhật</Link>
                      </div>
                    )}

                    {/* Họ tên + SĐT */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                      <div>
                        <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                        <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nhập họ tên đầy đủ" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
                      </div>
                      <div>
                        <label style={labelStyle}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                        <input 
                          required type="tel" name="phone" 
                          value={formData.phone} 
                          onChange={(e) => {
                            handleInputChange(e);
                            if (phoneError) setPhoneError('');
                          }} 
                          placeholder="VD: 0912345678" 
                          maxLength={11}
                          style={{ ...inputStyle, borderColor: phoneError ? '#dc3545' : '#e0e0e0' }} 
                          onFocus={(e) => e.target.style.borderColor = phoneError ? '#dc3545' : 'var(--primary)'} 
                          onBlur={(e) => e.target.style.borderColor = phoneError ? '#dc3545' : '#e0e0e0'} 
                        />
                        {phoneError && <p style={{ color: '#dc3545', fontSize: '0.82rem', margin: '6px 0 0', fontWeight: 500 }}>{phoneError}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com (không bắt buộc)" style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
                    </div>

                    {/* Tỉnh / Quận / Phường - DROPDOWN */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
                      <div>
                        <label style={labelStyle}>Tỉnh / Thành phố <span style={{ color: 'red' }}>*</span></label>
                        <select name="provinceCode" value={formData.provinceCode} onChange={handleInputChange} required style={selectStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}>
                          <option value="">-- Chọn Tỉnh/TP --</option>
                          {provinces.map(p => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Quận / Huyện <span style={{ color: 'red' }}>*</span></label>
                        <select name="districtCode" value={formData.districtCode} onChange={handleInputChange} required disabled={!formData.provinceCode} style={{ ...selectStyle, opacity: formData.provinceCode ? 1 : 0.5 }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}>
                          <option value="">-- Chọn Quận/Huyện --</option>
                          {districts.map(d => (
                            <option key={d.code} value={d.code}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Phường / Xã <span style={{ color: 'red' }}>*</span></label>
                        <select name="wardCode" value={formData.wardCode} onChange={handleInputChange} required disabled={!formData.districtCode} style={{ ...selectStyle, opacity: formData.districtCode ? 1 : 0.5 }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}>
                          <option value="">-- Chọn Phường/Xã --</option>
                          {wards.map(w => (
                            <option key={w.code} value={w.code}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Địa chỉ chi tiết + Nút định vị */}
                    <div>
                      <label style={labelStyle}>Địa chỉ chi tiết <span style={{ color: 'red' }}>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Số nhà, tên đường, ngõ/ngách" style={{ ...inputStyle, paddingRight: '120px' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
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
                    </div>
                  </>
                )}

                {/* Ghi chú */}
                <div>
                  <label style={labelStyle}>Ghi chú đơn hàng</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="VD: Giao hàng giờ hành chính, gọi trước khi giao..." style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = '#e0e0e0'} />
                </div>

                {/* Phương thức thanh toán */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: '12px' }}>Phương thức thanh toán <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', border: formData.paymentMethod === 'cod' ? '2px solid var(--primary)' : '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'cod' ? '#f0faf5' : '#fff' }}>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                      <div>
                        <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>💵 Thanh toán khi nhận hàng (COD)</span>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>Kiểm tra sản phẩm trước khi thanh toán</p>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', border: formData.paymentMethod === 'banking' ? '2px solid var(--primary)' : '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'banking' ? '#f0faf5' : '#fff' }}>
                      <input type="radio" name="paymentMethod" value="banking" checked={formData.paymentMethod === 'banking'} onChange={handleInputChange} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                      <div>
                        <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>🏦 VNPay (Thẻ ATM / Visa / QR)</span>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>Thanh toán qua cổng VNPay - Hỗ trợ mọi ngân hàng</p>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', border: formData.paymentMethod === 'momo' ? '2px solid #ae2070' : '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'momo' ? '#fdf0f7' : '#fff' }}>
                      <input type="radio" name="paymentMethod" value="momo" checked={formData.paymentMethod === 'momo'} onChange={handleInputChange} style={{ accentColor: '#ae2070', width: '18px', height: '18px' }} />
                      <div>
                        <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>📱 Ví MoMo</span>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>Quét mã QR bằng ứng dụng MoMo</p>
                      </div>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', border: formData.paymentMethod === 'bank_transfer' ? '2px solid #1a73e8' : '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'bank_transfer' ? '#e8f0fe' : '#fff' }}>
                      <input type="radio" name="paymentMethod" value="bank_transfer" checked={formData.paymentMethod === 'bank_transfer'} onChange={handleInputChange} style={{ accentColor: '#1a73e8', width: '18px', height: '18px' }} />
                      <div>
                        <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>🔄 Chuyển khoản ngân hàng (QR Code)</span>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>Quét mã QR VietQR bằng bất kỳ app ngân hàng nào</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading || checkoutItems.length === 0} style={{ padding: '15px', backgroundColor: loading ? '#999' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
                </button>
              </form>
            </div>

            {/* Sidebar tóm tắt đơn hàng */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', position: 'sticky', top: '120px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', color: '#222' }}>Đơn hàng của bạn ({checkoutItems.length} sp)</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', maxHeight: '320px', overflowY: 'auto', paddingRight: '5px' }}>
                {checkoutItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ width: '55px', height: '55px', backgroundColor: '#f5f5f5', borderRadius: '6px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <Image src={item.image || '/assets/product1.png'} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#222', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                      <p style={{ fontSize: '0.82rem', color: '#888', margin: '3px 0 0' }}>SL: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 700, color: '#222', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: '#555' }}>
                <span>Tạm tính</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{checkoutTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#555' }}>
                  <span>Phí giao hàng</span>
                  <span style={{ fontWeight: 600, color: shippingInfo.fee === 0 ? 'var(--primary)' : '#222' }}>
                    {shippingInfo.fee === 0 ? 'Miễn phí' : `${shippingInfo.fee.toLocaleString('vi-VN')}₫`}
                  </span>
                </div>
                {formData.provinceName && (
                  <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '4px 0 0', textAlign: 'right' }}>
                    {shippingInfo.label}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: '#555' }}>
                <span>Phương thức</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{{ cod: 'COD', banking: 'VNPay', momo: 'MoMo', bank_transfer: 'Chuyển khoản QR' }[formData.paymentMethod] || formData.paymentMethod}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #eee', paddingTop: '18px', marginTop: '10px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>Tổng cộng</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{grandTotal.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
