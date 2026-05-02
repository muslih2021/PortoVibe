import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { DynamicComponent } from '../components/portfolio/DynamicComponent';
import { Lock } from 'lucide-react';
import LoadingEffect from '../components/common/LoadingEffect';
import { useAuth } from '../hooks/useAuth';

const Portfolio = ({ onRenderError }) => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const { user } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const docRef = doc(db, "portfolios", username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          

          if (data.visibility === 'private' && (!user || user.uid !== data.userId)) {
            setAccessDenied(true);
          } else {
            setConfig(data);
            if (data.meta?.full_name) {
              document.title = `PortoVibe | ${data.meta.full_name}`;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
    
    return () => {
      document.title = "PortoVibe AI | Professional Portfolio Maker";
    };
  }, [username]);

  if (loading) return null;

  if (accessDenied) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050506', color: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Lock size={48} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Portofolio Private</h2>
          <p style={{ color: '#999' }}>Maaf, portofolio ini diatur sebagai private oleh pemiliknya.</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050506', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>404</h2>
          <p style={{ color: '#999' }}>Portfolio tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  if (config.componentCode) {
    return (
      <div style={isPreview ? { overflow: 'hidden', height: '100vh', pointerEvents: 'none' } : {}}>
        {isPreview && (
          <style>{`
            ::-webkit-scrollbar { display: none; }
            * { transition: none !important; animation-play-state: paused !important; }
          `}</style>
        )}
        <DynamicComponent code={config.componentCode} config={config} onRenderError={onRenderError} />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050506', color: '#fff' }}>
      <p>Data portofolio tidak lengkap.</p>
    </div>
  );
};

const PortfolioView = ({ onRenderError }) => {
  return <Portfolio onRenderError={onRenderError} />;
};

export default PortfolioView;
