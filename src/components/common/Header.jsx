import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import logoMain from '../../assets/images/logo 35.png';
import logoWhite from '../../assets/images/logo white 35.png';

export const Header = ({ theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header style={{
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'var(--header-bg)',
      backdropFilter: 'blur(10px)',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      borderBottom: '1px solid var(--card-border)',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease'
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <img src={theme === 'dark' ? logoWhite : logoMain} alt="PortoVibe" style={{ height: '32px' }} />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={toggleTheme} style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          padding: '0.5rem',
          cursor: 'pointer',
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" className="nav-link" style={{ color: 'var(--text)' }}>Home</Link>
          <Link to="/#features" className="nav-link" style={{ color: 'var(--text)' }}>Fitur</Link>
          <Link to="/showcase" className="nav-link" style={{ color: 'var(--text)' }}>Lihat Contoh</Link>
          <Link to="/#faq" className="nav-link" style={{ color: 'var(--text)' }}>Bantuan</Link>
          <Link to="/maker" className="btn-primary-hover" style={{
            padding: '0.6rem 1.5rem',
            background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
            color: '#fff',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            Mulai Buat
          </Link>
        </div>

        <button onClick={toggleMenu} className="mobile-toggle" style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text)',
          zIndex: 1001,
          padding: '0.5rem'
        }}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'var(--bg)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
        visibility: isMenuOpen ? 'visible' : 'hidden'
      }}>
        <Link to="/" className="nav-link" style={{ fontSize: '1.5rem', color: 'var(--text)' }} onClick={toggleMenu}>Home</Link>
        <Link to="/#features" className="nav-link" style={{ fontSize: '1.5rem', color: 'var(--text)' }} onClick={toggleMenu}>Fitur</Link>
        <Link to="/showcase" className="nav-link" style={{ fontSize: '1.5rem', color: 'var(--text)' }} onClick={toggleMenu}>Lihat Contoh</Link>
        <Link to="/#faq" className="nav-link" style={{ fontSize: '1.5rem', color: 'var(--text)' }} onClick={toggleMenu}>Bantuan</Link>
        <Link to="/maker" className="btn-primary-hover" onClick={toggleMenu} style={{
          padding: '1.2rem 3rem',
          background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
          color: '#fff',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '1.2rem',
          width: '80%',
          maxWidth: '300px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Mulai Buat
        </Link>
      </div>
    </header>
  );
};
