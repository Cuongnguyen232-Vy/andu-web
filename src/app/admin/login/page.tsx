'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnauthorized = searchParams.get('error') === 'unauthorized';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(isUnauthorized ? 'Bạn không có quyền truy cập trang Admin.' : '');
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
    } else if (data.user.role !== 'admin') {
      setError('Tài khoản này không có quyền Admin.');
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <Image src="/assets/logo.png" alt="Andu Logo" width={70} height={70} style={{ borderRadius: '50%' }} />
        </div>
        <h1 className={styles.title}>ANDU ADMIN</h1>
        <p className={styles.subtitle}>Đăng nhập để quản lý hệ thống</p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@andu.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <Link href="/" className={styles.backLink}>← Quay về trang chủ</Link>
      </div>
    </div>
  );
}
