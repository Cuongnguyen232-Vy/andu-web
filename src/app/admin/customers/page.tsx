import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import DeleteUserButton from '@/components/admin/DeleteUserButton';

export const dynamic = 'force-dynamic';

async function deleteUser(formData: FormData) {
  'use server';
  const userId = formData.get('userId') as string;
  // Không cho phép xóa admin
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === 'admin') return;
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath('/admin/customers');
}

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Đếm số đơn hàng cho mỗi user (qua email)
  const orderCounts = await prisma.order.groupBy({
    by: ['customerPhone'],
    _count: { id: true },
    _sum: { totalAmount: true }
  });

  return (
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#135c41', fontWeight: 700 }}>Tài khoản Khách hàng</h1>
        <span style={{ fontSize: '0.9rem', color: '#888' }}>Tổng: {users.length} tài khoản</span>
      </div>

      {/* Thống kê nhanh */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f0faf5', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '0 0 5px' }}>{users.filter(u => u.role === 'admin').length}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Quản trị viên</span>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f0f7ff', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#004085', margin: '0 0 5px' }}>{users.filter(u => u.role === 'user').length}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Khách hàng</span>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff8f0', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#856404', margin: '0 0 5px' }}>{orderCounts.length}</p>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Khách đã đặt hàng</span>
        </div>
      </div>

      {/* Bảng danh sách */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '14px 10px', fontSize: '0.85rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Tài khoản</th>
            <th style={{ padding: '14px 10px', fontSize: '0.85rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>
            <th style={{ padding: '14px 10px', fontSize: '0.85rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Vai trò</th>
            <th style={{ padding: '14px 10px', fontSize: '0.85rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Ngày tạo</th>
            <th style={{ padding: '14px 10px', fontSize: '0.85rem', color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '14px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: user.role === 'admin' ? 'var(--primary)' : '#e0e0e0', color: user.role === 'admin' ? '#fff' : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, color: '#222', fontSize: '0.95rem' }}>{user.name}</span>
                </div>
              </td>
              <td style={{ padding: '14px 10px', fontSize: '0.9rem', color: '#555' }}>{user.email}</td>
              <td style={{ padding: '14px 10px' }}>
                <span style={{ 
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                  backgroundColor: user.role === 'admin' ? '#d4edda' : '#e2e3e5',
                  color: user.role === 'admin' ? '#155724' : '#383d41'
                }}>
                  {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                </span>
              </td>
              <td style={{ padding: '14px 10px', fontSize: '0.9rem', color: '#888' }}>
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </td>
              <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                {user.role !== 'admin' ? (
                  <form action={deleteUser} style={{ display: 'inline' }}>
                    <input type="hidden" name="userId" value={user.id} />
                    <DeleteUserButton userName={user.name} />
                  </form>
                ) : (
                  <span style={{ fontSize: '0.82rem', color: '#aaa', fontStyle: 'italic' }}>Bảo vệ</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
