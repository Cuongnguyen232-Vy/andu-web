'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Link from 'next/link';

function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'fail' | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
    const vnp_TxnRef = searchParams.get('vnp_TxnRef');
    
    if (!vnp_ResponseCode || !vnp_TxnRef) {
      setLoading(false);
      return;
    }

    setOrderId(vnp_TxnRef);

    const updateOrder = async () => {
      try {
        if (vnp_ResponseCode === '00') {
          // Giao dịch thành công
          await fetch('/api/orders/payment-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: vnp_TxnRef, status: 'success' })
          });
          clearCart();
          setStatus('success');
        } else {
          // Giao dịch thất bại
          await fetch('/api/orders/payment-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: vnp_TxnRef, status: 'fail' })
          });
          setStatus('fail');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    updateOrder();
  }, [searchParams, clearCart]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', paddingBottom: '80px' }}>
      <Header />
      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '140px', paddingLeft: '20px', paddingRight: '20px', textAlign: 'center' }}>
        
        {loading ? (
          <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
            <h2 style={{ color: '#222' }}>Đang xác thực giao dịch VNPay...</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>Vui lòng không đóng trình duyệt.</p>
          </div>
        ) : status === 'success' ? (
          <div style={{ padding: '50px 30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#28a745', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px', fontWeight: 700 }}>✓</div>
            <h1 style={{ fontSize: '1.8rem', color: '#222', marginBottom: '15px' }}>THANH TOÁN VNPay THÀNH CÔNG!</h1>
            <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '30px' }}>Đơn hàng <strong>#{orderId?.slice(0,8).toUpperCase()}</strong> của bạn đã được ghi nhận.</p>
            <Link href="/" style={{ display: 'inline-block', padding: '14px 40px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '30px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div style={{ padding: '50px 30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#dc3545', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px', fontWeight: 700 }}>✕</div>
            <h1 style={{ fontSize: '1.8rem', color: '#222', marginBottom: '15px' }}>GIAO DỊCH THẤT BẠI HOẶC ĐÃ HỦY</h1>
            <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '30px' }}>Bạn chưa hoàn tất thanh toán VNPay. Đơn hàng <strong>#{orderId?.slice(0,8).toUpperCase()}</strong> đã bị hủy.</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link href="/cart" style={{ padding: '12px 30px', border: '2px solid var(--primary)', color: 'var(--primary)', borderRadius: '30px', fontWeight: 600, textDecoration: 'none' }}>Quay lại Giỏ hàng</Link>
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={<div>Đang tải kết quả VNPay...</div>}>
      <VNPayReturnContent />
    </Suspense>
  );
}
