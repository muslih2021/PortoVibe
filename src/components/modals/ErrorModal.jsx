import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorModal = ({ errorMsg, isRenderError, lastRequest, onRegenerate, onClose }) => (
  <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 3000 }}>
    <div className="modal-content" style={{ maxWidth: '450px', borderTop: '4px solid #ef4444', animation: 'zoomIn 0.3s ease', position: 'relative', zIndex: 3001 }}>
      <div style={{ marginBottom: '1.5rem', color: '#ef4444' }}>
        <AlertCircle size={60} />
      </div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>Oops! Terjadi Masalah</h2>
      <div style={{ 
        maxHeight: '200px', 
        overflowY: 'auto', 
        marginBottom: '2rem', 
        padding: '1rem', 
        background: 'rgba(0,0,0,0.05)', 
        borderRadius: '12px',
        textAlign: 'left'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
          {errorMsg}
        </p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {isRenderError && lastRequest && (
          <button 
            onClick={() => onRegenerate(lastRequest.text, lastRequest.notes, lastRequest.selectedTheme)}
            className="btn-primary-hover"
            style={{
              width: '100%',
              padding: '1.2rem',
              borderRadius: '16px',
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(139, 92, 246, 0.2)'
            }}
          >
            Regenerate Now
          </button>
        )}
        <button 
          onClick={onClose}
          className="btn-secondary-hover"
          style={{
            width: '100%',
            padding: '1.2rem',
            borderRadius: '16px',
            background: isRenderError ? 'transparent' : '#ef4444',
            color: isRenderError ? 'var(--text)' : 'white',
            border: isRenderError ? '1px solid var(--card-border)' : 'none',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isRenderError ? 'none' : '0 10px 20px rgba(239, 68, 68, 0.2)'
          }}
        >
          {isRenderError ? 'Kembali ke Dashboard' : 'Tutup & Coba Lagi'}
        </button>
      </div>
    </div>
  </div>
);
