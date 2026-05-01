import React from 'react';
import { CheckCircle, ExternalLink, Layout } from 'lucide-react';

export const SuccessModal = ({ username, onClose, onView }) => {
  if (!username) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '32px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'rgba(34, 197, 94, 0.1)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 2rem',
          color: '#22c55e'
        }}>
          <CheckCircle size={48} strokeWidth={2.5} />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Berhasil Dibuat!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Portofolio AI Anda telah berhasil dibuat dan disimpan. Anda bisa melihatnya sekarang atau mengelolanya nanti.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={onView}
            style={{
              width: '100%',
              padding: '1.2rem',
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'transform 0.2s'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ExternalLink size={20} /> Lihat Hasil
          </button>
          
          <button 
            onClick={onClose}
            style={{
              width: '100%',
              padding: '1.2rem',
              background: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
          >
            <Layout size={20} /> Tutup & Lihat Koleksi
          </button>
        </div>
      </div>
    </div>
  );
};
