'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ChartProps {
  revenueData: { date: string; DoanhThu: number; DonHang: number }[];
  topProducts: { name: string; quantity: number }[];
}

const COLORS = ['#1d4ed8', '#0e7490', '#b45309', '#15803d', '#b91c1c'];

export default function DashboardCharts({ revenueData, topProducts }: ChartProps) {
  return (
    <div className="charts-grid">
      
      {/* Biểu đồ Doanh thu (Bar Chart) */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid #e5e7eb', minWidth: 0 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700, color: '#1a1f2e' }}>Doanh thu 7 ngày qua</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`} width={40} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} width={30} />
              <Tooltip 
                formatter={(value: any, name: any) => {
                  if (name === 'DoanhThu') return [value.toLocaleString('vi-VN') + '₫', 'Doanh thu'];
                  return [value, 'Đơn hàng'];
                }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '0.85rem' }} />
              <Bar yAxisId="left" dataKey="DoanhThu" fill="#1d4ed8" radius={[4, 4, 0, 0]} name="DoanhThu" />
              <Bar yAxisId="right" dataKey="DonHang" fill="#10b981" radius={[4, 4, 0, 0]} name="DonHang" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ Sản phẩm bán chạy (Pie Chart) */}
      <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px', border: '1px solid #e5e7eb', minWidth: 0 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '1rem', fontWeight: 700, color: '#1a1f2e' }}>Top 5 SP Bán Chạy</h2>
        <div style={{ width: '100%', height: 300 }}>
          {topProducts.length > 0 ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="quantity"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} sản phẩm`, 'Đã bán']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
              Chưa có dữ liệu
            </div>
          )}
        </div>
        
        {/* Chú thích Top SP */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          {topProducts.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length], flexShrink: 0 }} />
                <span style={{ color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.name}>{item.name}</span>
              </div>
              <span style={{ fontWeight: 600, color: '#1a1f2e' }}>{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Style nội tuyến cho DashboardCharts để xử lý Responsive */}
      <style dangerouslySetInnerHTML={{__html: `
        .charts-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}
