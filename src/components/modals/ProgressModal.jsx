import React from 'react';
import { Sparkles } from 'lucide-react';

export const ProgressModal = ({ progress }) => (
  <div className="modal-overlay">
    <div className="modal-content" style={{ animation: 'zoomIn 0.3s ease' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Sparkles className="icon-pulse" size={50} color="#8b5cf6" />
      </div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)' }}>
        Architecting Your Vibe
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Membangun portfolio mewah dalam hitungan detik...
      </p>
      
      <div className="loading-line-container">
        <div className="loading-line"></div>
      </div>
      
      <div style={{ 
        background: 'var(--section-bg)', 
        padding: '1.2rem', 
        borderRadius: '20px',
        border: '1px solid var(--card-border)',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
          <span style={{ color: '#8b5cf6' }}>AI ATTEMPT</span>
          <span style={{ color: 'var(--text)' }}>{progress.current} / {progress.total}</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          {progress.status}
        </p>
      </div>
    </div>
  </div>
);
