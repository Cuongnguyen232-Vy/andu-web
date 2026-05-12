import prisma from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import PrintOrderButton from '@/components/admin/PrintOrderButton';

export const dynamic = 'force-dynamic';

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'Chờ xác nhận', bg: '#fff3cd', color: '#856404' },
  confirmed:  { label: 'Đã xác nhận', bg: '#cce5ff', color: '#004085' },
  processing: { label: 'Đang xử lý',  bg: '#d1ecf1', color: '#0c5460' },
  shipping:   { label: 'Đang giao',    bg: '#e2e3e5', color: '#383d41' },
  completed:  { label: 'Hoàn thành',   bg: '#d4edda', color: '#155724' },
  cancelled:  { label: 'Đã hủy',       bg: '#f8d7da', color: '#721c24' },
};

const STATUS_FLOW: Record<string, string[]> = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['processing', 'cancelled'],
  processing: ['shipping'],
  shipping:   ['completed'],
  completed:  [],
  cancelled:  [],
};

async function updateOrderStatus(formData: FormData) {
  'use server';
  const orderId = formData.get('orderId') as string;
  const newStatus = formData.get('newStatus') as string;
  
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });
  
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const currentStatus = params.status || 'all';

  let where = {};
  if (currentStatus !== 'all') {
    where = { status: currentStatus };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#135c41', fontWeight: 700 }}>Quản lý Đơn hàng</h1>
        <span style={{ fontSize: '0.9rem', color: '#888' }}>Tổng: {orders.length} đơn hàng</span>
      </div>

      {/* Tabs Bộ lọc trạng thái */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px', overflowX: 'auto' }}>
        <Link 
          href="/admin/orders" 
          style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', backgroundColor: currentStatus === 'all' ? '#135c41' : '#f5f5f5', color: currentStatus === 'all' ? '#fff' : '#666' }}
        >
          Tất cả
        </Link>
        {Object.entries(STATUS_MAP).map(([key, info]) => (
          <Link 
            key={key}
            href={`/admin/orders?status=${key}`} 
            style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', backgroundColor: currentStatus === key ? info.bg : '#f5f5f5', color: currentStatus === key ? info.color : '#666', border: currentStatus === key ? `1px solid ${info.color}` : '1px solid transparent' }}
          >
            {info.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <p style={{ fontSize: '1.1rem' }}>Chưa có đơn hàng nào</p>
          <p style={{ fontSize: '0.9rem' }}>Khi khách hàng đặt hàng, đơn sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
            const nextStatuses = STATUS_FLOW[order.status] || [];
            
            return (
              <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}>
                {/* Header đơn hàng */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', alignItems: 'center', padding: '18px 24px', backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Mã đơn</span>
                    <strong style={{ color: '#222', fontSize: '0.95rem' }}>#{order.id.slice(0, 8).toUpperCase()}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Khách hàng</span>
                    <p style={{ fontWeight: 600, color: '#222', margin: 0, fontSize: '0.95rem' }}>{order.customerName}</p>
                    <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>{order.customerPhone}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Tổng tiền</span>
                    <span style={{ fontWeight: 700, color: '#ff6b00', fontSize: '1.05rem' }}>{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Trạng thái</span>
                    <span style={{ padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color, display: 'inline-block' }}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>Ngày đặt</span>
                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#aaa', display: 'block' }}>
                      {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                
                {/* Chi tiết đơn hàng */}
                <div style={{ padding: '18px 24px' }}>
                  {/* Danh sách sản phẩm */}
                  <div style={{ marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>Sản phẩm ({order.items.length})</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((item: any) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#eee', position: 'relative', flexShrink: 0 }}>
                              <img src={item.image || '/assets/product1.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: 500 }}>{item.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#888' }}>x{item.quantity}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#222', minWidth: '100px', textAlign: 'right' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Thông tin giao hàng + Hành động */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                    <div style={{ fontSize: '0.88rem', color: '#666' }}>
                      <strong style={{ color: '#444' }}>Địa chỉ:</strong> {order.shippingAddress}
                      {order.notes && <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#999' }}><em>Ghi chú: {order.notes}</em></p>}
                    </div>
                    
                    {/* Nút chuyển trạng thái */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      {nextStatuses.map(nextStatus => {
                        const nextInfo = STATUS_MAP[nextStatus];
                        const isCancel = nextStatus === 'cancelled';
                        return (
                          <form key={nextStatus} action={updateOrderStatus}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <input type="hidden" name="newStatus" value={nextStatus} />
                            <button 
                              type="submit" 
                              style={{ 
                                padding: '8px 18px', 
                                backgroundColor: isCancel ? '#fff' : 'var(--primary)', 
                                color: isCancel ? '#dc3545' : 'white', 
                                border: isCancel ? '1px solid #dc3545' : 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontSize: '0.85rem', 
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {isCancel ? '✕ Hủy đơn' : `→ ${nextInfo.label}`}
                            </button>
                          </form>
                        );
                      })}
                      {nextStatuses.length === 0 && (
                        <span style={{ fontSize: '0.85rem', color: '#aaa', fontStyle: 'italic', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                          {order.status === 'completed' ? '✓ Đã hoàn tất' : '✕ Đã hủy'}
                        </span>
                      )}
                      
                      {/* Nút In Phiếu Giao Hàng */}
                      <PrintOrderButton order={order} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
