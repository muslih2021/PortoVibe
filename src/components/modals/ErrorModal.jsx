import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import catImage from '../../assets/images/cat_Eror.png';
import cryingCatImage from '../../assets/images/kucing gagal kerja.png';
import bubbleImage from '../../assets/images/Cat Eror Chat bumble.png';
import suaraKucing from '../../assets/audio/suara kucing.mp3';

const simplifyError = (msg) => {
  if (!msg) return 'Terjadi kesalahan yang tidak diketahui.';
  const lower = msg.toLowerCase();
  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('exceeded'))
    return 'Kuota API habis. Silakan tunggu beberapa menit lalu coba lagi.';
  if (lower.includes('api key') || lower.includes('invalid') || lower.includes('unauthorized'))
    return 'API Key tidak valid. Periksa konfigurasi di file .env Anda.';
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('failed to fetch'))
    return 'Koneksi gagal. Periksa koneksi internet Anda.';
  if (lower.includes('empty response'))
    return 'AI tidak memberikan respons. Coba lagi.';
  if (lower.includes('missing meta') || lower.includes('componentcode'))
    return 'AI menghasilkan format yang tidak valid. Coba generate ulang.';
  if (lower.includes('parse') || lower.includes('json'))
    return 'Gagal memproses respons AI. Coba generate ulang.';
  if (lower.includes('semua model'))
    return 'Semua model AI gagal. Coba lagi dalam beberapa menit.';
  if (lower.includes('timeout') || lower.includes('timed out'))
    return 'Waktu permintaan habis. Coba lagi.';
  if (msg.length > 100) return msg.substring(0, 100) + '...';
  return msg;
};

const getCatMessage = (msg, isPdf) => {
  if (isPdf) {
    return "MEOWWW! Sabar-sabar tapi PDF-nya belum diisi juga?! Mau aku cakar kabel internetnya? Buruan isi sekarang, jangan malas-malasan!";
  }
  const lower = msg.toLowerCase();
  if (lower.includes('limit') || lower.includes('3 portofolio') || lower.includes('jatah 1 portofolio') || lower.includes('gratis')) {
    return "MEOW... Jatah generate harian kamu sudah habis nih. Istirahat dulu ya, atau login biar bisa dapet jatah lebih banyak!";
  }
  if (lower.includes('quota') || lower.includes('rate limit')) {
    return "Waduh, servernya lagi penuh sesak! AI-nya lagi antri sembako. Tunggu bentar ya, nanti kita coba lagi.";
  }
  if (lower.includes('api key')) {
    return "Aduhhh! Kunci brankas AI-nya salah nih. Coba cek lagi API Key kamu, jangan sampai salah ketik ya!";
  }
  return "HUWAAAA... Aku udah begadang ngerjain kodenya, tapi malah error pas dijalankan! Maafin V-Cat ya... Tolong kasih aku kesempatan sekali lagi";
};

export const ErrorModal = ({ errorMsg, isRenderError, lastRequest, onRegenerate, onClose }) => {
  const [showCat, setShowCat] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const isPdfError = errorMsg && (
    errorMsg.includes('CV') ||
    errorMsg.includes('PDF') ||
    errorMsg.includes('unggah') ||
    errorMsg.includes('belum')
  );

  const isGenerateError = !isPdfError && errorMsg;
  const displayMsg = isPdfError ? errorMsg : simplifyError(errorMsg);

  useEffect(() => {
    if (isPdfError || isGenerateError) {
      const audio = new Audio(suaraKucing);
      audio.play().catch(e => console.error("Audio error:", e));

      const catTimer = setTimeout(() => setShowCat(true), 400);
      const bubbleTimer = setTimeout(() => setShowBubble(true), 1200);
      return () => {
        clearTimeout(catTimer);
        clearTimeout(bubbleTimer);
      };
    }
  }, [isPdfError, isGenerateError]);

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.85)', zIndex: 3000 }}>

      <div style={{ position: 'relative', zIndex: 3001 }}>

        {isPdfError && (
          <div style={{
            position: 'absolute',
            top: '-200px',
            right: '-30px',
            zIndex: 3010,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0px'
          }}>
            {showBubble && (
              <div className="cat-bubble-animate" style={{
                position: 'relative',
                width: '230px',
                marginRight: '-30px',
                marginBottom: '80px',
                zIndex: 3012
              }}>
                <img src={bubbleImage} alt="Chat bubble" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{
                  position: 'absolute', top: '36%', left: '15%', right: '8%', bottom: '18%',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '6px'
                }}>
                  <p style={{ fontSize: '0.6rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.35, margin: 0, fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif" }}>
                    "{getCatMessage(errorMsg, true)}"
                  </p>
                  <p style={{ fontSize: '0.65rem', fontWeight: 900, color: '#6b21a8', margin: '3px 0 0 0', fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif" }}>
                    P-Cat
                  </p>
                </div>
              </div>
            )}
            <div className={showCat ? 'cat-rise-animate' : 'cat-hidden'} style={{ width: '180px', zIndex: 3011 }}>
              <img src={catImage} alt="P-Cat Error" style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 -4px 20px rgba(139, 92, 246, 0.3))' }} />
            </div>
          </div>
        )}

        {isGenerateError && (
          <div style={{
            position: 'absolute',
            top: '-220px',
            left: '20%',
            transform: 'translateX(-65%)',
            zIndex: 2999,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {showBubble && (
              <div className="cat-bubble-animate" style={{
                position: 'absolute',
                top: '90px',
                left: '200px',
                width: '230px',
                zIndex: 3012
              }}>
                <img src={bubbleImage} alt="Chat bubble" style={{ width: '100%', height: 'auto', display: 'block' }} />
                <div style={{
                  position: 'absolute', top: '18%', left: '12%', right: '10%', bottom: '20%',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '6px'
                }}>
                  <p style={{ fontSize: '0.55rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.35, margin: 0, fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif" }}>
                    "{getCatMessage(errorMsg, false)}"
                  </p>
                  <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#6b21a8', margin: '3px 0 0 0', fontFamily: "'Comic Sans MS', 'Segoe UI', sans-serif" }}>
                    V-Cat
                  </p>
                </div>
              </div>
            )}
            <div className={showCat ? 'vcat-rise-animate' : 'cat-hidden'} style={{ width: '200px', zIndex: 2999 }}>
              <img src={cryingCatImage} alt="V-Cat Crying" style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 4px 20px rgba(239, 68, 68, 0.3))' }} />
            </div>
          </div>
        )}

        <div className="modal-content" style={{
          maxWidth: '450px',
          borderTop: '4px solid #ef4444',
          animation: 'zoomIn 0.3s ease',
          position: 'relative',
          zIndex: 3005
        }}>
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
              {displayMsg}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {isRenderError && lastRequest && (
              <button
                onClick={() => onRegenerate(lastRequest.text, lastRequest.notes, lastRequest.selectedTheme)}
                className="btn-primary-hover"
                style={{
                  width: '100%', padding: '1.2rem', borderRadius: '16px',
                  background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                  color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer',
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
                width: '100%', padding: '1.2rem', borderRadius: '16px',
                background: isRenderError ? 'transparent' : '#ef4444',
                color: isRenderError ? 'var(--text)' : 'white',
                border: isRenderError ? '1px solid var(--card-border)' : 'none',
                fontWeight: 700, cursor: 'pointer',
                boxShadow: isRenderError ? 'none' : '0 10px 20px rgba(239, 68, 68, 0.2)'
              }}
            >
              {isRenderError ? 'Kembali ke Dashboard' : 'Tutup & Coba Lagi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
