import React from 'react';
import { FileText, CheckCircle, XCircle, Loader2, Trash2, RefreshCw } from 'lucide-react';

export const UploadTracker = ({ uploads, onRemove }) => {
  if (uploads.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '320px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {uploads.map((upload) => (
        <div 
          key={upload.id} 
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideInRight 0.3s ease-out',
            pointerEvents: 'auto',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: upload.status === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: upload.status === 'error' ? '#ef4444' : '#8b5cf6'
            }}>
              {upload.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ 
                margin: 0, 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {upload.fileName}
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: '0.7rem', 
                color: upload.status === 'error' ? '#ef4444' : 'var(--text-muted)' 
              }}>
                {upload.status === 'loading' ? 'Uploading...' : 
                 upload.status === 'success' ? 'Upload Berhasil!' : 
                 'Gagal mengupload.'}
              </p>
            </div>

            {upload.status !== 'loading' && (
              <button 
                onClick={() => onRemove(upload.id)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div style={{ width: '100%', height: '4px', background: 'var(--card-border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ 
              width: upload.progress + '%', 
              height: '100%', 
              background: upload.status === 'error' ? '#ef4444' : 'linear-gradient(to right, #8b5cf6, #ec4899)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {upload.status === 'error' && (
            <button style={{ 
              background: 'none', 
              border: 'none', 
              color: '#8b5cf6', 
              fontSize: '0.7rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              cursor: 'pointer',
              alignSelf: 'flex-end'
            }}>
              <RefreshCw size={10} /> Try Again
            </button>
          )}
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
