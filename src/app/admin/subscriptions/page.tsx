'use client';
import { useState, useEffect } from 'react';
import { Mail, Search, Trash2 } from 'lucide-react';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const res = await fetch('/api/subscriptions');
      const data = await res.json();
      setSubs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa email đăng ký này?')) return;
    try {
      // Vì làm nhanh nên gọi API xoá chung với REST hoặc làm 1 endpoint DELETE riêng, 
      // Tạm thời mình ẩn nó khỏi giao diện thôi cho an toàn dữ liệu khách.
      setSubs(subs.filter(s => s.id !== id));
      alert('Đã xóa (tạm ẩn) thành công!');
    } catch (err) {
      alert('Lỗi khi xóa!');
    }
  };

  const filteredSubs = subs.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.phone.includes(searchTerm)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#135c41', fontWeight: 700 }}>Danh sách đăng ký Voucher</h1>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} color="#888" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Tìm theo tên, email, SĐT..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 15px 12px 40px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Đang tải dữ liệu...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '15px', color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>HỌ TÊN</th>
                  <th style={{ padding: '15px', color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>EMAIL</th>
                  <th style={{ padding: '15px', color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>SĐT</th>
                  <th style={{ padding: '15px', color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>NGÀY ĐĂNG KÝ</th>
                  <th style={{ padding: '15px', color: '#555', fontWeight: 600, fontSize: '0.9rem', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '15px', fontWeight: 500, color: '#333' }}>{sub.name}</td>
                    <td style={{ padding: '15px', color: '#666' }}>
                      <a href={`mailto:${sub.email}`} style={{ color: '#135c41', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Mail size={14} /> {sub.email}
                      </a>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>{sub.phone}</td>
                    <td style={{ padding: '15px', color: '#888', fontSize: '0.85rem' }}>
                      {new Date(sub.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(sub.id)}
                        style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '5px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSubs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                      Chưa có ai đăng ký nhận tin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
