import React, { useState, useEffect, useRef } from 'react';
import LoadingEffect from './common/LoadingEffect';

const SplashScreen = ({ isReady, onComplete }) => {
  const [show, setShow] = useState(true);
  const hasExited = useRef(false);

  useEffect(() => {
    if (isReady && !hasExited.current) {
      hasExited.current = true;
      setShow(false);
      setTimeout(onComplete, 500);
    }
  }, [isReady, onComplete]);

  // Fallback: dismiss after max 8 seconds regardless
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!hasExited.current) {
        hasExited.current = true;
        setShow(false);
        setTimeout(onComplete, 500);
      }
    }, 8000);
    return () => clearTimeout(fallback);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      opacity: show ? 1 : 0,
      visibility: show ? 'visible' : 'hidden',
      transition: 'opacity 0.5s ease, visibility 0.5s ease'
    }}>
      <LoadingEffect size={150} text="PortoVibe By Muslih" eagerCache />
    </div>
  );
};

export default SplashScreen;
