'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('success') === 'registered';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Đăng nhập thất bại');
    } else {
      // Redirect theo role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '50px 45px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <Link href="/">
          <Image src="/assets/logo.png" alt="Andu Logo" width={65} height={65} style={{ borderRadius: '50%', marginBottom: '15px' }} />
        </Link>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#111', marginBottom: '8px' }}>Đăng nhập</h1>
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '30px' }}>Chào mừng bạn quay lại Andu Eyewear</p>

        {justRegistered && (
          <div style={{ background: 'rgba(19,92,65,0.08)', border: '1px solid rgba(19,92,65,0.2)', color: 'var(--primary)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px' }}>
            ✅ Đăng ký thành công! Vui lòng đăng nhập.
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', color: '#ff3b30', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#444', marginBottom: '6px' }}>Email</label>
            <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fafafa', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#444', marginBottom: '6px' }}>Mật khẩu</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e5e5', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit', background: '#fafafa', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: 'var(--primary, #135c41)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.88rem', color: '#888' }}>
          Chưa có tài khoản? <Link href="/dang-ky" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
