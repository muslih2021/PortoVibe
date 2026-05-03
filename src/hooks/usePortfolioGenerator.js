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

  const handleGenerate = async (text, notes, selectedTheme, extraData) => {
    if (isGenerating) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
      setErrorMsg('API Key belum diatur di file .env. Pastikan VITE_GEMINI_API_KEY sudah benar.');
      setIsRenderError(false);
      return;
    }

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

    const req = { text, notes, selectedTheme, extraData };
    setLastRequest(req);
    localStorage.setItem('lastRequest', JSON.stringify(req));

    setIsGenerating(true);
    setErrorMsg(null);
    setIsRenderError(false);
    
    if (!isRenderError) setAutoRetryCount(0);

    try {
      const data = await callAI(text, notes, apiKey, selectedTheme, null, extraData, (current, total, status) => {

        const friendlyStatus = status.toLowerCase().includes('model') 
          ? `Mencoba membuat PortoVibe... (Percobaan ${current}/${total})` 
          : status;
        setProgress({ current, total, status: friendlyStatus });
      });

      if (data && data.meta && data.meta.username) {

        // Susun data_foto dari extraData untuk fitur edit foto nanti
        const dataFoto = {
          porto_foto_url: extraData?.profilePhoto || null,
          foto_project: (extraData?.projectPhotos || [])
            .filter(p => p.url)
            .map(p => ({ name: p.name || '', foto: p.url }))
        };

        const portfolioData = {
          ...data,
          userId: user?.uid || 'anonymous',
          visibility: 'public',
          createdAt: new Date().toISOString(),
          data_foto: dataFoto
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

          try {
            const ip = await getIpAddress();
            await incrementIpCount(ip);

await setDoc(doc(db, "portfolios", data.meta.username), portfolioData);

localStorage.setItem('pendingAnonymousPortfolio', data.meta.username);
            setPendingPortfolio(portfolioData);
          } catch (guestError) {
            console.error("Error saving anonymous portfolio:", guestError);
          }
        }

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
    setIsGenerating,
    progress,
    setProgress,
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

      const pendingUsername = pendingPortfolio?.meta?.username || localStorage.getItem('pendingAnonymousPortfolio');
      
      if (!pendingUsername) return;

      try {
        console.log(`Claiming anonymous portfolio ${pendingUsername} for user ${uid}`);

const docRef = doc(db, "portfolios", pendingUsername);
        await setDoc(docRef, { 
          userId: uid,
          claimedAt: new Date().toISOString() 
        }, { merge: true });

localStorage.removeItem('pendingAnonymousPortfolio');
        setPendingPortfolio(null);
        console.log("Portfolio successfully claimed!");
      } catch (e) {
        console.error("Error saving/claiming portfolio:", e);
      }
    }
  };
};
