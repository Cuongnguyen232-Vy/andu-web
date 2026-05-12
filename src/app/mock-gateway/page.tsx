'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function GatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const method = searchParams.get('method') || 'bank_transfer'; // momo | bank_transfer

  // Polling API để kiểm tra đơn hàng đã thanh toán chưa
  useEffect(() => {
    if (!orderId) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.paymentStatus === 'paid') {
            router.push(`/checkout/result?orderId=${orderId}&status=success`);
          }
        }
      } catch (e) {}
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, router]);

  if (!orderId || !amount) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Tham số không hợp lệ</div>;
  }

  const handleCancel = () => {
    router.push(`/checkout/result?orderId=${orderId}&status=fail`);
  };

  const isMomo = method === 'momo';

  // Thông tin tài khoản (có thể lấy từ CMS/Settings sau)
  const bankInfo = {
    bankName: 'Vietcombank (VCB)',
    bankCode: 'vcb',
    accountNumber: '0123456789',
    accountName: 'NGUYEN VAN A',
  };

  const momoInfo = {
    phone: '0912345678',
    name: 'NGUYEN VAN A',
  };

  const qrUrl = isMomo
    ? `https://img.vietqr.io/image/momo-${momoInfo.phone}-compact.png?amount=${amount}&addInfo=DH${orderId.slice(0, 8).toUpperCase()}`
    : `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-compact.png?amount=${amount}&addInfo=DH${orderId.slice(0, 8).toUpperCase()}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const themeColor = isMomo ? '#ae2070' : '#005b96';
  const themeBg = isMomo ? '#fdf0f7' : '#f0f4f8';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', maxWidth: '480px', width: '100%' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{isMomo ? '📱' : '🏦'}</div>
          <h1 style={{ color: themeColor, marginBottom: '6px', fontSize: '1.3rem', fontWeight: 800 }}>
            {isMomo ? 'THANH TOÁN QUA MOMO' : 'CHUYỂN KHOẢN NGÂN HÀNG'}
          </h1>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>
            Quét mã QR bên dưới bằng {isMomo ? 'ứng dụng MoMo' : 'ứng dụng ngân hàng bất kỳ'}
          </p>
        </div>
        
        {/* QR Code + Thông tin */}
        <div style={{ backgroundColor: themeBg, padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          {/* QR */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '200px', height: '200px', backgroundColor: '#fff', padding: '10px', borderRadius: '10px', border: `2px solid ${themeColor}20`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={qrUrl} 
                alt="QR Code" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
              />
            </div>
          </div>
          
          {/* Thông tin */}
          <div style={{ fontSize: '0.92rem', color: '#333' }}>
            {isMomo ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>Số MoMo</span>
                  <strong>{momoInfo.phone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>Tên</span>
                  <strong>{momoInfo.name}</strong>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>Ngân hàng</span>
                  <strong>{bankInfo.bankName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>Số tài khoản</span>
                  <strong>{bankInfo.accountNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>Chủ tài khoản</span>
                  <strong>{bankInfo.accountName}</strong>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: '#888' }}>Số tiền</span>
              <strong style={{ color: 'red', fontSize: '1.05rem' }}>{Number(amount).toLocaleString('vi-VN')}₫</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ color: '#888' }}>Nội dung CK</span>
              <strong style={{ color: themeColor }}>DH{orderId.slice(0, 8).toUpperCase()}</strong>
            </div>
          </div>
        </div>

        {/* Trạng thái chờ */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 20px', backgroundColor: '#e8f5e9', borderRadius: '30px' }}>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#4caf50', borderRadius: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2e7d32' }}>Đang chờ xác nhận thanh toán...</span>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '8px' }}>
            Hệ thống tự động kiểm tra mỗi 2 giây. Trang sẽ tự chuyển khi nhận được tiền.
          </p>
        </div>

        {/* Demo button - chỉ dùng để test */}
        <div style={{ borderTop: '1px dashed #ddd', paddingTop: '15px', marginBottom: '10px' }}>
          <p style={{ fontSize: '0.75rem', color: '#bbb', textAlign: 'center', marginBottom: '8px' }}>Dành cho Demo</p>
          <button 
            onClick={async () => {
              await fetch('/api/orders/payment-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: 'success' })
              });
            }}
            style={{ width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            [Demo] Giả lập đã nhận tiền
          </button>
        </div>

        <button 
          onClick={handleCancel}
          style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#999', border: 'none', fontSize: '0.88rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Hủy giao dịch
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

export default function MockGateway() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải cổng thanh toán...</div>}>
      <GatewayContent />
    </Suspense>
  );
}
