import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../../assets/images/logo white 35.png';
import catGroup from '../../assets/images/cat group.png';

export const Footer = () => (
  <footer style={{ background: '#050506', color: '#fff', padding: '6rem 2rem 2rem', marginTop: '4rem', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'none' }}>
    <div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '8rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <img src={logoWhite} alt="Logo" style={{ height: '45px', width: 'auto' }} loading="lazy" />
        </div>
        <p style={{ color: '#999', maxWidth: '300px', lineHeight: 1.6 }}>
          Membangun masa depan profesional dengan AI. PortoVibe membantu Anda membuat portofolio bento yang memukau dalam sekejap.
        </p>
      </div>

      <div>
        <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>The Good</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Link to="/" className="footer-link" style={{ color: '#999' }}>Home</Link>
          <a href="#features" className="footer-link" style={{ color: '#999' }}>Fitur</a>
          <a href="#faq" className="footer-link" style={{ color: '#999' }}>FAQ</a>
          <Link to="/maker" className="footer-link" style={{ color: '#999' }}>Mulai Buat</Link>
        </div>
      </div>

      <div>
        <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>The Social</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <a href="https://www.instagram.com/moh_sahmat/" target="_blank" rel="noreferrer" className="footer-link" style={{ color: '#999' }}>Instagram</a>
          <a href="https://porto-muslih.vercel.app/" target="_blank" rel="noreferrer" className="footer-link" style={{ color: '#999' }}>Portfolio</a>
          <a href="mailto:sahmatmuslih@gmail.com" className="footer-link" style={{ color: '#999' }}>Email Me</a>
        </div>
      </div>

      <div>
        <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>The Boring</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <span className="footer-link" style={{ color: '#999' }}>Terms of Use</span>
          <span className="footer-link" style={{ color: '#999' }}>Privacy Policy</span>
          <span className="footer-link" style={{ color: '#999' }}>Cookie Policy</span>
        </div>
      </div>
    </div>

    <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '-2rem', display: 'flex', justifyContent: 'center', overflow: 'visible' }}>
      <img src={catGroup} alt="Kucing Vibe" style={{ width: '100%', maxWidth: '1400px', minWidth: '400px', height: 'auto', objectFit: 'contain', opacity: 0.9, filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.6))' }} loading="lazy" />
    </div>

    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', color: '#555', fontSize: '0.9rem' }}>
      <p>© 2026 PortoVibe AI. Built by Muslih Sahmat</p>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <span>All Rights Reserved</span>
        <span>Local Time: Makassar, ID</span>
      </div>
    </div>
  </footer>
);
