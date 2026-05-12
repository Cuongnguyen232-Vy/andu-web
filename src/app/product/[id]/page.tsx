import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import ColorPicker from './ColorPicker';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id }
  });
}



export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Parse images array
  let imagesList: string[] = [];
  try { imagesList = product.images ? JSON.parse(product.images) : []; } catch(e) {}
  if (imagesList.length === 0) imagesList = [product.image || '/assets/product1.png'];

  // Colors sẽ được parse bên trong ColorPicker component
  const colorsRaw = (product as any).colors || '[]';

  // Lấy sản phẩm liên quan
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  // Khuyến mãi
  let promos = [
    "Tặng hộp kính da cao cấp và khăn lau kính chuyên dụng",
    "Miễn phí đo mắt và kiểm tra thị lực tại cửa hàng",
    "Bảo hành ốc vít, đệm mũi, nắn chỉnh gọng kính trọn đời",
    "Giao hàng hỏa tốc trong 2h tại nội thành"
  ];
  if ((product as any).promos) {
    promos = (product as any).promos.split('\n').filter((p: string) => p.trim() !== '');
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fff', paddingBottom: '100px' }}>
      <Header />
      <div className="product-detail-container">
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '30px' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link> /{' '}
          <Link href={`/${product.category === 'Kính râm' ? 'kinh-ram' : product.category === 'Tròng kính' ? 'trong-kinh' : 'gong-kinh'}`} style={{ color: '#888', textDecoration: 'none' }}>
            {product.category}
          </Link> /{' '}
          <span style={{ color: 'var(--primary)' }}>{product.name}</span>
        </p>

        <div className="product-detail-grid">
          {/* Cột ảnh sản phẩm - Gallery */}
          <ProductGallery images={imagesList} productName={product.name} />

          {/* Cột thông tin sản phẩm */}
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#222', marginBottom: '10px', lineHeight: 1.3 }}>
              {product.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', marginBottom: '25px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
                {Number(product.price).toLocaleString('vi-VN')}₫
              </span>
              
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: '1.2rem', color: '#999', textDecoration: 'line-through', fontWeight: 500, lineHeight: 1.2 }}>
                    {Number(product.originalPrice).toLocaleString('vi-VN')}₫
                  </span>
                  <span style={{ backgroundColor: '#ff3333', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1 }}>
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Chọn màu sắc */}
            <ColorPicker colors={colorsRaw} />
            
            <div style={{ padding: '20px', backgroundColor: '#f8fdfa', border: '1px solid #e3f2ea', borderRadius: '10px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '15px', textTransform: 'uppercase' }}>
                🎁 Ưu đãi đặc biệt
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {promos.map((p, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', fontSize: '0.95rem', color: '#444' }}>
                    <span style={{ color: 'var(--primary)' }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#333', marginBottom: '10px' }}>Thông số kỹ thuật:</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 0', color: '#666', width: '150px' }}>Danh mục</td>
                    <td style={{ padding: '12px 0', fontWeight: 500, color: '#222' }}>{product.category}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 0', color: '#666' }}>Tình trạng</td>
                    <td style={{ padding: '12px 0', fontWeight: 500, color: '#222' }}>
                      {product.stock > 0 ? <span style={{ color: 'green' }}>Còn hàng ({product.stock})</span> : <span style={{ color: 'red' }}>Hết hàng</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AddToCartButton product={product} />

            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                Mô tả chi tiết
              </h3>
              <p style={{ lineHeight: 1.7, color: '#555', fontSize: '1rem' }}>
                {product.description || 'Đang cập nhật mô tả cho sản phẩm này. Sản phẩm chính hãng bảo hành 1 năm. Thiết kế hiện đại, chất liệu cao cấp mang lại sự thoải mái tối đa cho người sử dụng.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '80px', borderTop: '1px solid #eee', paddingTop: '50px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#222', marginBottom: '30px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Có thể bạn cũng thích
            </h2>
          <div className="related-grid">
            {relatedProducts.map(rp => (
              <div key={rp.id} style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <ProductCard product={rp} />
              </div>
            ))}
          </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-card:hover { transform: translateY(-8px); box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }
        
        .product-detail-container {
          max-width: 1200px; margin: 0 auto; padding-top: 140px; padding-left: 40px; padding-right: 40px;
        }
        .product-detail-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px;
        }
        .related-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px 30px;
        }

        @media (max-width: 768px) {
          .product-detail-container {
            padding-top: 100px;
            padding-left: 15px;
            padding-right: 15px;
          }
          .product-detail-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
        }
      `}} />
    </main>
  );
}
