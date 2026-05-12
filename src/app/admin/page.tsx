import styles from './page.module.css';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import DashboardCharts from '@/components/admin/DashboardCharts';

export const dynamic = 'force-dynamic';

const STATUS_MAP: Record<string, { label: string; badgeClass: string }> = {
  pending:    { label: 'Chờ xác nhận', badgeClass: 'badgePending' },
  confirmed:  { label: 'Đã xác nhận', badgeClass: 'badgeShipping' },
  processing: { label: 'Đang xử lý',  badgeClass: 'badgeShipping' },
  shipping:   { label: 'Đang giao',    badgeClass: 'badgeShipping' },
  completed:  { label: 'Hoàn thành',   badgeClass: 'badgeSuccess' },
  cancelled:  { label: 'Đã hủy',       badgeClass: 'badgePending' },
};

export default async function AdminDashboard() {
  // 1. Doanh thu = CHỈ tính đơn hàng đã HOÀN THÀNH (completed)
  const completedRevenueResult = await prisma.order.aggregate({
    where: { status: 'completed' },
    _sum: { totalAmount: true }
  });
  const completedRevenue = completedRevenueResult._sum.totalAmount || 0;

  // 2. Tổng giá trị đơn đang chờ xử lý (pending + confirmed + processing + shipping)
  const pendingRevenueResult = await prisma.order.aggregate({
    where: { status: { in: ['pending', 'confirmed', 'processing', 'shipping'] } },
    _sum: { totalAmount: true }
  });
  const pendingRevenue = pendingRevenueResult._sum.totalAmount || 0;

  // 3. Đếm đơn hàng theo trạng thái
  const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
  const confirmedOrders = await prisma.order.count({ where: { status: 'confirmed' } });
  const processingOrders = await prisma.order.count({ where: { status: 'processing' } });
  const shippingOrders = await prisma.order.count({ where: { status: 'shipping' } });
  const completedOrders = await prisma.order.count({ where: { status: 'completed' } });
  const cancelledOrders = await prisma.order.count({ where: { status: 'cancelled' } });
  const totalOrders = await prisma.order.count();

  // Đơn cần xử lý = chưa hoàn thành và chưa hủy
  const activeOrders = pendingOrders + confirmedOrders + processingOrders + shippingOrders;

  // 4. Sản phẩm
  const totalProducts = await prisma.product.count();
  const outOfStockProducts = await prisma.product.count({ where: { stock: { lte: 0 } } });

  // 5. Đơn hàng mới nhất (5 đơn)
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // 6. Dữ liệu biểu đồ doanh thu 7 ngày qua
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      dateStr: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      DoanhThu: 0,
      DonHang: 0
    };
  }).reverse();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 ngày bao gồm hôm nay
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentOrdersData = await prisma.order.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true, totalAmount: true, status: true }
  });

  recentOrdersData.forEach(order => {
    const dStr = new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const dayData = last7Days.find(d => d.dateStr === dStr);
    if (dayData) {
      dayData.DonHang += 1;
      // Chỉ tính doanh thu đơn hoàn thành (hoặc bạn có thể tính cả đơn đang xử lý)
      if (order.status === 'completed') {
        dayData.DoanhThu += order.totalAmount;
      }
    }
  });

  const revenueData = last7Days.map(d => ({ date: d.dateStr, DoanhThu: d.DoanhThu, DonHang: d.DonHang }));

  // 7. Top 5 sản phẩm bán chạy
  const topSellingRaw = await prisma.orderItem.groupBy({
    by: ['name'],
    _sum: { quantity: true },
    where: {
      order: {
        status: { not: 'cancelled' } // Không tính đơn hủy
      }
    },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5
  });

  const topProducts = topSellingRaw.map(item => ({
    name: item.name,
    quantity: item._sum.quantity || 0
  }));

  return (
    <div>
      <h1 className={styles.pageTitle}>Tổng quan hệ thống</h1>
      
      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Doanh thu thực</h3>
          <p className={styles.statValue}>{completedRevenue.toLocaleString('vi-VN')}₫</p>
          <span className={`${styles.statTrend} ${styles.trendUp}`}>
            {completedOrders} đơn hoàn thành
          </span>
        </div>
        <div className={styles.statCard}>
          <h3>Doanh thu chờ</h3>
          <p className={styles.statValue}>{pendingRevenue.toLocaleString('vi-VN')}₫</p>
          <span className={`${styles.statTrend} ${activeOrders > 0 ? styles.trendWarning : styles.trendNeutral}`}>
            {activeOrders > 0 ? `${activeOrders} đơn đang xử lý` : 'Không có đơn chờ'}
          </span>
        </div>
        <div className={styles.statCard}>
          <h3>Chờ xác nhận</h3>
          <p className={styles.statValue} style={{ color: pendingOrders > 0 ? '#dc2626' : undefined }}>{pendingOrders}</p>
          <span className={`${styles.statTrend} ${pendingOrders > 0 ? styles.trendWarning : styles.trendNeutral}`}>
            {pendingOrders > 0 ? 'Cần xử lý' : 'Đã xử lý hết'}
          </span>
        </div>
        <div className={styles.statCard}>
          <h3>Sản phẩm</h3>
          <p className={styles.statValue}>{totalProducts}</p>
          <span className={`${styles.statTrend} ${outOfStockProducts > 0 ? styles.trendWarning : styles.trendNeutral}`}>
            {outOfStockProducts > 0 ? `${outOfStockProducts} hết hàng` : 'Kho ổn định'}
          </span>
        </div>
      </div>

      {/* Pipeline */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px 24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1a1f2e' }}>Pipeline đơn hàng</h2>
          <span style={{ fontSize: '0.78rem', color: '#8b8fa3' }}>Tổng: {totalOrders}</span>
        </div>
        <div className={styles.pipelineContainer}>
          {[
            { label: 'Chờ xác nhận', count: pendingOrders, color: '#b45309' },
            { label: 'Đã xác nhận', count: confirmedOrders, color: '#1d4ed8' },
            { label: 'Đang xử lý', count: processingOrders, color: '#0e7490' },
            { label: 'Đang giao', count: shippingOrders, color: '#4b5563' },
            { label: 'Hoàn thành', count: completedOrders, color: '#15803d' },
            { label: 'Đã hủy', count: cancelledOrders, color: '#b91c1c' },
          ].map((item, idx) => (
            <div key={idx} className={styles.pipelineItem} style={{ borderRight: idx < 5 ? '1px solid #e5e7eb' : 'none', backgroundColor: item.count > 0 ? '#fafbfc' : '#fff' }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: item.count > 0 ? item.color : '#d1d5db', margin: '0 0 4px' }}>{item.count}</p>
              <span style={{ fontSize: '0.68rem', color: item.count > 0 ? '#6b7280' : '#d1d5db', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Biểu đồ Thống kê */}
      <DashboardCharts revenueData={revenueData} topProducts={topProducts} />

      {/* Danh sách đơn hàng mới nhất */}
      <div className={styles.recentOrders}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Đơn hàng gần đây</h2>
          <Link href="/admin/orders" style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500, textDecoration: 'none' }}>
            Xem tất cả →
          </Link>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách Hàng</th>
                <th>Ngày Đặt</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Chưa có đơn hàng nào</td>
                </tr>
              ) : (
                recentOrders.map(order => {
                  const statusInfo = STATUS_MAP[order.status as keyof typeof STATUS_MAP] || STATUS_MAP.PENDING;
                  return (
                    <tr key={order.id}>
                      <td><strong>#{order.id.slice(0, 8).toUpperCase()}</strong></td>
                      <td>{order.customerName || 'Khách vãng lai'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{order.totalAmount.toLocaleString('vi-VN')}₫</td>
                      <td>
                        <span className={`${styles.badge} ${styles[statusInfo.badgeClass] || styles.badgePending}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <Link href="/admin/orders" className={styles.actionBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

