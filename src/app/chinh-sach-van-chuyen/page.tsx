'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ShippingPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '140px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
        
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          {' / '}
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Chính sách vận chuyển</span>
        </p>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#135c41', marginBottom: '30px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Chính Sách Vận Chuyển
          </h1>

          <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8 }}>
            
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              1. Bảng phí vận chuyển
            </h2>
            
            <div style={{ overflowX: 'auto', margin: '15px 0 25px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#135c41', color: '#fff' }}>
                    <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 600 }}>Khu vực</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600 }}>Phí ship</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600 }}>Thời gian giao</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { area: 'Nội thành Hà Nội', fee: 'MIỄN PHÍ', time: '1-2 ngày', highlight: true },
                    { area: 'Nội thành TP.HCM', fee: 'MIỄN PHÍ', time: '2-3 ngày', highlight: true },
                    { area: 'Các tỉnh lân cận HN (Bắc Ninh, Hưng Yên, Hải Dương, HP...)', fee: '15.000đ', time: '2-3 ngày', highlight: false },
                    { area: 'Các tỉnh lân cận HCM (Bình Dương, Đồng Nai, Long An...)', fee: '15.000đ', time: '2-3 ngày', highlight: false },
                    { area: 'Các tỉnh/thành khác trên toàn quốc', fee: '30.000đ', time: '3-5 ngày', highlight: false },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee', backgroundColor: row.highlight ? '#f0faf5' : i % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 500 }}>{row.area}</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: row.highlight ? '#135c41' : '#222' }}>{row.fee}</td>
                      <td style={{ padding: '14px 18px', textAlign: 'center', color: '#666' }}>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              2. Đơn vị vận chuyển
            </h2>
            <p>Andu hợp tác với các đơn vị giao hàng uy tín:</p>
            <ul style={{ paddingLeft: '24px', margin: '10px 0 20px' }}>
              <li style={{ marginBottom: '8px' }}><strong>Giao Hàng Nhanh (GHN)</strong> - Nội thành HN & HCM</li>
              <li style={{ marginBottom: '8px' }}><strong>Giao Hàng Tiết Kiệm (GHTK)</strong> - Toàn quốc</li>
              <li style={{ marginBottom: '8px' }}><strong>J&T Express</strong> - Toàn quốc</li>
            </ul>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              3. Theo dõi đơn hàng
            </h2>
            <p>Sau khi đơn hàng được giao cho đơn vị vận chuyển, bạn sẽ nhận được <strong>mã tracking</strong> qua SMS hoặc Zalo để theo dõi trạng thái giao hàng.</p>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              4. Lưu ý khi nhận hàng
            </h2>
            <ul style={{ paddingLeft: '24px', margin: '10px 0 20px' }}>
              <li style={{ marginBottom: '8px' }}>Kiểm tra bao bì bên ngoài trước khi ký nhận</li>
              <li style={{ marginBottom: '8px' }}>Quay video khi mở hộp để đảm bảo quyền lợi đổi trả</li>
              <li style={{ marginBottom: '8px' }}>Liên hệ ngay Hotline nếu sản phẩm bị hư hỏng trong quá trình vận chuyển</li>
            </ul>

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#135c41' }}>
                📦 Thắc mắc về vận chuyển? Liên hệ: <strong>0365 250 826</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
