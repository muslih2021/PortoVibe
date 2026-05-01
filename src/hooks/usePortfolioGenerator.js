import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { callAI } from '../services/aiService';
import { useAuth } from './useAuth';

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

  const handleGenerate = async (text, notes, selectedTheme) => {
    if (isGenerating) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
      setErrorMsg('API Key belum diatur di file .env. Pastikan VITE_GEMINI_API_KEY sudah benar.');
      setIsRenderError(false);
      return;
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

        try {
          await setDoc(doc(db, "portfolios", data.meta.username), portfolioData);
        } catch (dbError) {
          console.error("Error saving to Firebase:", dbError);
          setErrorMsg("Portfolio berhasil dibuat, namun gagal disimpan ke database.");
          setIsRenderError(false);
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
    successUsername
  };
};
