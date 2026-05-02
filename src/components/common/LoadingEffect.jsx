import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import catLottie from '../../assets/animations/cat-loading.lottie';

const LoadingEffect = ({ size = 120, text = "Meow... PortoVibe is preparing something cool!" }) => {
  const [lottieSource, setLottieSource] = useState(() => {

    try {
      return localStorage.getItem('porto_cat_lottie') || catLottie;
    } catch {
      return catLottie;
    }
  });

  useEffect(() => {
    const persistLottie = async () => {
      try {
        const cachedData = localStorage.getItem('porto_cat_lottie');
        if (!cachedData) {

          const response = await fetch(catLottie);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64data = reader.result;
            try {
              localStorage.setItem('porto_cat_lottie', base64data);
            } catch (e) {
              console.warn("Storage full or unavailable:", e);
            }
          };
          reader.readAsDataURL(blob);
        }
      } catch (error) {
        console.error("Gagal melakukan lazy persist lottie:", error);
      }
    };


    const lazyTimer = setTimeout(() => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(() => persistLottie());
      } else {
        persistLottie();
      }
    }, 2000);

    return () => clearTimeout(lazyTimer);
  }, []);

  return (
    <div className="loading-v4-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="cat-lottie-wrapper" style={{ width: size * 2, height: size * 2 }}>
        <DotLottieReact
          src={lottieSource}
          loop
          autoplay
        />
      </div>

      {text && (
        <p className="loading-v4-text" style={{
          marginTop: '1rem',
          fontSize: '1.1rem',
          fontWeight: 900,
          background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Outfit', 'Sora', sans-serif",
          letterSpacing: '2px',
          textTransform: 'uppercase',
          opacity: 0,
          animation: 'fadeInUp-v4 0.8s forwards 1.2s'
        }}>
          {text}
        </p>
      )}

      <style>{`
        @keyframes fadeInUp-v4 {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingEffect;
