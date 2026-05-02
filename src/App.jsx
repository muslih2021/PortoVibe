import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { usePortfolioGenerator } from './hooks/usePortfolioGenerator';
import { AuthProvider, useAuth } from './hooks/useAuth';
import SplashScreen from './components/SplashScreen';


const Header = React.lazy(() => import('./components/common/Header').then(m => ({ default: m.Header })));
const Footer = React.lazy(() => import('./components/common/Footer').then(m => ({ default: m.Footer })));
const ProgressModal = React.lazy(() => import('./components/modals/ProgressModal').then(m => ({ default: m.ProgressModal })));
const ErrorModal = React.lazy(() => import('./components/modals/ErrorModal').then(m => ({ default: m.ErrorModal })));
const SuccessModal = React.lazy(() => import('./components/modals/SuccessModal').then(m => ({ default: m.SuccessModal })));
const ScrollToHash = React.lazy(() => import('./utils/ScrollToHash').then(m => ({ default: m.ScrollToHash })));
const OfflineStatus = React.lazy(() => import('./components/common/OfflineStatus'));


const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ShowcasePage = React.lazy(() => import('./pages/ShowcasePage'));
const PortfolioView = React.lazy(() => import('./pages/PortfolioView'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const MyPortfolios = React.lazy(() => import('./pages/MyPortfolios'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const staticPaths = ['/', '/maker', '/showcase', '/my-portfolios', '/auth'];
  const isPortfolioPage = !staticPaths.includes(location.pathname) && location.pathname !== '/';
  const [isAppLoading, setIsAppLoading] = useState(!isPortfolioPage);

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
    successUsername,
    pendingPortfolio,
    savePendingPortfolio
  } = usePortfolioGenerator();

  useEffect(() => {
    if (user && pendingPortfolio) {
      savePendingPortfolio(user.uid);
    }
  }, [user, pendingPortfolio, savePendingPortfolio]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');


  const isMakerPage = location.pathname === '/maker';

  const showHeader = !isPortfolioPage;
  const showFooter = !isPortfolioPage && !isMakerPage;

  return (
    <div style={{ position: 'relative' }}>
      <React.Suspense fallback={null}>
        <OfflineStatus />
      </React.Suspense>

      {isAppLoading && !isPortfolioPage && <SplashScreen onComplete={() => setIsAppLoading(false)} />}

      <ScrollToTop />

      <React.Suspense fallback={null}>
        <ScrollToHash />
      </React.Suspense>

      {showHeader && !isAppLoading && (
        <React.Suspense fallback={null}>
          <Header theme={theme} toggleTheme={toggleTheme} />
        </React.Suspense>
      )}

      {isGenerating && (
        <React.Suspense fallback={null}>
          <ProgressModal progress={progress} />
        </React.Suspense>
      )}

      {errorMsg && (
        <React.Suspense fallback={null}>
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
        </React.Suspense>
      )}

      {showSuccess && (
        <React.Suspense fallback={null}>
          <SuccessModal
            username={successUsername}
            onView={() => {
              window.open(`/${successUsername}`, '_blank');
            }}
            isGuest={!user}
            onLogin={() => {
              setShowSuccess(false);
              navigate('/auth');
            }}
            onClose={() => {
              setShowSuccess(false);
              if (user) navigate('/my-portfolios');
            }}
          />
        </React.Suspense>
      )}

      <div style={{ paddingTop: showHeader ? '5rem' : '0', background: 'var(--bg)' }}>
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<LandingPage onStart={() => navigate('/maker')} />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/my-portfolios" element={<MyPortfolios />} />
            <Route path="/maker" element={<Dashboard onGenerate={handleGenerate} isGenerating={isGenerating} setErrorMsg={setErrorMsg} />} />
            <Route path="/showcase" element={<ShowcasePage />} />
            <Route path="/:username" element={<PortfolioView onRenderError={handleRenderError} />} />
          </Routes>
        </React.Suspense>
      </div>

      {showFooter && !isAppLoading && (
        <React.Suspense fallback={null}>
          <Footer />
        </React.Suspense>
      )}
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

