'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintOrderButton({ order }: { order: any }) {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items.map((item: any) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px 0;">${item.name}</td>
        <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; text-align: right;">${(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Phiếu Giao Hàng #${order.id.slice(0, 8).toUpperCase()}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #000; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .subtitle { font-size: 14px; color: #555; }
            .info-box { border: 1px solid #000; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 10px 0; border-bottom: 2px solid #000; }
            .total { font-size: 18px; font-weight: bold; text-align: right; border-top: 2px solid #000; padding-top: 15px; }
            .footer { text-align: center; margin-top: 50px; font-style: italic; color: #555; }
            @media print {
              @page { margin: 0; }
              body { padding: 2cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ANDU EYEWEAR</div>
            <div class="subtitle">Chuyên Kính Mắt Thời Trang Cao Cấp</div>
            <h2>PHIẾU GIAO HÀNG</h2>
            <p>Mã đơn: <strong>#${order.id.slice(0, 8).toUpperCase()}</strong></p>
            <p>Ngày đặt: ${new Date(order.createdAt).toLocaleDateString('vi-VN')} ${new Date(order.createdAt).toLocaleTimeString('vi-VN')}</p>
          </div>

          <div class="info-box">
            <h3 style="margin-top: 0;">THÔNG TIN NGƯỜI NHẬN</h3>
            <p><strong>Khách hàng:</strong> ${order.customerName}</p>
            <p><strong>Điện thoại:</strong> ${order.customerPhone}</p>
            <p><strong>Địa chỉ giao hàng:</strong> ${order.shippingAddress}</p>
            ${order.notes ? `<p><strong>Ghi chú:</strong> ${order.notes}</p>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th style="text-align: center;">SL</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total">
            TỔNG CỘNG: ${order.totalAmount.toLocaleString('vi-VN')}₫
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách đã mua sắm tại Andu Eyewear!</p>
            <p>Vui lòng quay video khi bóc hàng để được hỗ trợ tốt nhất.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Optional: printWindow.close();
    }, 250);
  };

  return (
    <button 
      onClick={handlePrint}
      style={{
        padding: '8px 14px',
        backgroundColor: '#f8f9fa',
        color: '#4b5563',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s'
      }}
      onMouseOver={e => { e.currentTarget.style.backgroundColor = '#e5e7eb'; }}
      onMouseOut={e => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
    >
      <Printer size={16} /> In Phiếu
    </button>
  );
}
