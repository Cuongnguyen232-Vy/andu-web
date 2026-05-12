'use client';

import React from 'react';

export default function DeleteUserButton({ userName }: { userName: string }) {
  return (
    <button 
      type="submit" 
      onClick={(e) => { 
        if (!window.confirm(`Xóa tài khoản "${userName}"?`)) {
          e.preventDefault(); 
        }
      }} 
      style={{ 
        padding: '5px 14px', 
        backgroundColor: '#fff', 
        color: '#dc3545', 
        border: '1px solid #dc3545', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontSize: '0.82rem', 
        fontWeight: 600 
      }}
    >
      Xóa
    </button>
  );
}
