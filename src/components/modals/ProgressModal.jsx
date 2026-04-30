import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import workCatImage from '../../kucing kerja 1.png';
import workPawImage from '../../tangan kucing kerja.png';
import workBubbleImage from '../../bumble text kucing kerja.png';

export const ProgressModal = ({ progress }) => {
  const [showCat, setShowCat] = useState(false);
  const [showBubble, setShowBubble] = useState(false);


  useEffect(() => {
    const catTimer = setTimeout(() => setShowCat(true), 300);
    const bubbleTimer = setTimeout(() => setShowBubble(true), 800);
    const hideBubbleTimer = setTimeout(() => setShowBubble(false), 200000);
    const hideCatTimer = setTimeout(() => setShowCat(false), 200000);

    return () => {
      clearTimeout(catTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(hideBubbleTimer);
      clearTimeout(hideCatTimer);
    };
  }, []);

  return (
    <div className="modal-overlay">

      <div style={{ position: 'relative' }}>

        <div className='cat-kerja-parent' style={{
          position: 'absolute',
          top: '-60px',
          left: '-100px',
          zIndex: 2998,
          pointerEvents: 'none'
        }}>

          {showBubble && (
            <div className="work-bubble-animate" style={{
              position: 'absolute',
              top: '-120px',
              left: '-20px',
              width: '180px',
              zIndex: 3010
            }}>
              <img src={workBubbleImage} className='workBubbleImagemain' alt="Speech bubble" style={{
                width: '100%', height: 'auto', display: 'block',
                transform: 'rotate(-15deg)'
              }} />
              <div style={{
                position: 'absolute', top: '18%', left: '14%', right: '12%', bottom: '22%',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                padding: '6px', transform: 'rotate(-15deg)'
              }}>
                <p
                  className='textbubblekerja' style={{
                    fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a',
                    lineHeight: 1.3, margin: 0, textAlign: 'center',
                    fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif"
                  }}>
                  Halo, aku V-Cat! Web kamu lagi aku poles biar makin kinclong. Ditunggu ya, meow!
                </p>
              </div>
            </div>
          )}

          <div className={showCat ? 'work-cat-slide-in' : 'work-cat-hidden'} style={{
            width: '170px',
            position: 'relative'
          }}>
            <img src={workCatImage} alt="V-Cat Working" style={{
              width: '100%', height: 'auto', display: 'block',
              filter: 'drop-shadow(2px 2px 10px rgba(139, 92, 246, 0.2))'
            }} />

            <div className="paw-wave" style={{
              position: 'absolute',
              bottom: '-20px',
              right: '10px',
              width: '80px',
              transformOrigin: 'top right',
              zIndex: 2999
            }}>
              <img src={workPawImage} alt="Paw waving" style={{
                width: '100%', height: 'auto', display: 'block'
              }} />
            </div>
          </div>
        </div>

        <div className="modal-content" style={{ animation: 'zoomIn 0.3s ease', position: 'relative', zIndex: 3000 }}>
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
    </div>
  );
};
