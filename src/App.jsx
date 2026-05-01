import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ProgressModal } from './components/modals/ProgressModal';
import { ErrorModal } from './components/modals/ErrorModal';
import { SuccessModal } from './components/modals/SuccessModal';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ShowcasePage from './pages/ShowcasePage';
import PortfolioView from './pages/PortfolioView';
import { usePortfolioGenerator } from './hooks/usePortfolioGenerator';
import { ScrollToHash } from './utils/ScrollToHash';
import { AuthProvider } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import MyPortfolios from './pages/MyPortfolios';

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const {
    isGenerating,
    progress,
    errorMsg,
    setErrorMsg,
    lastRequest,
    isRenderError,
    setIsRenderError,
    handleGenerate,
    handleRenderError,
    showSuccess,
    setShowSuccess,
    successUsername
  } = usePortfolioGenerator();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const staticPaths = ['/', '/maker', '/showcase', '/my-portfolios', '/auth'];
  const isPortfolioPage = !staticPaths.includes(location.pathname) && location.pathname !== '/';
  const isMakerPage = location.pathname === '/maker';

  const showHeader = !isPortfolioPage;
  const showFooter = !isPortfolioPage && !isMakerPage;

  return (
    <div style={{ position: 'relative' }}>
      <ScrollToHash />
      {showHeader && <Header theme={theme} toggleTheme={toggleTheme} />}
      
      {isGenerating && <ProgressModal progress={progress} />}

      {errorMsg && (
        <ErrorModal 
          errorMsg={errorMsg} 
          isRenderError={isRenderError} 
          lastRequest={lastRequest}
          onRegenerate={handleGenerate}
          onClose={() => {
            setErrorMsg(null);
            setIsRenderError(false);
            if (!isRenderError) navigate('/maker');
          }}
        />
      )}
      
      {showSuccess && (
        <SuccessModal 
          username={successUsername}
          onView={() => {
            window.open(`/${successUsername}`, '_blank');
          }}
          onClose={() => {
            setShowSuccess(false);
            navigate('/my-portfolios');
          }}
        />
      )}

      <div style={{ paddingTop: showHeader ? '5rem' : '0', background: 'var(--bg)' }}>
        <Routes>
          <Route path="/" element={<LandingPage onStart={() => navigate('/maker')} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/my-portfolios" element={<MyPortfolios />} />
          <Route path="/maker" element={<Dashboard onGenerate={handleGenerate} isGenerating={isGenerating} setErrorMsg={setErrorMsg} />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/:username" element={<PortfolioView onRenderError={handleRenderError} />} />
        </Routes>
      </div>
      
      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </Router>
  );
}
