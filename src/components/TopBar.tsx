import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, back = false }: { title: string; back?: boolean }) {
  const nav = useNavigate();

  return (
    <div style={{
      paddingTop: 'env(safe-area-inset-top)',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #eee'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px' }}>
        {back && (
          <button
            onClick={() => nav(-1)}
            aria-label="Back"
            style={{
              border: '1px solid #e5e7eb',
              background: '#fff',
              borderRadius: 10,
              padding: '6px 10px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        )}
        <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
      </div>
    </div>
  );
}
