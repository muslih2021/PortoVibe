import React, { useState, useEffect } from 'react';
import LoadingEffect from './LoadingEffect';
import { WifiOff } from 'lucide-react';

const OfflineStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isOffline) return null;

  const isMobile = windowWidth < 768;

  return (
    <div className="offline-status-overlay">
      <div className="offline-status-icon-wrapper">
        <WifiOff size={isMobile ? 32 : 48} color="#ef4444" />
      </div>

      <div className="offline-lottie-container">
        <LoadingEffect 
          size={isMobile ? 120 : 180} 
          text="" 
        />
      </div>

      <div className="offline-status-content">
        <h1 className="offline-status-title">MEOW!</h1>
        <h2 className="offline-status-subtitle">Kamu Sedang Offline</h2>
        <p className="offline-status-description">
          Kucing PortoVibe tidak bisa menjangkau server. 
          Cek koneksi internetmu biar kita bisa lanjut bikin portofolio keren lagi!
        </p>
      </div>

      <style>{`
        .offline-status-overlay {
          position: fixed;
          inset: 0;
          z-index: 100000;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(15px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          textAlign: center;
          padding: 2rem;
          animation: fadeIn-offline 0.5s ease;
          overflow: hidden;
        }

        .offline-status-icon-wrapper {
          background: rgba(239, 68, 68, 0.1);
          padding: 1.5rem;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(239, 68, 68, 0.3);
          animation: pulse-red-offline 2s infinite;
        }

        .offline-lottie-container {
          margin-bottom: 1rem;
          transform: scale(1.1);
        }

        .offline-status-content {
          max-width: 450px;
          width: 100%;
          text-align: center;
        }

        .offline-status-title {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, #ef4444, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Sora', sans-serif;
        }

        .offline-status-subtitle {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 1rem;
          font-family: 'Sora', sans-serif;
        }

        .offline-status-description {
          color: #a0a0a0;
          line-height: 1.6;
          font-size: 1.1rem;
          padding: 0 1rem;
        }

        @media (max-width: 768px) {
          .offline-status-overlay {
            padding: 1.5rem;
          }
          .offline-status-title {
            font-size: 2.2rem;
          }
          .offline-status-subtitle {
            font-size: 1.4rem;
          }
          .offline-status-description {
            font-size: 0.95rem;
          }
          .offline-status-icon-wrapper {
            padding: 1rem;
            margin-bottom: 1rem;
          }
        }

        @keyframes pulse-red-offline {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        @keyframes fadeIn-offline {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OfflineStatus;
