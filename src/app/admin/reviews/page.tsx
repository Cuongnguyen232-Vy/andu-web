import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

async function deleteReview(formData: FormData) {
  'use server';
  const reviewId = formData.get('reviewId') as string;
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath('/admin/reviews');
}

async function updateReviewStatus(formData: FormData) {
  'use server';
  const reviewId = formData.get('reviewId') as string;
  const newStatus = formData.get('status') as string;
  await prisma.review.update({
    where: { id: reviewId },
    data: { status: newStatus }
  });
  revalidatePath('/admin/reviews');
}

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { name: true, image: true } },
      user: { select: { name: true, email: true } }
    }
  });

  const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
    pending:  { bg: '#fff3cd', color: '#856404', label: 'Chờ duyệt' },
    approved: { bg: '#d4edda', color: '#155724', label: 'Đã duyệt' },
    hidden:   { bg: '#f8d7da', color: '#721c24', label: 'Đã ẩn' },
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#135c41', fontWeight: 700 }}>Đánh giá & Phản hồi</h1>
        <span style={{ fontSize: '0.9rem', color: '#888' }}>Tổng: {reviews.length} đánh giá</span>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
          <p style={{ fontSize: '3rem', marginBottom: '15px' }}>⭐</p>
          <p style={{ fontSize: '1.1rem' }}>Chưa có đánh giá nào</p>
          <p style={{ fontSize: '0.9rem' }}>Khi khách hàng đánh giá sản phẩm, chúng sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((review) => {
            const statusInfo = STATUS_COLORS[review.status] || STATUS_COLORS.pending;
            return (
              <div key={review.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '20px', transition: 'box-shadow 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#222', margin: 0, fontSize: '0.95rem' }}>{review.userName}</p>
                      <p style={{ fontSize: '0.82rem', color: '#888', margin: '2px 0 0' }}>{review.user?.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#aaa' }}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                {/* Sản phẩm + Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#888' }}>Sản phẩm:</span>
                  <span style={{ fontWeight: 600, color: '#333', fontSize: '0.9rem' }}>{review.product?.name || '—'}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '1rem', color: '#f5a623' }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>

                {/* Nội dung đánh giá */}
                <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6, margin: '12px 0', padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                  "{review.comment}"
                </p>

                {/* Hành động */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {review.status !== 'approved' && (
                    <form action={updateReviewStatus}>
                      <input type="hidden" name="reviewId" value={review.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button type="submit" style={{ padding: '6px 16px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                        ✓ Duyệt
                      </button>
                    </form>
                  )}
                  {review.status !== 'hidden' && (
                    <form action={updateReviewStatus}>
                      <input type="hidden" name="reviewId" value={review.id} />
                      <input type="hidden" name="status" value="hidden" />
                      <button type="submit" style={{ padding: '6px 16px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                        👁 Ẩn
                      </button>
                    </form>
                  )}
                  <form action={deleteReview}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <button type="submit" onClick={(e) => { if (!confirm('Xóa đánh giá này?')) e.preventDefault(); }} style={{ padding: '6px 16px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                      ✕ Xóa
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
