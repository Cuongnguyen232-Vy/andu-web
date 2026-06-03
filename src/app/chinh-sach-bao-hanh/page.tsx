'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function WarrantyPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '140px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>

        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          {' / '}
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Chính sách bảo hành & đổi trả</span>
        </p>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#135c41', marginBottom: '30px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Chính Sách Bảo Hành & Đổi Trả
          </h1>

          <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8 }}>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              1. Chính sách bảo hành
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '15px 0 25px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f0faf5', borderRadius: '10px', border: '1px solid #c3e6cb' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#135c41', margin: '0 0 10px' }}>🔧 Gọng kính</h3>
                <ul style={{ paddingLeft: '18px', margin: 0 }}>
                  <li>Bảo hành <strong>trọn đời</strong> về lỗi kỹ thuật</li>
                  <li>Chỉnh sửa, tháo lắp miễn phí</li>
                  <li>Hỗ trợ <strong>50% chi phí</strong> nếu gãy/hỏng do sử dụng</li>
                </ul>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f0f4ff', borderRadius: '10px', border: '1px solid #c3d6e8' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a56db', margin: '0 0 10px' }}>👓 Tròng kính</h3>
                <ul style={{ paddingLeft: '18px', margin: 0 }}>
                  <li>Bảo hành <strong>12 tháng</strong> lỗi nhà sản xuất</li>
                  <li>Bong tróc lớp phủ, sai số đo: Đổi mới miễn phí</li>
                  <li>Kiểm tra mắt lại miễn phí trọn đời</li>
                </ul>
              </div>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              2. Chính sách đổi trả
            </h2>
            <ul style={{ paddingLeft: '24px', margin: '10px 0 20px' }}>
              <li style={{ marginBottom: '12px' }}>Đổi trả <strong>miễn phí trong 7 ngày</strong> kể từ ngày nhận hàng nếu sản phẩm còn nguyên tem, nhãn, chưa qua sử dụng.</li>
              <li style={{ marginBottom: '12px' }}>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất: <strong>Đổi mới 100%</strong> hoặc hoàn tiền.</li>
              <li style={{ marginBottom: '12px' }}>Tròng kính cắt theo đơn: <strong>Không áp dụng đổi trả</strong> (trừ trường hợp lỗi nhà sản xuất).</li>
              <li style={{ marginBottom: '12px' }}>Kính râm, phụ kiện: Đổi size, đổi màu trong <strong>7 ngày</strong> nếu còn nguyên trạng.</li>
            </ul>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              3. Quy trình đổi trả
            </h2>
            <div style={{ display: 'flex', gap: '15px', margin: '15px 0 25px', flexWrap: 'wrap' }}>
              {[
                { step: '1', title: 'Liên hệ', desc: 'Gọi Hotline 0365 250 826 hoặc nhắn Zalo' },
                { step: '2', title: 'Gửi hàng', desc: 'Gửi sản phẩm về cửa hàng Andu' },
                { step: '3', title: 'Xác nhận', desc: 'Kiểm tra và xác nhận trong 24h' },
                { step: '4', title: 'Hoàn tất', desc: 'Đổi mới hoặc hoàn tiền trong 3-5 ngày' },
              ].map(item => (
                <div key={item.step} style={{ flex: '1 1 200px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '10px', textAlign: 'center', border: '1px solid #eee' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#135c41', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 700 }}>{item.step}</div>
                  <h4 style={{ margin: '0 0 5px', fontSize: '0.95rem', fontWeight: 700, color: '#222' }}>{item.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#666' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              4. Trường hợp không áp dụng đổi trả
            </h2>
            <ul style={{ paddingLeft: '24px', margin: '10px 0 20px' }}>
              <li style={{ marginBottom: '8px' }}>Sản phẩm đã qua sử dụng, bị trầy xước, biến dạng do người dùng</li>
              <li style={{ marginBottom: '8px' }}>Sản phẩm không còn tem, nhãn, hộp đựng</li>
              <li style={{ marginBottom: '8px' }}>Quá 7 ngày kể từ ngày nhận hàng</li>
              <li style={{ marginBottom: '8px' }}>Sản phẩm trong chương trình khuyến mãi/giảm giá đặc biệt (có ghi chú riêng)</li>
            </ul>

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#135c41' }}>
                📞 Hotline bảo hành: <strong>0365 250 826</strong> | Zalo hỗ trợ 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
