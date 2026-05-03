import React, { useState, useEffect } from 'react';
import LoadingEffect from './common/LoadingEffect';

const SplashScreen = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
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
      <LoadingEffect size={150} text="PortoVibe By Muslih" />
    </div>
  );
};

export default SplashScreen;
