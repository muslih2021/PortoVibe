import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Send, Image, RefreshCw, CheckCircle, Camera, FolderOpen } from 'lucide-react';
import { refineAI } from '../../services/aiService';
import { db } from '../../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { checkEditLimit, incrementEditCount } from '../../services/usageService';
import { useAuth } from '../../hooks/useAuth';
import kucingBerdiri from '../../assets/images/kucing berdiri.png';
import suaraKucing from '../../assets/audio/suara kucing.mp3';
import { SuccessModal } from './SuccessModal';
import LoadingEffect from '../common/LoadingEffect';

const LOCALSTORAGE_KEY = (portfolioId) => `pending_foto_replace_${portfolioId}`;
const LOCALSTORAGE_NEW_PHOTOS = (portfolioId) => `pending_new_photos_${portfolioId}`;

const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  if (!response.ok) throw new Error('Gagal upload ke Cloudinary');
  const data = await response.json();
  return data.secure_url;
};

export const EditPortfolioModal = ({ portfolio, onClose, onUpdate, apiKey }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ai');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [remainingEdits, setRemainingEdits] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const targetText = "Meow! Beri perintah saya untuk perbaiki website anda. Apa yang ingin Anda ubah?";


  const [pendingReplacements, setPendingReplacements] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY(portfolio.id));
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [uploadingId, setUploadingId] = useState(null);

  const [newPhotos, setNewPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_NEW_PHOTOS(portfolio.id));
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [newPhotoName, setNewPhotoName] = useState('');
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const newPhotoInputRef = useRef(null);

  const dataFoto = portfolio.data_foto || null;


  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY(portfolio.id), JSON.stringify(pendingReplacements));
  }, [pendingReplacements, portfolio.id]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_NEW_PHOTOS(portfolio.id), JSON.stringify(newPhotos));
  }, [newPhotos, portfolio.id]);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setDisplayedText(targetText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    const audio = new Audio(suaraKucing);
    audio.play().catch(e => console.error("Audio error:", e));

    const getLimit = async () => {
      if (user) {
        const limit = await checkEditLimit(user.uid);
        setRemainingEdits(limit.remaining);
      }
    };
    getLimit();

    return () => clearInterval(interval);
  }, [user]);

  const handleReplacePhoto = async (key, oldUrl, file) => {
    if (!file) return;
    setUploadingId(key);
    try {
      const newUrl = await uploadToCloudinary(file);
      setPendingReplacements(prev => ({
        ...prev,
        [key]: { oldUrl, newUrl, preview: URL.createObjectURL(file) }
      }));
    } catch (err) {
      console.error('Upload gagal:', err);
      alert('Gagal mengupload foto. Coba lagi.');
    } finally {
      setUploadingId(null);
    }
  };

  const handleCancelReplace = (key) => {
    setPendingReplacements(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleAddNewPhoto = async (file) => {
    if (!file || !newPhotoName.trim()) return;
    setIsUploadingNew(true);
    try {
      const newUrl = await uploadToCloudinary(file);
      const newPhotoObj = {
        id: Date.now().toString(),
        name: newPhotoName.trim(),
        newUrl,
        preview: URL.createObjectURL(file)
      };
      setNewPhotos(prev => [...prev, newPhotoObj]);
      setNewPhotoName('');
    } catch (err) {
      console.error('Upload gagal:', err);
      alert('Gagal mengupload foto baru. Coba lagi.');
    } finally {
      setIsUploadingNew(false);
      if (newPhotoInputRef.current) newPhotoInputRef.current.value = '';
    }
  };

  const handleRemoveNewPhoto = (id) => {
    setNewPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    if (user) {
      const limit = await checkEditLimit(user.uid);
      if (!limit.allowed) {
        setDisplayedText("Meow... maaf, limit edit harian Anda (6 kali) sudah habis. Silakan coba lagi besok!");
        return;
      }
    }

    setIsProcessing(true);
    try {
      const updatedData = await refineAI(portfolio, prompt, apiKey, pendingReplacements, newPhotos, (current, total, status) => {
        setDisplayedText(`Meow... sedang bekerja (${status})...`);
      });

      if (updatedData) {

        const updatedDataFoto = buildUpdatedDataFoto(portfolio.data_foto, pendingReplacements, newPhotos);
        const saveData = { ...updatedData, data_foto: updatedDataFoto };

        await updateDoc(doc(db, "portfolios", portfolio.id), saveData);
        await incrementEditCount(user.uid);


        localStorage.removeItem(LOCALSTORAGE_KEY(portfolio.id));
        localStorage.removeItem(LOCALSTORAGE_NEW_PHOTOS(portfolio.id));
        setPendingReplacements({});
        setNewPhotos([]);

        onUpdate(saveData);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Edit error:", err);
      setDisplayedText("Meow... maaf, saya gagal memperbaiki website Anda. Coba lagi?");
    } finally {
      setIsProcessing(false);
    }
  };


  const buildUpdatedDataFoto = (oldDataFoto, replacements, addedPhotos) => {
    let updated = oldDataFoto ? { ...oldDataFoto } : { foto_project: [] };


    if (replacements['profil'] && replacements['profil'].newUrl) {
      updated.porto_foto_url = replacements['profil'].newUrl;
    }


    if (updated.foto_project) {
      updated.foto_project = updated.foto_project.map((item, idx) => {
        const key = `project_${idx}`;
        if (replacements[key] && replacements[key].newUrl) {
          return { ...item, foto: replacements[key].newUrl };
        }
        return item;
      });
    } else {
      updated.foto_project = [];
    }

    if (addedPhotos && addedPhotos.length > 0) {
      const formattedAdded = addedPhotos.map(p => ({ name: p.name, foto: p.newUrl }));
      updated.foto_project = [...updated.foto_project, ...formattedAdded];
    }

    return updated;
  };

  const hasPendingReplacements = Object.keys(pendingReplacements).length > 0 || newPhotos.length > 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 10000,
      overflowY: 'auto',
      padding: '4rem 1rem 2rem'
    }}>
      <div className="vn-scene" style={{ maxWidth: '900px', width: '100%', position: 'relative' }}>

        <button
          onClick={() => { if (!isProcessing) onClose(); }}
          disabled={isProcessing}
          className="vn-close-button"
          style={{
            position: 'absolute',
            top: '-50px', right: '0',
            background: 'none', border: 'none',
            color: 'white',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            zIndex: 100,
            opacity: isProcessing ? 0.5 : 1
          }}
        >
          <X size={32} />
        </button>


        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50px',
          padding: '0.3rem',
          width: 'fit-content',
          opacity: isProcessing ? 0.6 : 1,
          pointerEvents: isProcessing ? 'none' : 'auto'
        }}>
          <button
            onClick={() => setActiveTab('ai')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: activeTab === 'ai' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'ai' ? 'white' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}
          >
            <Sparkles size={15} /> Mode AI
          </button>
          <button
            onClick={() => setActiveTab('foto')}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              background: activeTab === 'foto' ? '#ec4899' : 'transparent',
              color: activeTab === 'foto' ? 'white' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              position: 'relative'
            }}
          >
            <Image size={15} /> Edit Foto
            {hasPendingReplacements && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#f59e0b', color: 'white',
                borderRadius: '50%', width: '16px', height: '16px',
                fontSize: '0.6rem', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {Object.keys(pendingReplacements).length + newPhotos.length}
              </span>
            )}
          </button>
        </div>


        {activeTab === 'ai' && (
          <div className="vn-actors">
            <div className="vn-actor-left">
              <img
                src={kucingBerdiri}
                alt="Kucing Edit"
                className="cat-editor-img"
                style={{
                  maxWidth: '100%', height: 'auto',
                  animation: isProcessing ? 'cat-float 2s infinite ease-in-out' : 'none'
                }}
              />
            </div>

            <div className="vn-actor-right">
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={24} color="#8b5cf6" /> Mode Perbaikan AI
              </h3>
              {remainingEdits !== null && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Sisa kuota edit harian Anda: <strong>{remainingEdits} kali</strong>
                </p>
              )}


              {hasPendingReplacements && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: '#f59e0b',
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <CheckCircle size={14} />
                  {Object.keys(pendingReplacements).length + newPhotos.length} foto siap diganti/ditambah. Kirim perintah AI untuk menerapkannya.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  placeholder="Contoh: 'Tolong ganti warnanya jadi biru', 'Tambahkan animasi pada hero section', atau tulis '.' jika hanya ingin menerapkan ganti foto."
                  rows={4}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isProcessing}
                  style={{
                    width: '100%', padding: '1rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '16px',
                    color: 'var(--text)', fontSize: '1rem',
                    resize: 'none', boxSizing: 'border-box'
                  }}
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    padding: '0.8rem 2rem',
                    background: 'transparent',
                    color: '#8b5cf6',
                    border: '2px solid #8b5cf6',
                    borderRadius: '50px',
                    fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex', height: '2rem',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '0.8rem', width: 'fit-content',
                    margin: '1rem auto 0',
                    transition: 'all 0.3s ease',
                    opacity: isProcessing ? 0.7 : 1,
                    overflow: 'hidden'
                  }}
                >
                  {isProcessing ? (
                    <LoadingEffect size={25} text="" />
                  ) : <><Send size={18} /> Kirim Perintah</>}
                </button>
              </form>
            </div>
          </div>
        )}


        {activeTab === 'foto' && (
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Image size={20} color="#ec4899" /> Edit Foto Portfolio
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Klik <strong>Replace</strong> pada foto yang ingin diganti. Setelah selesai, pindah ke tab <strong>Mode AI</strong> dan kirim perintah untuk menerapkannya.
            </p>

            {!dataFoto ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                <FolderOpen size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p>Tidak ada data foto tersimpan untuk portfolio ini.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Hanya portfolio yang dibuat ulang setelah fitur ini aktif yang mendukung edit foto.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>


                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Camera size={16} color="#8b5cf6" /> Foto Profil
                  </p>
                  <PhotoCard
                    id="profil"
                    label="Foto Profil"
                    currentUrl={pendingReplacements['profil']?.newUrl || dataFoto.porto_foto_url}
                    previewUrl={pendingReplacements['profil']?.preview || null}
                    isReplaced={!!pendingReplacements['profil']}
                    isUploading={uploadingId === 'profil'}
                    onReplace={(file) => handleReplacePhoto('profil', dataFoto.porto_foto_url, file)}
                    onCancel={() => handleCancelReplace('profil')}
                  />
                </div>


                {dataFoto.foto_project && dataFoto.foto_project.length > 0 && (
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Image size={16} color="#ec4899" /> Foto Project/Kegiatan
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                      {dataFoto.foto_project.map((item, idx) => {
                        const key = `project_${idx}`;
                        return (
                          <PhotoCard
                            key={key}
                            id={key}
                            label={item.name || `Project ${idx + 1}`}
                            currentUrl={pendingReplacements[key]?.newUrl || item.foto}
                            previewUrl={pendingReplacements[key]?.preview || null}
                            isReplaced={!!pendingReplacements[key]}
                            isUploading={uploadingId === key}
                            onReplace={(file) => handleReplacePhoto(key, item.foto, file)}
                            onCancel={() => handleCancelReplace(key)}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}


                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Image size={16} color="#10b981" /> Tambah Foto Project Baru
                  </p>

                  {newPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      {newPhotos.map((item) => (
                        <div key={item.id} style={{ position: 'relative' }}>
                          <PhotoCard
                            id={item.id}
                            label={item.name}
                            currentUrl={item.newUrl}
                            previewUrl={item.preview}
                            isReplaced={true}
                            isUploading={false}
                            onReplace={() => { }}
                            onCancel={() => handleRemoveNewPhoto(item.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className='button-upload-edit-foto-porto'>
                    <input
                      type="text"
                      placeholder="Nama Project/Kegiatan Baru"
                      value={newPhotoName}
                      onChange={(e) => setNewPhotoName(e.target.value)}
                      disabled={isUploadingNew}
                      style={{
                        flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg)', color: 'var(--text)'
                      }}
                    />
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      style={{ display: 'none' }}
                      ref={newPhotoInputRef}
                      onChange={(e) => handleAddNewPhoto(e.target.files[0])}
                    />
                    <button
                      onClick={() => {
                        if (!newPhotoName.trim()) {
                          alert('Masukkan nama project terlebih dahulu!');
                          return;
                        }
                        newPhotoInputRef.current?.click();
                      }}
                      disabled={isUploadingNew}
                      style={{
                        padding: '0.8rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isUploadingNew ? 0.7 : 1
                      }}
                    >
                      {isUploadingNew ? <RefreshCw size={16} /> : <Camera size={16} />}
                      {isUploadingNew ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>


                {hasPendingReplacements && (
                  <button
                    onClick={() => setActiveTab('ai')}
                    style={{
                      padding: '0.9rem 2rem',
                      background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                      color: 'white', border: 'none', borderRadius: '50px',
                      fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.5rem', marginTop: '0.5rem',
                      boxShadow: '0 8px 20px rgba(139,92,246,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Sparkles size={18} />
                    Lanjut ke Mode AI & Terapkan ({Object.keys(pendingReplacements).length + newPhotos.length} foto)
                  </button>
                )}
              </div>
            )}
          </div>
        )}


        {activeTab === 'ai' && (
          <div className="vn-dialog-box" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '1.5rem 2rem',
            position: 'relative'
          }}>
            <span className="vn-name-tag" style={{
              position: 'absolute', top: '-15px', left: '30px',
              background: '#8b5cf6', color: 'white',
              padding: '0.2rem 1rem', borderRadius: '50px',
              fontWeight: 700, fontSize: '0.9rem'
            }}>
              Kucing Vibes
            </span>
            <div className="vn-dialog-content">
              <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
                {displayedText}
              </p>
            </div>
          </div>
        )}
      </div>

      {showSuccess && (
        <SuccessModal
          username={portfolio.meta?.username}
          onView={() => { window.open(`/${portfolio.meta?.username}`, '_blank'); }}
          onClose={() => { setShowSuccess(false); onClose(); }}
        />
      )}

      <style>{`
        .vn-actors {
          display: flex;
          gap: 2rem;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .vn-actor-left { flex: 1; text-align: center; }
        .vn-actor-right {
          flex: 1.5;
          background: var(--card-bg);
          padding: 1.5rem;
          border: 1px solid var(--card-border);
          border-radius: 24px;
        }
        .vn-dialog-content p {
          color: white; font-size: 1.2rem;
          font-weight: 500; margin: 0; line-height: 1.4;
        }
        .vn-close-button { transition: all 0.3s ease; }

        @media (max-width: 768px) {
          .vn-close-button { top: 10px !important; right: 10px !important; }
          .vn-actors { flex-direction: column; align-items: center; gap: 1rem; }
          .cat-editor-img { max-width: 150px !important; }
          .vn-actor-right { width: 100%; padding: 1.5rem; box-sizing: border-box; }
          .vn-dialog-content p { font-size: 1rem !important; }
          .vn-scene { padding-top: 2rem; max-width: 95% !important; }
          .vn-actor-right button { padding: 0.5rem 1rem !important; font-size: 0.85rem !important; }
        }

        @keyframes cat-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


function PhotoCard({ id, label, currentUrl, previewUrl, isReplaced, isUploading, onReplace, onCancel }) {
  const inputRef = useRef(null);
  const displayUrl = previewUrl || currentUrl;

  return (
    <div style={{
      background: 'var(--bg)',
      borderRadius: '16px',
      padding: '1rem',
      border: isReplaced ? '2px solid #22c55e' : '1px solid var(--card-border)',
      transition: 'border 0.3s ease'
    }}>

      <div style={{
        width: '100%', height: '130px',
        borderRadius: '10px', overflow: 'hidden',
        marginBottom: '0.75rem', background: '#1a1a2e',
        position: 'relative'
      }}>
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
            <Image size={32} />
          </div>
        )}

        {isReplaced && (
          <div style={{
            position: 'absolute', top: '6px', right: '6px',
            background: '#22c55e', color: 'white',
            borderRadius: '50px', padding: '2px 8px',
            fontSize: '0.65rem', fontWeight: 900
          }}>
            ✓ BARU
          </div>
        )}

        {isUploading && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '10px'
          }}>
            <div style={{
              width: '28px', height: '28px',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#8b5cf6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        )}
      </div>


      <p style={{
        fontSize: '0.78rem', fontWeight: 600,
        color: 'var(--text)', marginBottom: '0.75rem',
        whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis'
      }} title={label}>
        {label}
      </p>


      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files[0]) onReplace(e.target.files[0]); }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          style={{
            flex: 1, padding: '0.45rem',
            background: isReplaced ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)',
            color: '#8b5cf6', border: '1px solid #8b5cf6',
            borderRadius: '8px', fontSize: '0.75rem',
            fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.3rem', transition: 'all 0.2s ease',
            opacity: isUploading ? 0.5 : 1
          }}
        >
          <RefreshCw size={12} /> {isReplaced ? 'Ganti Lagi' : 'Replace'}
        </button>

        {isReplaced && (
          <button
            onClick={onCancel}
            style={{
              padding: '0.45rem 0.6rem',
              background: 'rgba(239,68,68,0.1)',
              color: '#ef4444', border: '1px solid #ef4444',
              borderRadius: '8px', fontSize: '0.75rem',
              fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
