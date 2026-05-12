'use client';
import { useState, useEffect } from 'react';
import styles from './products.module.css';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  images?: string;
  colors?: string;
};

const COLOR_PRESETS = [
  { name: 'Đen', hex: '#000000' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Nâu', hex: '#8B4513' },
  { name: 'Xám', hex: '#808080' },
  { name: 'Vàng', hex: '#FFD700' },
  { name: 'Đỏ', hex: '#DC143C' },
  { name: 'Xanh dương', hex: '#1E90FF' },
  { name: 'Xanh lá', hex: '#228B22' },
  { name: 'Hồng', hex: '#FF69B4' },
  { name: 'Bạc', hex: '#C0C0C0' },
  { name: 'Vàng hồng', hex: '#B76E79' },
  { name: 'Trong suốt', hex: '#E8E8E8' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gọng kính',
    material: '',
    shape: '',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    promos: '',
    image: '/assets/product1.png',
    images: [] as string[],
    colors: [] as { hex: string; stock: number }[],
  });

  // Load products từ API
  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      let parsedImages: string[] = [];
      try { parsedImages = product.images ? JSON.parse(product.images) : []; } catch(e) {}
      let parsedColors: { hex: string; stock: number }[] = [];
      try {
        const raw = product.colors ? JSON.parse(product.colors) : [];
        // Tương thích cả format cũ (string[]) và mới (object[])
        if (raw.length > 0 && typeof raw[0] === 'string') {
          parsedColors = raw.map((hex: string) => ({ hex, stock: 0 }));
        } else {
          parsedColors = raw;
        }
      } catch(e) {}
      
      setFormData({
        name: product.name,
        category: product.category,
        material: (product as any).material || '',
        shape: (product as any).shape || '',
        price: product.price.toString(),
        originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
        stock: product.stock.toString(),
        description: (product as any).description || '',
        promos: (product as any).promos || '',
        image: product.image,
        images: parsedImages,
        colors: parsedColors,
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', category: 'Gọng kính', material: '', shape: '', price: '', originalPrice: '', stock: '', description: '', promos: '', image: '/assets/product1.png', images: [], colors: [] as { hex: string; stock: number }[] });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (data.url) {
        // Thêm vào danh sách ảnh
        const newImages = [...formData.images, data.url];
        setFormData(prev => ({ 
          ...prev, 
          images: newImages,
          image: newImages[0] // Ảnh đầu tiên luôn là ảnh chính
        }));
      }
    } catch (err) {
      alert('Lỗi khi tải ảnh lên!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: newImages[0] || '/assets/product1.png'
    }));
  };

  const handleSetMainImage = (index: number) => {
    // Đưa ảnh được chọn lên đầu
    const selected = formData.images[index];
    const newImages = [selected, ...formData.images.filter((_, i) => i !== index)];
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: selected
    }));
  };

  const toggleColor = (hex: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.find(c => c.hex === hex)
        ? prev.colors.filter(c => c.hex !== hex)
        : [...prev.colors, { hex, stock: 0 }]
    }));
  };

  const updateColorStock = (hex: string, stock: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map(c => c.hex === hex ? { ...c, stock } : c)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
      // Tổng stock = tổng các màu (nếu có màu) hoặc lấy từ input stock
      const totalStock = formData.colors.length > 0
        ? formData.colors.reduce((sum, c) => sum + c.stock, 0)
        : parseInt(formData.stock) || 0;

      const payload = {
        name: formData.name,
        category: formData.category,
        material: formData.material,
        shape: formData.shape,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
        stock: totalStock,
        description: formData.description,
        promos: formData.promos,
        image: formData.images[0] || formData.image,
        images: JSON.stringify(formData.images),
        colors: JSON.stringify(formData.colors),
      };

    try {
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Lỗi cập nhật');
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Lỗi thêm mới');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Lỗi xóa sản phẩm. Có thể sản phẩm này đã nằm trong một đơn hàng.');
        }
        fetchProducts();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý Sản phẩm</h1>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>+ Thêm sản phẩm mới</button>
      </div>

      {/* Tabs Bộ lọc danh mục */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px', overflowX: 'auto' }}>
        {['All', 'Gọng kính', 'Kính râm', 'Tròng kính', 'Phụ kiện'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s',
              backgroundColor: filterCategory === cat ? '#135c41' : '#f5f5f5',
              color: filterCategory === cat ? '#fff' : '#666'
            }}
          >
            {cat === 'All' ? 'Tất cả' : cat}
          </button>
        ))}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign: 'center'}}>Đang tải dữ liệu...</td></tr>
            ) : (
              products
                .filter(p => filterCategory === 'All' || p.category === filterCategory)
                .map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.image} alt={p.name} className={styles.productImage} />
                  </td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td>{p.price.toLocaleString('vi-VN')}₫</td>
                  <td>{p.stock}</td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleOpenModal(p)}>Sửa</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingId ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm Mới'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Tên sản phẩm</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Kính Râm Ray-Ban..." />
              </div>

              {/* Upload nhiều hình ảnh */}
              <div className={styles.formGroup}>
                <label>Hình ảnh sản phẩm (Ảnh đầu tiên = Ảnh chính)</label>
                
                {/* Grid hiển thị ảnh đã upload */}
                {formData.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
                    {formData.images.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: idx === 0 ? '3px solid var(--primary, #135c41)' : '1px solid #ddd', cursor: 'pointer' }}>
                        <img src={img} alt={`Ảnh ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onClick={() => handleSetMainImage(idx)} />
                        {idx === 0 && (
                          <span style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: 'var(--primary, #135c41)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Ảnh chính</span>
                        )}
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                          style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(220,53,69,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: '0.75rem', color: '#999', margin: '0 0 8px' }}>💡 Bấm vào ảnh để chọn làm ảnh chính. Bấm ✕ để xóa.</p>

                <div className={styles.uploadBtnWrapper}>
                  <button type="button" className={styles.uploadBtn}>
                    {isUploading ? 'Đang tải...' : '📷 Thêm ảnh sản phẩm'}
                  </button>
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                </div>
              </div>

              {/* Chọn màu sắc */}
              <div className={styles.formGroup}>
                <label>Màu sắc sản phẩm</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                  {COLOR_PRESETS.map(color => (
                    <div
                      key={color.hex}
                      onClick={() => toggleColor(color.hex)}
                      title={color.name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: color.hex,
                        border: formData.colors.find(c => c.hex === color.hex) ? '3px solid var(--primary, #135c41)' : '2px solid #ddd',
                        cursor: 'pointer',
                        position: 'relative',
                        boxShadow: formData.colors.find(c => c.hex === color.hex) ? '0 0 0 2px var(--primary, #135c41)' : 'none',
                        transition: 'all 0.15s',
                      }}
                    >
                      {formData.colors.find(c => c.hex === color.hex) && (
                        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: color.hex === '#FFFFFF' || color.hex === '#FFD700' || color.hex === '#E8E8E8' || color.hex === '#C0C0C0' ? '#333' : '#fff', fontSize: '16px', fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
                {/* Nhập số lượng theo màu */}
                {formData.colors.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {formData.colors.map(colorItem => {
                      const preset = COLOR_PRESETS.find(c => c.hex === colorItem.hex);
                      return (
                        <div key={colorItem.hex} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: colorItem.hex, border: '1px solid #ccc', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 500, width: '80px' }}>{preset?.name || colorItem.hex}</span>
                          <input
                            type="number"
                            min="0"
                            value={colorItem.stock}
                            onChange={e => updateColorStock(colorItem.hex, parseInt(e.target.value) || 0)}
                            placeholder="Số lượng"
                            style={{ width: '90px', padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                          />
                          <span style={{ fontSize: '0.78rem', color: '#999' }}>cái</span>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: '0.78rem', color: '#135c41', fontWeight: 600, margin: '4px 0 0' }}>
                      Tổng tồn kho: {formData.colors.reduce((sum, c) => sum + c.stock, 0)} cái
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Danh mục</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Gọng kính">Gọng kính</option>
                  <option value="Kính râm">Kính râm</option>
                  <option value="Tròng kính">Tròng kính</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Chất liệu (nếu là gọng kính)</label>
                <select value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})}>
                  <option value="">-- Không xác định --</option>
                  <option value="titan">Titan</option>
                  <option value="nhua">Nhựa</option>
                  <option value="kim-loai">Kim loại</option>
                  <option value="nhua-pha-kim-loai">Nhựa pha kim loại</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Hình dáng (nếu là gọng kính)</label>
                <select value={formData.shape} onChange={e => setFormData({...formData, shape: e.target.value})}>
                  <option value="">-- Không xác định --</option>
                  <option value="oval">Oval</option>
                  <option value="tron">Tròn</option>
                  <option value="vuong">Vuông</option>
                  <option value="chu-nhat">Chữ nhật</option>
                  <option value="da-giac">Đa giác</option>
                  <option value="mat-meo">Mắt mèo</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className={styles.formGroup}>
                  <label>Giá bán (VNĐ)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Giá gốc (VNĐ) - Tự động tạo Sale %</label>
                  <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} placeholder="VD: 4790000" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Mô tả sản phẩm (Tùy chọn)</label>
                <textarea 
                  rows={4} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px' }}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Ưu đãi đặc biệt (Mỗi ưu đãi 1 dòng)</label>
                <textarea 
                  rows={4} 
                  value={formData.promos} 
                  onChange={e => setFormData({...formData, promos: e.target.value})} 
                  placeholder={"VD:\nTặng hộp kính da cao cấp\nMiễn phí đo mắt"}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px', whiteSpace: 'pre-wrap' }}
                />
              </div>

              {formData.colors.length === 0 && (
                <div className={styles.formGroup}>
                  <label>Số lượng kho</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              )}
              
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className={styles.saveBtn}>Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
