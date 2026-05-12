'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId || !status) {
      setError('Thông tin trả về không hợp lệ.');
      setLoading(false);
      return;
    }

    const updateOrder = async () => {
      try {
        const res = await fetch('/api/orders/payment-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status })
        });
        
        if (!res.ok) {
          throw new Error('Không thể cập nhật trạng thái đơn hàng');
        }

        if (status === 'success') {
          clearCart(); // Xóa giỏ hàng nếu thanh toán thành công
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    updateOrder();
  }, [orderId, status, clearCart]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f7fa', paddingBottom: '80px' }}>
      <Header />
      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '140px', paddingLeft: '20px', paddingRight: '20px', textAlign: 'center' }}>
        
        {loading ? (
          <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
            <h2>Đang xử lý kết quả giao dịch...</h2>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Lỗi xử lý</h2>
            <p>{error}</p>
            <Link href="/" style={{ display: 'inline-block', marginTop: '20px', color: 'var(--primary)', fontWeight: 600 }}>Về trang chủ</Link>
          </div>
        ) : status === 'success' ? (
          <div style={{ padding: '50px 30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#28a745', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px', fontWeight: 700 }}>✓</div>
            <h1 style={{ fontSize: '1.8rem', color: '#222', marginBottom: '15px' }}>THANH TOÁN THÀNH CÔNG!</h1>
            <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '30px' }}>Đơn hàng <strong>#{orderId?.slice(0,8).toUpperCase()}</strong> của bạn đã được ghi nhận và thanh toán.</p>
            <Link href="/" style={{ display: 'inline-block', padding: '14px 40px', backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '30px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div style={{ padding: '50px 30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#dc3545', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px', fontWeight: 700 }}>✕</div>
            <h1 style={{ fontSize: '1.8rem', color: '#222', marginBottom: '15px' }}>THANH TOÁN THẤT BẠI</h1>
            <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '30px' }}>Đơn hàng <strong>#{orderId?.slice(0,8).toUpperCase()}</strong> của bạn chưa được thanh toán thành công. Đơn hàng đã bị hủy.</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link href="/cart" style={{ padding: '12px 30px', border: '2px solid var(--primary)', color: 'var(--primary)', borderRadius: '30px', fontWeight: 600, textDecoration: 'none' }}>Quay lại Giỏ hàng</Link>
            </div>
          </div>
        )}
        
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ResultContent />
    </Suspense>
  );
}
