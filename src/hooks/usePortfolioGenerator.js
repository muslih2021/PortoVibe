import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { callAI } from '../services/aiService';
import { useAuth } from './useAuth';
import { 
  checkGenerationLimit, incrementGenerationCount, 
  getIpAddress, checkIpLimit, incrementIpCount 
} from '../services/usageService';

export const usePortfolioGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [errorMsg, setErrorMsg] = useState(null);
  const [lastRequest, setLastRequest] = useState(() => {
    const saved = localStorage.getItem('lastRequest');
    return saved ? JSON.parse(saved) : null;
  });
  const [isRenderError, setIsRenderError] = useState(false);
  const [autoRetryCount, setAutoRetryCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successUsername, setSuccessUsername] = useState(null);
  const [pendingPortfolio, setPendingPortfolio] = useState(null);
  const [limitStatus, setLimitStatus] = useState({ allowed: true });

  const handleGenerate = async (text, notes, selectedTheme) => {
    if (isGenerating) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
      setErrorMsg('API Key belum diatur di file .env. Pastikan VITE_GEMINI_API_KEY sudah benar.');
      setIsRenderError(false);
      return;
    }

    // Check Limits
    if (user) {
      const limit = await checkGenerationLimit(user.uid);
      if (!limit.allowed) {
        setLimitStatus(limit);
        setErrorMsg(`Limit harian tercapai. Anda hanya bisa membuat ${3} portofolio per hari. Silakan coba lagi besok.`);
        return;
      }
    } else {
      const ip = await getIpAddress();
      const limit = await checkIpLimit(ip);
      if (!limit.allowed) {
        setErrorMsg("Anda sudah menggunakan jatah 1 portofolio gratis untuk hari ini. Silakan login untuk membuat lebih banyak!");
        return;
      }
    }

    const req = { text, notes, selectedTheme };
    setLastRequest(req);
    localStorage.setItem('lastRequest', JSON.stringify(req));

    setIsGenerating(true);
    setErrorMsg(null);
    setIsRenderError(false);
    
    if (!isRenderError) setAutoRetryCount(0);

    try {
      const data = await callAI(text, notes, apiKey, selectedTheme, null, (current, total, status) => {
        setProgress({ current, total, status });
      });

      if (data && data.meta && data.meta.username) {
        // Add user info and visibility
        const portfolioData = {
          ...data,
          userId: user?.uid || 'anonymous',
          visibility: 'public',
          createdAt: new Date().toISOString()
        };

        if (user) {
          try {
            await setDoc(doc(db, "portfolios", data.meta.username), portfolioData);
            await incrementGenerationCount(user.uid);
          } catch (dbError) {
            console.error("Error saving to Firebase:", dbError);
            setErrorMsg("Portfolio berhasil dibuat, namun gagal disimpan ke database.");
            setIsRenderError(false);
          }
        } else {
          // Guest mode: Store in state only
          const ip = await getIpAddress();
          await incrementIpCount(ip);
          setPendingPortfolio(portfolioData);
        }
        
        // Instead of navigate, show success modal
        setSuccessUsername(data.meta.username);
        setShowSuccess(true);
      } else {
        throw new Error('AI response missing username.');
      }
    } catch (e) {
      setErrorMsg(e.message || 'Terjadi kesalahan sistem.');
      setIsRenderError(false);
    } finally {
      setIsGenerating(false);
      setProgress({ current: 0, total: 0, status: '' });
    }
  };

  const handleRenderError = (msg) => {
    setIsGenerating(false);
    if (autoRetryCount < 1 && lastRequest) {
      setAutoRetryCount(prev => prev + 1);
      setIsRenderError(true);
      handleGenerate(lastRequest.text, lastRequest.notes, lastRequest.selectedTheme);
    } else {
      setErrorMsg(msg);
      setIsRenderError(true);
    }
  };

  return {
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
    setPendingPortfolio,
    limitStatus,
    savePendingPortfolio: async (uid) => {
      if (!pendingPortfolio) return;
      try {
        const finalData = {
          ...pendingPortfolio,
          userId: uid,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "portfolios", pendingPortfolio.meta.username), finalData);
        await incrementGenerationCount(uid);
        setPendingPortfolio(null);
      } catch (e) {
        console.error("Error saving pending portfolio:", e);
      }
    }
  };
};
