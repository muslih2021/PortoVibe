import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send } from 'lucide-react';
import { refineAI } from '../../services/aiService';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import kucingBerdiri from '../../assets/images/kucing berdiri.png';
import suaraKucing from '../../assets/audio/suara kucing.mp3';
import { SuccessModal } from './SuccessModal';

export const EditPortfolioModal = ({ portfolio, onClose, onUpdate, apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const targetText = "Meow! Beri perintah saya untuk perbaiki website anda. Apa yang ingin Anda ubah?";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setDisplayedText(targetText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    const audio = new Audio(suaraKucing);
    audio.play().catch(e => console.error("Audio error:", e));

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const updatedData = await refineAI(portfolio, prompt, apiKey, (current, total, status) => {
        setDisplayedText(`Meow... sedang bekerja (${status})...`);
      });

      if (updatedData) {
        await updateDoc(doc(db, "portfolios", portfolio.id), updatedData);
        onUpdate(updatedData);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Edit error:", err);
      setDisplayedText("Meow... maaf, saya gagal memperbaiki website Anda. Coba lagi?");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '1rem'
    }}>
      <div className="vn-scene" style={{ maxWidth: '900px', width: '100%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-50px',
            right: '0',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <X size={32} />
        </button>

        <div className="vn-actors">
          <div className="vn-actor-left">
            <img
              src={kucingBerdiri}
              alt="Kucing Edit"
              className="cat-editor-img"
              style={{
                maxWidth: '100%',
                height: 'auto',
                animation: isProcessing ? 'cat-float 2s infinite ease-in-out' : 'none'
              }}
            />
          </div>

          <div className="vn-actor-right">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={24} color="#8b5cf6" /> Mode Perbaikan AI
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea
                placeholder="Contoh: 'Tolong ganti warnanya jadi biru', 'Tambahkan animasi pada hero section', atau 'Perbaiki layout skill'."
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '16px',
                  color: 'var(--text)',
                  fontSize: '1rem',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  padding: '1rem',
                  background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: isProcessing ? 0.7 : 1
                }}
              >
                {isProcessing ? 'Sedang Memperbaiki...' : <><Send size={18} /> Kirim Perintah</>}
              </button>
            </form>
          </div>
        </div>

        <div className="vn-dialog-box" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '1.5rem 2rem',
          position: 'relative'
        }}>
          <span className="vn-name-tag" style={{
            position: 'absolute',
            top: '-15px',
            left: '30px',
            background: '#8b5cf6',
            color: 'white',
            padding: '0.2rem 1rem',
            borderRadius: '50px',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            Kucing Vibes
          </span>
          <div className="vn-dialog-content">
            <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
              {displayedText}
            </p>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal 
          username={portfolio.meta?.username}
          onView={() => {
            window.open(`/${portfolio.meta?.username}`, '_blank');
          }}
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}

      <style>{`
        .vn-actors {
          display: flex;
          gap: 2rem;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .vn-actor-left {
          flex: 1;
          text-align: center;
        }
        .vn-actor-right {
          flex: 1.5;
          background: var(--card-bg);
          padding: 2rem;
          borderRadius: 24px;
          border: 1px solid var(--card-border);
          border-radius: 24px;
        }
        .vn-dialog-content p {
          color: white;
          font-size: 1.2rem;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .vn-actors {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .cat-editor-img {
            max-width: 150px !important;
          }
          .vn-actor-right {
            width: 100%;
            padding: 1.5rem;
            box-sizing: border-box;
          }
          .vn-dialog-content p {
            font-size: 1rem !important;
          }
          .vn-scene {
            padding-top: 2rem;
          }
        }

        @keyframes cat-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};
