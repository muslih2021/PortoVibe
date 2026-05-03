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
        <WifiOff size={isMobile ? 48 : 48} color="#ef4444" />
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
    </div>
  );
};

export default OfflineStatus;
