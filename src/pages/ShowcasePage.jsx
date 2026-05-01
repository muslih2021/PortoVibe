import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { DynamicComponent } from '../components/portfolio/DynamicComponent';

const ShowcasePage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // Ambil semua untuk memastikan data lama tanpa field visibility tetap muncul
        const querySnapshot = await getDocs(collection(db, "portfolios"));
        const list = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.visibility === 'public' || p.visibility === undefined); // Tampilkan yang public atau data lama
        
        setPortfolios(list);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [portfolios]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-animation">
          <Sparkles size={48} color="#8b5cf6" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '8rem 2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: 'var(--bg)', transition: 'all 0.3s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Inspirasi <span style={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hasil Karya</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Lihat bagaimana PortoVibe AI mengubah CV menjadi website profesional.</p>
      </div>

      {portfolios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '24px' }}>
          <p style={{ color: 'var(--text-muted)' }}>Belum ada hasil karya yang dipublikasikan. Jadilah yang pertama!</p>
          <Link to="/maker" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none', display: 'block', marginTop: '1rem' }}>Mulai Buat Sekarang →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {portfolios.map((p) => (
            <Link key={p.id} to={`/${p.id}`} target="_blank" className="benefit-card glow-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'left', borderRadius: '24px', transition: 'all 0.3s ease', display: 'block', overflow: 'hidden' }}>
              <div style={{ 
                height: '200px', 
                background: p.theme?.backgroundColor || 'var(--section-bg)', 
                borderRadius: '16px', 
                marginBottom: '1.5rem', 
                position: 'relative', 
                overflow: 'hidden',
                border: '1px solid var(--card-border)'
              }}>
                <div style={{
                  width: '1200px',
                  height: '800px',
                  transform: 'scale(0.25)',
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}>
                  {p.componentCode && <DynamicComponent code={p.componentCode} config={p} />}
                </div>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)' }}>{p.meta?.name || p.id}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{p.meta?.role || 'Professional Vibe'}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 800 }}>LIHAT PORTFOLIO</span>
                <span style={{ padding: '6px 14px', background: '#8b5cf615', color: '#8b5cf6', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {p.theme?.vibe || 'Modern'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowcasePage;
