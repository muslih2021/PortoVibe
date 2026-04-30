import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { DynamicComponent } from '../components/portfolio/DynamicComponent';
import { Sparkles } from 'lucide-react';

const Portfolio = ({ onRenderError }) => {
  const { username } = useParams();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const docRef = doc(db, "portfolios", username);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setConfig(data);
          if (data.meta?.full_name) {
            document.title = `PortoVibe | ${data.meta.full_name}`;
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

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050506' }}>
        <div className="loading-animation"><Sparkles size={48} color="#8b5cf6" /></div>
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
    return <DynamicComponent code={config.componentCode} config={config} onRenderError={onRenderError} />;
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
