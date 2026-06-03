'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Ticket, AlertCircle } from 'lucide-react';

// Interfaces cho API Tỉnh/Huyện/Xã
interface Province { code: number; name: string; }
interface District { code: number; name: string; }
interface Ward { code: number; name: string; }

// Tính phí ship chuẩn theo nghiệp vụ kinhmatanna.com
function getShippingFee(provinceName: string, subtotal: number): { fee: number; label: string } {
  if (!provinceName) return { fee: 0, label: 'Chưa chọn khu vực' };
  if (subtotal >= 500000) return { fee: 0, label: 'Đơn hàng trên 500k - Miễn phí ship' };
  
  const cleanName = provinceName.toLowerCase();
  if (cleanName.includes('hà nội')) {
    return { fee: 16500, label: 'Khu vực Hà Nội' };
  }
  if (cleanName.includes('hồ chí minh')) {
    return { fee: 40000, label: 'Khu vực TP. Hồ Chí Minh' };
  }
  return { fee: 30000, label: 'Khu vực tỉnh thành khác' };
}

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [isBuyNow, setIsBuyNow] = useState(false);

  // Load sản phẩm checkout
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
    } else if (urlParams.get('cartSelect') === 'true') {
      const selectedItems = sessionStorage.getItem('selectedCartItems');
      if (selectedItems) {
        const items = JSON.parse(selectedItems);
        setCheckoutItems(items);
        const sub = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        setCheckoutTotal(sub);
      } else {
        setCheckoutItems(cart);
        setCheckoutTotal(totalPrice);
      }
    } else {
      setCheckoutItems(cart);
      setCheckoutTotal(totalPrice);
    }
  }, [cart, totalPrice]);

  // Kiểm tra đơn hàng có chứa mắt kính cắt cận cần cọc hay không (Nghiệp vụ Anna)
  const hasPrescription = checkoutItems.some(item => {
    const nameLower = item.name.toLowerCase();
    const catLower = (item.category || '').toLowerCase();
    return (
      catLower.includes('tròng kính') ||
      nameLower.includes('tròng kính') ||
      nameLower.includes('cắt cận') ||
      nameLower.includes('cận')
    );
  });
  
  // === Kiểm tra đăng nhập ===
  const [loggedInUser, setLoggedInUser] = useState<{
    id: string; name: string; email: string; phone: string | null; address: string | null;
  } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Cấu hình từ database/API settings
  const [settings, setSettings] = useState<any>({
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
    enableBankTransfer: true
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings((prev: any) => ({ ...prev, ...data }));
          // Tự động điều chỉnh phương thức thanh toán mặc định nếu COD bị tắt
          if (data.enableCOD === false) {
            setFormData(prev => ({ ...prev, paymentMethod: data.enableVNPay ? 'banking' : (data.enableBankTransfer ? 'bank_transfer' : 'cod') }));
          }
        }
      })
      .catch(err => console.error('Lỗi nạp cấu hình hệ thống:', err));
  }, []);

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

  // Voucher state
  const [couponInput, setCouponInput] = useState('');
  const [activeProductCoupon, setActiveProductCoupon] = useState<{ code: string; type: 'percentage' | 'flat'; value: number } | null>(null);
  const [activeShippingCoupon, setActiveShippingCoupon] = useState<{ code: string; type: 'freeship'; value: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Shopee-like states
  const [shippingMethod, setShippingMethod] = useState<'nhanh' | 'hoa_toc' | 'tiet_kiem'>('nhanh');
  const [useCoins, setUseCoins] = useState(false);
  const [userCoinsBalance, setUserCoinsBalance] = useState(15000); // Mặc định có sẵn 15,000 xu để test

  // Lưu kết quả đơn hàng thành công
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
    totalAmount: number;
    shippingFee: number;
    discount: number;
    depositRequired: number;
    hasPrescription: boolean;
    items: { name: string; quantity: number; price: number; image: string }[];
  } | null>(null);

  const isQuickCheckout = !!(loggedInUser?.phone && loggedInUser?.address);

  // Tính phí ship gốc sử dụng settings cấu hình
  const baseShippingInfo = (() => {
    if (!isQuickCheckout && !formData.provinceName) return { fee: 0, label: 'Chưa chọn khu vực' };
    if (settings.enableFreeShipOver500k && checkoutTotal >= 500000) {
      return { fee: 0, label: 'Đơn hàng trên 500k - Miễn phí ship' };
    }
    if (isQuickCheckout) {
      return { fee: settings.shipNhanh, label: 'Phí cố định' };
    }
    const cleanName = formData.provinceName.toLowerCase();
    if (cleanName.includes('hà nội')) {
      return { fee: Math.round(settings.shipNhanh * 0.55), label: 'Khu vực Hà Nội' };
    }
    if (cleanName.includes('hồ chí minh')) {
      return { fee: Math.round(settings.shipNhanh * 1.33), label: 'Khu vực TP. Hồ Chí Minh' };
    }
    return { fee: settings.shipNhanh, label: 'Khu vực tỉnh thành khác' };
  })();

  // Tính phí ship theo phương thức vận chuyển
  let finalShippingFee = baseShippingInfo.fee;
  let shippingMethodLabel = 'Giao hàng nhanh (GHN)';
  let shippingDeliveryEst = 'Dự kiến nhận sau 2-3 ngày';
  
  if (shippingMethod === 'hoa_toc') {
    finalShippingFee = baseShippingInfo.fee === 0 ? 0 : settings.shipHoaToc;
    shippingMethodLabel = 'Giao hàng hỏa tốc (GrabExpress/Ahamove)';
    shippingDeliveryEst = 'Giao ngay trong 2 giờ';
  } else if (shippingMethod === 'tiet_kiem') {
    finalShippingFee = baseShippingInfo.fee === 0 ? 0 : settings.shipTietKiem;
    shippingMethodLabel = 'Giao hàng tiết kiệm (Viettel Post)';
    shippingDeliveryEst = 'Dự kiến nhận sau 4-6 ngày';
  }

  // Tính toán giảm giá sản phẩm
  let productDiscount = 0;
  if (activeProductCoupon) {
    if (activeProductCoupon.type === 'percentage') {
      productDiscount = Math.round(checkoutTotal * (activeProductCoupon.value / 100));
    } else if (activeProductCoupon.type === 'flat') {
      productDiscount = activeProductCoupon.value;
    }
  }

  // Tính toán giảm giá vận chuyển (Giảm theo % phí ship cấu hình)
  let shippingDiscount = 0;
  if (activeShippingCoupon) {
    shippingDiscount = Math.round(finalShippingFee * (activeShippingCoupon.value / 100));
  }

  // Tổng tiền tạm tính sau voucher
  const totalAfterVouchers = Math.max(0, checkoutTotal + finalShippingFee - productDiscount - shippingDiscount);

  // Áp dụng Xu Shopee (Giới hạn tối đa cấu hình bằng settings.maxCoins)
  const allowedCoins = Math.min(userCoinsBalance, settings.maxCoins);
  const coinDiscount = useCoins ? Math.min(allowedCoins, totalAfterVouchers) : 0;

  // Tổng tiền cuối cùng
  const grandTotal = Math.max(0, totalAfterVouchers - coinDiscount);

  // Cọc nếu có tròng kính/cắt cận (Sử dụng tỷ lệ % cấu hình settings.depositPercent)
  const depositPercent = settings.depositPercent || 50;
  const depositRequired = hasPrescription ? Math.round(grandTotal * (depositPercent / 100)) : 0;
  const remainingAmount = grandTotal - depositRequired;

  // ===== Fetch user đã đăng nhập =====
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.id) {
          setLoggedInUser(data.user);
          if (data.user.phone && data.user.address) {
            setFormData(prev => ({
              ...prev,
              name: data.user.name || '',
              phone: data.user.phone || '',
              email: data.user.email || '',
              address: data.user.address || '',
            }));
          } else {
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

  // ===== Fetch Tỉnh/Thành phố =====
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

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const codePct = (settings.couponProductPctCode || 'ANDU10').toUpperCase();
    const codeFlat = (settings.couponProductFlatCode || 'ANDU50').toUpperCase();
    const codeShip = (settings.couponShipCode || 'FREESHIP').toUpperCase();

    if (code === codePct) {
      const val = settings.couponProductPctVal || 10;
      setActiveProductCoupon({ code: settings.couponProductPctCode, type: 'percentage', value: val });
      setCouponSuccess(`Áp dụng mã giảm giá sản phẩm ${settings.couponProductPctCode} thành công (Giảm ${val}%)`);
      setCouponInput('');
    } else if (code === codeFlat) {
      const val = settings.couponProductFlatVal || 50000;
      setActiveProductCoupon({ code: settings.couponProductFlatCode, type: 'flat', value: val });
      setCouponSuccess(`Áp dụng mã giảm giá sản phẩm ${settings.couponProductFlatCode} thành công (Giảm ${val.toLocaleString('vi-VN')}₫)`);
      setCouponInput('');
    } else if (code === codeShip) {
      const val = settings.couponShipVal || 100;
      setActiveShippingCoupon({ code: settings.couponShipCode, type: 'freeship', value: val });
      setCouponSuccess(`Áp dụng mã Freeship ${settings.couponShipCode} thành công (Giảm ${val}% phí ship)`);
      setCouponInput('');
    } else {
      setCouponError('Mã giảm giá không tồn tại hoặc đã hết hạn.');
    }
  };

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

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\s|-/g, '');
    const vnPhoneRegex = /^0[3-9]\d{8}$/;
    return vnPhoneRegex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutItems.length === 0) return;

    const submitName = isQuickCheckout ? loggedInUser!.name : formData.name;
    const submitPhone = isQuickCheckout ? loggedInUser!.phone! : formData.phone;
    const submitEmail = isQuickCheckout ? loggedInUser!.email : formData.email;
    const submitAddress = fullAddress;

    if (!isQuickCheckout && !validatePhone(submitPhone)) {
      setPhoneError('Số điện thoại không hợp lệ. VD: 0912345678 (10 số, bắt đầu bằng 0)');
      return;
    }
    setPhoneError('');

    if (!isQuickCheckout && (!formData.provinceCode || !formData.districtCode || !formData.wardCode)) {
      alert('Vui lòng chọn đầy đủ Tỉnh/Quận/Phường.');
      return;
    }

    // Nếu gọng cắt cận mà chọn COD, nhắc nhở khách chuyển khoản đặt cọc
    if (hasPrescription && formData.paymentMethod === 'cod') {
      alert('⚠️ Đơn hàng có chứa tròng kính / cắt cận yêu cầu bạn thanh toán đặt cọc 50% trước. Chúng tôi sẽ chuyển đơn hàng này sang dạng Đặt cọc chuyển khoản.');
      setFormData(prev => ({ ...prev, paymentMethod: 'bank_transfer' }));
      return;
    }
    
    const cartSnapshot = checkoutItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    setLoading(true);
    
    // Tạo ghi chú nghiệp vụ cọc và Shopee
    const prescriptionNote = hasPrescription 
      ? `[CÓ TRÒNG CẬN - YÊU CẦU CỌC 50%: ${depositRequired.toLocaleString('vi-VN')}₫. Còn lại: ${remainingAmount.toLocaleString('vi-VN')}₫] ` 
      : '';
    const shippingMethodNote = `[Vận chuyển: ${shippingMethodLabel}] `;
    const voucherNote = (activeProductCoupon ? `[Voucher SP: ${activeProductCoupon.code} - Giảm: ${productDiscount.toLocaleString('vi-VN')}₫] ` : '') +
                        (activeShippingCoupon ? `[Voucher Ship: ${activeShippingCoupon.code} - Giảm: ${shippingDiscount.toLocaleString('vi-VN')}₫] ` : '');
    const coinNote = useCoins ? `[Dùng ${coinDiscount.toLocaleString('vi-VN')} xu giảm giá] ` : '';
    
    const finalNote = prescriptionNote + shippingMethodNote + voucherNote + coinNote + formData.notes;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: submitName,
          customerPhone: submitPhone,
          customerEmail: submitEmail,
          customerAddress: submitAddress,
          notes: finalNote,
          paymentMethod: formData.paymentMethod,
          totalAmount: grandTotal,
          shippingFee: finalShippingFee,
          items: checkoutItems
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        
        if (formData.paymentMethod === 'banking') {
          try {
            const vnpayRes = await fetch('/api/vnpay/create-payment-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: orderData.id, amount: hasPrescription ? depositRequired : grandTotal })
            });
            const vnpayData = await vnpayRes.json();
            if (vnpayData.url) {
              window.location.href = vnpayData.url;
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
          router.push(`/mock-gateway?orderId=${orderData.id}&amount=${hasPrescription ? depositRequired : grandTotal}&method=momo`);
          return;
        }

        if (formData.paymentMethod === 'bank_transfer') {
          router.push(`/mock-gateway?orderId=${orderData.id}&amount=${hasPrescription ? depositRequired : grandTotal}&method=bank_transfer&deposit=true`);
          return;
        }

        setOrderResult({
          orderId: orderData.id,
          customerName: submitName,
          customerPhone: submitPhone,
          shippingAddress: submitAddress,
          paymentMethod: formData.paymentMethod,
          totalAmount: grandTotal,
          shippingFee: finalShippingFee,
          discount: productDiscount + shippingDiscount + coinDiscount,
          depositRequired: depositRequired,
          hasPrescription: hasPrescription,
          items: cartSnapshot
        });
        setSuccess(true);
        clearCart();
        sessionStorage.removeItem('selectedCartItems');
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

  // Success screen
  if (success && orderResult) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', paddingBottom: '80px' }}>
        <Header />
        <div style={{ maxWidth: '700px', margin: '0 auto', paddingTop: '140px', paddingLeft: '20px', paddingRight: '20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{ width: '70px', height: '70px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', fontWeight: 700 }}>✓</div>
            <h1 style={{ fontSize: '1.5rem', color: '#222', marginBottom: '8px', fontWeight: 700, letterSpacing: '1px' }}>ĐẶT HÀNG THÀNH CÔNG!</h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Cảm ơn bạn đã chọn mua sắm tại <strong style={{ color: 'var(--primary)' }}>Andu Eyewear</strong></p>
          </div>

          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px', borderBottom: '1px solid #f0f0f0', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Mã đơn hàng</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px' }}>#{orderResult.orderId.slice(0, 8).toUpperCase()}</span>
            </div>

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
                <span style={{ fontWeight: 600, color: '#222' }}>{orderResult.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản / Cổng thanh toán'}</span>
              </div>
            </div>

            {/* Cảnh báo đặt cọc (Prescription Deposit) */}
            {orderResult.hasPrescription && (
              <div style={{ backgroundColor: '#fff8db', border: '1.5px solid #ffc107', borderRadius: '8px', padding: '16px 20px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', gap: '8px', color: '#856404', fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px' }}>
                  <AlertCircle size={18} />
                  <span>Yêu cầu đặt cọc trước gia công (Nghiệp vụ Tròng Kính)</span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#666', lineHeight: 1.5 }}>
                  Do đơn hàng của quý khách có chứa sản phẩm tròng kính / cắt mắt cận cận, quý khách vui lòng hoàn tất đặt cọc <strong>50% giá trị đơn hàng ({orderResult.depositRequired.toLocaleString('vi-VN')}₫)</strong> để kỹ thuật viên tiến hành đo mài lắp tròng.
                </p>
                <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '6px', border: '1px dashed #ffc107', fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 5px 0' }}>🏦 Ngân hàng: <strong>Vietcombank (VCB)</strong></p>
                  <p style={{ margin: '0 0 5px 0' }}>📄 Số tài khoản: <strong>0123456789</strong></p>
                  <p style={{ margin: '0 0 5px 0' }}>👤 Chủ tài khoản: <strong>NGUYEN MANH CUONG</strong></p>
                  <p style={{ margin: '0 0 5px 0' }}>💰 Số tiền cọc: <strong style={{ color: 'var(--primary)' }}>{orderResult.depositRequired.toLocaleString('vi-VN')}₫</strong></p>
                  <p style={{ margin: '0' }}>📝 Nội dung CK: <strong>COC {orderResult.orderId.slice(0, 8).toUpperCase()}</strong></p>
                </div>
              </div>
            )}

            {/* Thông tin chuyển khoản chung nếu chọn banking */}
            {orderResult.paymentMethod === 'banking' && !orderResult.hasPrescription && (
              <div style={{ backgroundColor: '#f0f4f8', border: '1px solid #dce4ec', borderRadius: '10px', padding: '20px', marginBottom: '25px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '120px', height: '120px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                  <img 
                    src={`https://img.vietqr.io/image/vcb-0123456789-compact.png?amount=${orderResult.totalAmount}&addInfo=DH${orderResult.orderId.slice(0, 8).toUpperCase()}&accountName=NGUYEN MANH CUONG`} 
                    alt="VietQR" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', color: '#113', marginBottom: '10px', fontWeight: 700 }}>Thông tin chuyển khoản</h3>
                  <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#444' }}>Ngân hàng: <strong>Vietcombank (VCB)</strong></p>
                  <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#444' }}>Số tài khoản: <strong>0123456789</strong></p>
                  <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#444' }}>Số tiền: <strong style={{ color: 'var(--primary)' }}>{orderResult.totalAmount.toLocaleString('vi-VN')}₫</strong></p>
                  <p style={{ margin: '0 0 6px', fontSize: '0.85rem', color: '#444' }}>Nội dung CK: <strong>DH{orderResult.orderId.slice(0, 8).toUpperCase()}</strong></p>
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

            {/* Tóm tắt số tiền */}
            <div style={{ borderTop: '1.5px solid #eee', paddingTop: '18px', marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                <span>Cước vận chuyển:</span>
                <span>{orderResult.shippingFee > 0 ? `${orderResult.shippingFee.toLocaleString('vi-VN')}₫` : 'Miễn phí'}</span>
              </div>
              {orderResult.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--primary)' }}>
                  <span>Giảm giá voucher:</span>
                  <span>-{orderResult.discount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#222' }}>Tổng tiền đơn hàng:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{orderResult.totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
              
              {orderResult.hasPrescription && (
                <div style={{ marginTop: '10px', borderTop: '1px dashed #eee', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#d32f2f', fontWeight: 600 }}>
                    <span>Cọc trước 50% để gia công:</span>
                    <span>{orderResult.depositRequired.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#555', marginTop: '5px' }}>
                    <span>Còn lại thanh toán COD:</span>
                    <span>{(orderResult.totalAmount - orderResult.depositRequired).toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>Chúng tôi sẽ gọi đến số điện thoại <strong>{orderResult.customerPhone}</strong> để xác nhận và thông báo tiến độ.</p>
            <Link href="/" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '30px', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>← Quay về trang chủ</Link>
          </div>
        </div>
      </main>
    );
  }

  // Styles
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
            <p style={{ color: '#999', marginBottom: '20px' }}>Chưa chọn sản phẩm thanh toán. Vui lòng quay lại giỏ hàng.</p>
            <Link href="/cart" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>← Về giỏ hàng</Link>
          </div>
        ) : (
          <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', alignItems: 'start' }}>
            
            {/* Form thông tin */}
            <div className="checkout-form-container" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '35px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)' }}>
              
              {/* Alert thông báo cọc nghiệp vụ mắt kính */}
              {hasPrescription && (
                <div style={{ backgroundColor: '#fff8db', border: '1px solid #ffc107', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <AlertCircle size={20} style={{ color: '#ff9800', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '0.88rem', color: '#666', lineHeight: 1.5 }}>
                    <strong style={{ color: '#856404' }}>Thông báo nghiệp vụ lắp đặt tròng cận:</strong> Đơn hàng có chứa Tròng kính (Cắt cận) yêu cầu chuyển khoản đặt cọc tối thiểu 50% trước để kỹ thuật viên mài lắp kính. Phần còn lại có thể trả khi nhận hàng (COD).
                  </div>
                </div>
              )}

              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px', color: '#222' }}>Thông tin giao hàng</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {isQuickCheckout ? (
                  <>
                    <div style={{ padding: '20px', backgroundColor: '#f0faf5', border: '1px solid #c3e6cb', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '1.1rem' }}>✅</span>
                        <span style={{ fontWeight: 700, color: '#155724', fontSize: '0.95rem' }}>Đặt hàng nhanh</span>
                        <span style={{ fontSize: '0.82rem', color: '#888', marginLeft: 'auto' }}>Thông tin từ tài khoản</span>
                      </div>
                      <div className="checkout-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.92rem' }}>
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

                    <div className="checkout-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                      <div>
                        <label style={labelStyle}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                        <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nhập họ tên đầy đủ" style={inputStyle} />
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
                        />
                        {phoneError && <p style={{ color: '#dc3545', fontSize: '0.82rem', margin: '6px 0 0', fontWeight: 500 }}>{phoneError}</p>}
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com (không bắt buộc)" style={inputStyle} />
                    </div>

                    {/* Tỉnh / Quận / Phường */}
                    <div className="checkout-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
                      <div>
                        <label style={labelStyle}>Tỉnh / Thành phố <span style={{ color: 'red' }}>*</span></label>
                        <select name="provinceCode" value={formData.provinceCode} onChange={handleInputChange} required style={selectStyle}>
                          <option value="">-- Chọn Tỉnh/TP --</option>
                          {provinces.map(p => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Quận / Huyện <span style={{ color: 'red' }}>*</span></label>
                        <select name="districtCode" value={formData.districtCode} onChange={handleInputChange} required disabled={!formData.provinceCode} style={{ ...selectStyle, opacity: formData.provinceCode ? 1 : 0.5 }}>
                          <option value="">-- Chọn Quận/Huyện --</option>
                          {districts.map(d => (
                            <option key={d.code} value={d.code}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Phường / Xã <span style={{ color: 'red' }}>*</span></label>
                        <select name="wardCode" value={formData.wardCode} onChange={handleInputChange} required disabled={!formData.districtCode} style={{ ...selectStyle, opacity: formData.districtCode ? 1 : 0.5 }}>
                          <option value="">-- Chọn Phường/Xã --</option>
                          {wards.map(w => (
                            <option key={w.code} value={w.code}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Chi tiết địa chỉ + nút GPS */}
                    <div>
                      <label style={labelStyle}>Địa chỉ chi tiết <span style={{ color: 'red' }}>*</span></label>
                      <div style={{ position: 'relative' }}>
                        <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Số nhà, tên đường, ngõ/ngách" style={{ ...inputStyle, paddingRight: '120px' }} />
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

                {/* Phương thức vận chuyển - Shopee Style */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: '12px' }}>Phương thức vận chuyển <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    <label style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', 
                      border: shippingMethod === 'nhanh' ? '2px solid var(--primary)' : '1.5px solid #e0e0e0', 
                      borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', 
                      backgroundColor: shippingMethod === 'nhanh' ? '#f0faf5' : '#fff' 
                    }}>
                      <input 
                        type="radio" 
                        name="shippingMethod" 
                        value="nhanh" 
                        checked={shippingMethod === 'nhanh'} 
                        onChange={() => setShippingMethod('nhanh')} 
                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: '#222', fontSize: '0.92rem' }}>🚚 Nhanh (Giao Hàng Nhanh - GHN)</span>
                          <span style={{ fontWeight: 700, color: '#222', fontSize: '0.92rem' }}>
                            {baseShippingInfo.fee === 0 ? 'Miễn phí' : `${baseShippingInfo.fee.toLocaleString('vi-VN')}₫`}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#888' }}>
                          Nhận hàng dự kiến sau 2-3 ngày làm việc.
                        </p>
                      </div>
                    </label>

                    <label style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', 
                      border: shippingMethod === 'hoa_toc' ? '2px solid var(--primary)' : '1.5px solid #e0e0e0', 
                      borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', 
                      backgroundColor: shippingMethod === 'hoa_toc' ? '#f0faf5' : '#fff' 
                    }}>
                      <input 
                        type="radio" 
                        name="shippingMethod" 
                        value="hoa_toc" 
                        checked={shippingMethod === 'hoa_toc'} 
                        onChange={() => setShippingMethod('hoa_toc')} 
                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: '#222', fontSize: '0.92rem' }}>⚡ Hỏa Tốc (GrabExpress/Ahamove)</span>
                          <span style={{ fontWeight: 700, color: '#222', fontSize: '0.92rem' }}>
                            {((baseShippingInfo.fee > 0 ? baseShippingInfo.fee + 30000 : 30000)).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#888' }}>
                          Giao hàng hỏa tốc trong vòng 2 giờ (áp dụng nội thành).
                        </p>
                      </div>
                    </label>

                    <label style={{ 
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', 
                      border: shippingMethod === 'tiet_kiem' ? '2px solid var(--primary)' : '1.5px solid #e0e0e0', 
                      borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', 
                      backgroundColor: shippingMethod === 'tiet_kiem' ? '#f0faf5' : '#fff' 
                    }}>
                      <input 
                        type="radio" 
                        name="shippingMethod" 
                        value="tiet_kiem" 
                        checked={shippingMethod === 'tiet_kiem'} 
                        onChange={() => setShippingMethod('tiet_kiem')} 
                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} 
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600, color: '#222', fontSize: '0.92rem' }}>🐢 Tiết Kiệm (Viettel Post)</span>
                          <span style={{ fontWeight: 700, color: '#222', fontSize: '0.92rem' }}>
                            {Math.max(10000, baseShippingInfo.fee - 10000).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#888' }}>
                          Tiết kiệm chi phí, nhận hàng sau 4-6 ngày làm việc.
                        </p>
                      </div>
                    </label>

                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Ghi chú đơn hàng</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="VD: Giao giờ hành chính, lắp cận phải/trái..." style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                {/* Chọn phương thức thanh toán */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: '12px' }}>Phương thức thanh toán <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    
                    {/* COD chỉ cho phép nếu không có tròng kính mài cận và được bật trong cấu hình */}
                    {settings.enableCOD !== false && (
                      <label style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', 
                        border: formData.paymentMethod === 'cod' ? '2px solid var(--primary)' : '1.5px solid #e0e0e0', 
                        borderRadius: '8px', cursor: hasPrescription ? 'not-allowed' : 'pointer', 
                        transition: 'all 0.2s', backgroundColor: hasPrescription ? '#fafafa' : formData.paymentMethod === 'cod' ? '#f0faf5' : '#fff',
                        opacity: hasPrescription ? 0.6 : 1
                      }}>
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="cod" 
                          disabled={hasPrescription}
                          checked={formData.paymentMethod === 'cod'} 
                          onChange={handleInputChange} 
                          style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} 
                        />
                        <div>
                          <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>💵 Thanh toán khi nhận hàng (COD)</span>
                          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>
                            {hasPrescription ? 'Không áp dụng cho đơn hàng cắt tròng kính' : 'Kiểm tra sản phẩm trước khi nhận'}
                          </p>
                        </div>
                      </label>
                    )}

                    {settings.enableVNPay !== false && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', border: formData.paymentMethod === 'banking' ? '2px solid var(--primary)' : '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'banking' ? '#f0faf5' : '#fff' }}>
                        <input type="radio" name="paymentMethod" value="banking" checked={formData.paymentMethod === 'banking'} onChange={handleInputChange} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                        <div>
                          <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>🏦 Cổng VNPay (Thẻ ATM / Visa / QR)</span>
                          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>{hasPrescription ? `Thanh toán cọc ${settings.depositPercent || 50}% qua VNPay` : 'Thanh toán qua cổng VNPay - Hỗ trợ mọi ngân hàng'}</p>
                        </div>
                      </label>
                    )}

                    {settings.enableBankTransfer !== false && (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', border: formData.paymentMethod === 'bank_transfer' ? '2px solid #1a73e8' : '1.5px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'bank_transfer' ? '#e8f0fe' : '#fff' }}>
                        <input type="radio" name="paymentMethod" value="bank_transfer" checked={formData.paymentMethod === 'bank_transfer'} onChange={handleInputChange} style={{ accentColor: '#1a73e8', width: '18px', height: '18px' }} />
                        <div>
                          <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>🔄 Chuyển khoản ngân hàng (QR Code tự động)</span>
                          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>{hasPrescription ? `Quét QR chuyển cọc ${settings.depositPercent || 50}%` : 'Quét mã VietQR bằng mọi ứng dụng ngân hàng'}</p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={loading || checkoutItems.length === 0} style={{ padding: '15px', backgroundColor: loading ? '#999' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '30px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px', transition: 'all 0.3s', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {loading ? 'ĐANG XỬ LÝ...' : hasPrescription ? 'XÁC NHẬN ĐẶT HÀNG & CHUYỂN CỌC' : 'ĐẶT HÀNG NGAY'}
                </button>
              </form>
            </div>

            {/* Sidebar tóm tắt đơn hàng */}
            <div className="checkout-sidebar-container" style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', position: 'sticky', top: '120px' }}>
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

              {/* Nhập mã giảm giá - Nghiệp vụ Anna/Shopee */}
              <div style={{ padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Ticket size={16} />
                  Mã giảm giá / Voucher (Áp dụng đồng thời)
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input 
                    type="text" 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="VD: ANDU10, ANDU50, FREESHIP"
                    style={{ ...inputStyle, padding: '10px 12px' }}
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    style={{ padding: '0 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Áp dụng
                  </button>
                </div>
                {couponError && <p style={{ color: '#dc3545', fontSize: '0.82rem', margin: '6px 0 0', fontWeight: 500 }}>{couponError}</p>}
                {couponSuccess && <p style={{ color: 'var(--primary)', fontSize: '0.82rem', margin: '6px 0 0', fontWeight: 500 }}>{couponSuccess}</p>}
                
                {/* Danh sách voucher đang dùng */}
                {(activeProductCoupon || activeShippingCoupon) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>Voucher đã áp dụng:</span>
                    {activeProductCoupon && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eef7f2', padding: '6px 10px', borderRadius: '4px', fontSize: '0.82rem', border: '1px solid #cce8d9' }}>
                        <span style={{ color: '#155724', fontWeight: 600 }}>🎟️ {activeProductCoupon.code} (Giảm giá sản phẩm)</span>
                        <button type="button" onClick={() => setActiveProductCoupon(null)} style={{ border: 'none', background: 'transparent', color: '#ff4d4f', cursor: 'pointer', fontWeight: 700 }}>Xóa</button>
                      </div>
                    )}
                    {activeShippingCoupon && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eef7f2', padding: '6px 10px', borderRadius: '4px', fontSize: '0.82rem', border: '1px solid #cce8d9' }}>
                        <span style={{ color: '#155724', fontWeight: 600 }}>🚚 {activeShippingCoupon.code} (Free Ship)</span>
                        <button type="button" onClick={() => setActiveShippingCoupon(null)} style={{ border: 'none', background: 'transparent', color: '#ff4d4f', cursor: 'pointer', fontWeight: 700 }}>Xóa</button>
                      </div>
                    )}
                  </div>
                )}
                
                <p style={{ fontSize: '0.78rem', color: '#888', margin: '8px 0 0 0', lineHeight: 1.4 }}>
                  💡 Bạn có thể áp dụng đồng thời mã giảm giá sản phẩm (<strong>ANDU10</strong>/<strong>ANDU50</strong>) và mã miễn phí vận chuyển (<strong>FREESHIP</strong>) như Shopee!
                </p>
              </div>

              {/* Dùng xu tích lũy - Shopee Coins Style */}
              {loggedInUser && (
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
                  backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', 
                  marginBottom: '15px' 
                }}>
                  <input 
                    type="checkbox" 
                    id="useCoinsCheckbox" 
                    checked={useCoins} 
                    onChange={(e) => setUseCoins(e.target.checked)} 
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ffaa00' }} 
                  />
                  <label htmlFor="useCoinsCheckbox" style={{ fontSize: '0.88rem', color: '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', width: '100%' }}>
                    🪙 Dùng <strong>{userCoinsBalance.toLocaleString('vi-VN')}</strong> Andu Coins 
                    <span style={{ color: '#ffaa00', fontWeight: 600, marginLeft: 'auto' }}>(-{userCoinsBalance.toLocaleString('vi-VN')}₫)</span>
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: '#555' }}>
                <span>Tạm tính sản phẩm</span>
                <span style={{ fontWeight: 600, color: '#222' }}>{checkoutTotal.toLocaleString('vi-VN')}₫</span>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#555' }}>
                  <span>Phí giao hàng ({shippingMethod === 'nhanh' ? 'Nhanh' : shippingMethod === 'hoa_toc' ? 'Hỏa Tốc' : 'Tiết Kiệm'})</span>
                  <span style={{ fontWeight: 600, color: '#222' }}>
                    {finalShippingFee.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                {formData.provinceName && (
                  <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '4px 0 0', textAlign: 'right' }}>
                    {baseShippingInfo.label} ({shippingDeliveryEst})
                  </p>
                )}
              </div>

              {productDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: 'var(--primary)' }}>
                  <span>Giảm giá sản phẩm</span>
                  <span style={{ fontWeight: 600 }}>-{productDiscount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}

              {shippingDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: 'var(--primary)' }}>
                  <span>Giảm giá vận chuyển (Voucher)</span>
                  <span style={{ fontWeight: 600 }}>-{shippingDiscount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}

              {coinDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: '#ffaa00' }}>
                  <span>Sử dụng xu tích lũy</span>
                  <span style={{ fontWeight: 600 }}>-{coinDiscount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem', color: '#555' }}>
                <span>Phương thức thanh toán</span>
                <span style={{ fontWeight: 600, color: '#222' }}>
                  {{ cod: 'COD', banking: 'VNPay', bank_transfer: 'Chuyển khoản QR' }[formData.paymentMethod] || formData.paymentMethod}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #eee', paddingTop: '18px', marginTop: '10px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222' }}>Tổng cộng cuối cùng</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{grandTotal.toLocaleString('vi-VN')}₫</span>
              </div>

              {/* Nghiệp vụ cọc tròng cận */}
              {hasPrescription && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff8db', border: '1px dashed #ffc107', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#d32f2f', fontWeight: 700 }}>
                    <span>Cọc tối thiểu (50%):</span>
                    <span>{depositRequired.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#555', marginTop: '6px' }}>
                    <span>Thanh toán khi nhận (COD):</span>
                    <span>{remainingAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 1024px) {
            .checkout-layout {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            .checkout-sidebar-container {
              position: static !important;
            }
          }

          @media (max-width: 768px) {
            .checkout-form-container {
              padding: 20px !important;
            }
            .checkout-sidebar-container {
              padding: 20px !important;
            }
            .checkout-grid-2 {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
            .checkout-grid-3 {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
          }
        `}} />
      </div>
    </main>
  );
}
