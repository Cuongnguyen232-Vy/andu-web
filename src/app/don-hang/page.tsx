import Header from '@/components/Header';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'andu-eyewear-secret-key-2026');

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'Chờ xác nhận', bg: '#fff3cd', color: '#856404' },
  confirmed:  { label: 'Đã xác nhận', bg: '#cce5ff', color: '#004085' },
  processing: { label: 'Đang xử lý',  bg: '#d1ecf1', color: '#0c5460' },
  shipping:   { label: 'Đang giao',    bg: '#e2e3e5', color: '#383d41' },
  completed:  { label: 'Hoàn thành',   bg: '#d4edda', color: '#155724' },
  cancelled:  { label: 'Đã hủy',       bg: '#f8d7da', color: '#721c24' },
};

export default async function OrderHistoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('andu-token')?.value;
  
  let user = null;
  let orders: any[] = [];

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = await prisma.user.findUnique({ where: { id: payload.id as string } });
      
      if (user) {
        orders = await prisma.order.findMany({
          // Giả định đơn hàng có thể map qua số điện thoại hoặc email (hiện tại schema Order có customerPhone)
          where: { 
            customerPhone: user.phone || 'UNKNOWN' // Tạm dùng điện thoại, hoặc nếu bạn có trường userId thì dùng userId.
          },
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { product: true } } }
        });
      }
    } catch (e) {
      // Token lỗi
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', paddingBottom: '100px' }}>
      <Header />
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '150px', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '30px', textAlign: 'center', textTransform: 'uppercase' }}>
          Đơn hàng của tôi
        </h1>

        {!user ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
            <Link href="/dang-nhap" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: 'var(--primary)', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: 600 }}>
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '20px' }}>Bạn chưa có đơn hàng nào.</p>
                <Link href="/products" style={{ display: 'inline-block', padding: '12px 30px', backgroundColor: 'var(--primary)', color: '#fff', textDecoration: 'none', borderRadius: '30px', fontWeight: 600 }}>
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.map(order => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
                  return (
                    <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px', marginBottom: '15px' }}>
                        <div>
                          <p style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#888' }}>Mã đơn: <strong style={{ color: '#333' }}>#{order.id.slice(0, 8).toUpperCase()}</strong></p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN')}</p>
                        </div>
                        <span style={{ padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {order.items.map((item: any) => (
                          <div key={item.id} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '60px', backgroundColor: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                              <img src={item.image || '/assets/product1.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: '0 0 5px', fontSize: '1rem', color: '#333' }}>{item.name}</h4>
                              <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>x{item.quantity}</p>
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '15px', marginTop: '15px' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Địa chỉ giao hàng: <strong style={{ color: '#333' }}>{order.shippingAddress}</strong></p>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: '#333' }}>Tổng thanh toán: <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{order.totalAmount.toLocaleString('vi-VN')}₫</strong></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
