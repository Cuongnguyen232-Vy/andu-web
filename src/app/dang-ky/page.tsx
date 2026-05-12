'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Đăng ký thất bại');
    } else {
      router.push('/dang-nhap?success=registered');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '50px 45px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <Link href="/">
          <Image src="/assets/logo.png" alt="Andu Logo" width={65} height={65} style={{ borderRadius: '50%', marginBottom: '15px' }} />
        </Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111', marginBottom: '8px' }}>Tạo tài khoản</h1>
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '30px' }}>Đăng ký để mua sắm và theo dõi đơn hàng</p>

        {error && (
          <div style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: '#ff3b30', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {[
            { label: 'Họ và tên', key: 'name', type: 'text', placeholder: 'Nguyễn Văn A' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'email@example.com' },
            { label: 'Mật khẩu', key: 'password', type: 'password', placeholder: 'Ít nhất 6 ký tự' },
            { label: 'Xác nhận mật khẩu', key: 'confirm', type: 'password', placeholder: '••••••••' },
          ].map((field) => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#444', marginBottom: '6px' }}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                required
                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fafafa', boxSizing: 'border-box' }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--primary, #135c41)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.88rem', color: '#888' }}>
          Đã có tài khoản? <Link href="/dang-nhap" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
