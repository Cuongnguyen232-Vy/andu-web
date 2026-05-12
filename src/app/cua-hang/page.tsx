import Header from '@/components/Header';
import Link from 'next/link';

export default function CuaHangPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <Header />
      <div style={{ padding: '140px 5% 80px', maxWidth: '1200px', margin: '0 auto' }}>
<h1 className="cua-hang-title">
          HỆ THỐNG CỬA HÀNG
        </h1>

        <div className="cua-hang-grid">
          {/* Thông tin cửa hàng */}
          <div>
            <div style={{ background: '#f8f8f8', borderRadius: '16px', padding: '35px', marginBottom: '25px', borderLeft: '4px solid var(--primary)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px' }}>
                📍 Kính Mắt AnDu — Chùa Láng
              </h2>
              <p style={{ marginBottom: '12px', color: '#555', lineHeight: '1.7' }}>
                <strong>Địa chỉ:</strong> 36 Chùa Láng, Đống Đa, Hà Nội
              </p>
              <p style={{ marginBottom: '12px', color: '#555' }}>
                <strong>Điện thoại:</strong>{' '}
                <a href="tel:0812274744" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>081 227 4744</a>
              </p>
              <p style={{ marginBottom: '12px', color: '#555' }}>
                <strong>Giờ mở cửa:</strong> 09:00 – 21:00 (Thứ 2 – Chủ nhật)
              </p>
              <p style={{ marginBottom: '20px', color: '#555' }}>
                <strong>Email:</strong> cskh@kinhmatandu.com
              </p>
              <a
                href="https://maps.app.goo.gl/erkMyUBQk3zwNmHy8"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', backgroundColor: 'var(--primary)', color: 'white', padding: '12px 25px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.3s' }}
              >
                🗺 Xem đường đi
              </a>
            </div>

            {/* Dịch vụ */}
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '16px', padding: '30px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#222', marginBottom: '20px' }}>Dịch vụ tại cửa hàng</h3>
              {[
                '✅ Đo mắt & tư vấn kính miễn phí',
                '✅ Cắt tròng kính trong ngày',
                '✅ Bảo hành kính tại chỗ',
                '✅ Điều chỉnh gọng kính miễn phí',
                '✅ Kiểm tra thị lực định kỳ',
              ].map((item, i) => (
                <p key={i} style={{ marginBottom: '10px', color: '#555', fontSize: '1rem' }}>{item}</p>
              ))}
            </div>
          </div>

          {/* Bản đồ Google Maps nhúng */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2355826649673!2d105.80291328046988!3d21.02325773803047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab687674f103%3A0x51a689b23f4727fa!2zMzYgUC4gQ2jDuWEgTMOhbmcsIEzDoW5nLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1778293426905!5m2!1svi!2s"
              width="100%"
              height="480"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .cua-hang-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 50px;
        }
        .cua-hang-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .cua-hang-title {
            font-size: 1.8rem;
            margin-bottom: 30px;
          }
          .cua-hang-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}} />
    </main>
  );
}
