'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PaymentPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '140px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
        
        {/* Breadcrumb */}
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
          {' / '}
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Chính sách thanh toán</span>
        </p>

        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#135c41', marginBottom: '30px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Chính Sách Thanh Toán
          </h1>

          <div style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8 }}>
            
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              1. Phương thức thanh toán
            </h2>
            <p>Andu Eyewear hỗ trợ các phương thức thanh toán sau:</p>
            <ul style={{ paddingLeft: '24px', margin: '10px 0 20px' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>💵 Thanh toán khi nhận hàng (COD):</strong> Quý khách kiểm tra sản phẩm trước khi thanh toán. Áp dụng cho đơn hàng mua gọng kính, kính râm, phụ kiện.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>🏦 Chuyển khoản ngân hàng:</strong> Quý khách chuyển khoản trước theo thông tin tài khoản bên dưới. Đơn hàng sẽ được xử lý ngay sau khi xác nhận thanh toán.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>📱 Ví điện tử MoMo:</strong> Quét mã QR thanh toán qua ứng dụng MoMo.
              </li>
              <li style={{ marginBottom: '12px' }}>
                <strong>💳 VNPay:</strong> Thanh toán qua thẻ ATM nội địa, Visa, MasterCard hoặc quét QR Code qua cổng VNPay.
              </li>
            </ul>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              2. Thông tin chuyển khoản
            </h2>
            <div style={{ backgroundColor: '#f0faf5', padding: '20px 25px', borderRadius: '10px', border: '1px solid #c3e6cb', margin: '15px 0' }}>
              <p style={{ margin: '6px 0' }}>🏦 Ngân hàng: <strong>Vietcombank (VCB)</strong></p>
              <p style={{ margin: '6px 0' }}>📄 Số tài khoản: <strong>0123456789</strong></p>
              <p style={{ margin: '6px 0' }}>👤 Chủ tài khoản: <strong>NGUYEN MANH CUONG</strong></p>
              <p style={{ margin: '6px 0' }}>📝 Nội dung CK: <strong>ANDU + [Số điện thoại của bạn]</strong></p>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              3. Quy định đặt cọc
            </h2>
            <ul style={{ paddingLeft: '24px', margin: '10px 0 20px' }}>
              <li style={{ marginBottom: '10px' }}>Đơn hàng <strong>mua gọng kính, kính râm, phụ kiện</strong>: Không cần đặt cọc, thanh toán COD khi nhận hàng.</li>
              <li style={{ marginBottom: '10px' }}>Đơn hàng <strong>cắt tròng kính theo đơn</strong>: Đặt cọc <strong>50%</strong> giá trị tròng kính trước khi gia công.</li>
              <li style={{ marginBottom: '10px' }}>Đơn hàng <strong>kính đặc biệt theo yêu cầu</strong>: Đặt cọc <strong>100%</strong> trước khi sản xuất.</li>
            </ul>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              4. Xác nhận đơn hàng
            </h2>
            <p>Sau khi đặt hàng thành công, nhân viên Andu sẽ liên hệ qua <strong>số điện thoại</strong> của bạn trong vòng <strong>30 phút</strong> (giờ hành chính) để xác nhận đơn hàng và thời gian giao hàng dự kiến.</p>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#222', marginTop: '30px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #e8f5e9' }}>
              5. Hoá đơn
            </h2>
            <p>Andu Eyewear cung cấp hoá đơn bán lẻ kèm theo mỗi đơn hàng. Nếu quý khách cần xuất hoá đơn VAT, vui lòng ghi chú trong đơn hàng hoặc liên hệ hotline <strong>0365 250 826</strong>.</p>

            <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '10px', border: '1px solid #ffc107', textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#856404' }}>
                Mọi thắc mắc về thanh toán, vui lòng liên hệ Hotline: <strong>0365 250 826</strong> hoặc Zalo để được hỗ trợ nhanh nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
