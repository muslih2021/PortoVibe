import React, { useState, useEffect } from 'react';
import { Upload, Sparkles, Link as LinkIcon, Info, User, Image, Plus, Trash2, Globe, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import {
  LuZap, LuPencil, LuBox, LuTriangle, LuSparkles, LuBookOpen, LuLayoutGrid,
  LuTv, LuLeaf, LuShapes, LuCircle, LuBook
} from "react-icons/lu";
import { extractTextFromPdf } from '../utils/pdf';
import LoadingEffect from '../components/common/LoadingEffect';
import { UploadTracker } from '../components/common/UploadTracker';

const Dashboard = ({ onGenerate, isGenerating, setIsGenerating, setProgress, setErrorMsg }) => {
  const { user } = useAuth();
  const [customNotes, setCustomNotes] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('Click to browse or drag and drop');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Maximalism');

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [projectPhotos, setProjectPhotos] = useState([]);
  const [socialLinks, setSocialLinks] = useState([{ id: Date.now(), url: '' }]);
  const [activeUploads, setActiveUploads] = useState([]);

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
  }, []);

  const themes = [
    { name: 'Maximalism', icon: <LuZap color="#f59e0b" />, desc: 'Dopamine, chaotic, hyperpop' },
    { name: 'Hand-Drawn', icon: <LuPencil color="#10b981" />, desc: 'Organic, sketched, human' },
    { name: 'Neo-Brutalism', icon: <LuBox color="#3b82f6" />, desc: 'Raw, bold, retro-web' },
    { name: 'Bauhaus', icon: <LuTriangle color="#ef4444" />, desc: 'Geometric, architectural' },
    { name: 'Linear / Modern', icon: <LuSparkles color="#8b5cf6" />, desc: 'Cinematic, premium tech' },
    { name: 'Luxury / Editorial', icon: <LuBookOpen color="#1f2937" />, desc: 'Elegant, monochrome' },
    { name: 'Swiss International', icon: <LuLayoutGrid color="#4b5563" />, desc: 'Grid-based, typography' },
    { name: 'Vaporwave', icon: <LuTv color="#ff00ff" />, desc: '80s Neon, VHS, Outrun' },
    { name: 'Botanical', icon: <LuLeaf color="#8c9a84" />, desc: 'Organic, earthy, soft serif' },
    { name: 'Claymorphism', icon: <LuCircle color="#7c3aed" />, desc: 'Soft 3D, tactile, playful' },
    { name: 'Playful Geometric', icon: <LuShapes color="#f472b6" />, desc: 'Memphis, energetic, pop' },
    { name: 'Academia', icon: <LuBook color="#78350f" />, desc: 'Classical, library, scholarly' },
    { name: 'Cyan Modern', icon: <LuCircle color="#008080" />, desc: 'Medical clean, ultra-soft' },
    { name: 'Vibrant Designer', icon: <LuShapes color="#6366F1" />, desc: 'High-contrast, energy' },
    { name: 'Neo Agency', icon: <LuLayoutGrid color="#1D4ED8" />, desc: 'Brutalist, loud marquee' },
    { name: 'Retro Comic', icon: <LuTv color="#FDE047" />, desc: 'Slanted panels, pop art' }
  ];

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary config missing (CLOUD_NAME or UPLOAD_PRESET)');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const validateImage = (file) => {
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validFormats.includes(file.type)) {
      setErrorMsg('Hanya file PNG, JPEG, dan JPG yang diperbolehkan.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal adalah 5MB.');
      return false;
    }
    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadId = Date.now();
    setActiveUploads(prev => [...prev, { id: uploadId, fileName: file.name, progress: 10, status: 'loading' }]);

    setFileName(`Processing: ${file.name}...`);
    setIsProcessing(true);
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setActiveUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: 40, fileName: 'Extracting PDF Data...' } : u));

        const arrayBuffer = await file.arrayBuffer();
        const text = await extractTextFromPdf(arrayBuffer);

        setActiveUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: 100, status: 'success' } : u));
        setTimeout(() => setActiveUploads(prev => prev.filter(u => u.id !== uploadId)), 2000);

        setFileContent(text);
        setFileName(`Ready: ${file.name}`);
      } else {
        throw new Error('Format file tidak didukung. Mohon unggah file PDF.');
      }
    } catch (err) {
      console.error('File error:', err);
      setActiveUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u));
      setErrorMsg(err.message);
      setFileName('Pilih file PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      const uploadId = Date.now();
      setActiveUploads(prev => [...prev, { id: uploadId, fileName: 'Profile Photo', progress: 0, status: 'loading' }]);

      const localPreview = URL.createObjectURL(file);
      setProfilePhoto({ file, preview: localPreview, cloudinaryUrl: null });

      try {
        const url = await uploadToCloudinary(file);
        setProfilePhoto(prev => ({ ...prev, cloudinaryUrl: url }));
        setActiveUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: 100, status: 'success' } : u));
        setTimeout(() => setActiveUploads(prev => prev.filter(u => u.id !== uploadId)), 2000);
      } catch (err) {
        setActiveUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u));
        setErrorMsg('Gagal mengupload foto profil.');
      }
    }
  };

  const handleAddActivity = () => {
    if (projectPhotos.length >= 10) {
      setErrorMsg('Maksimal 10 project/kegiatan.');
      return;
    }
    setProjectPhotos([...projectPhotos, {
      id: Date.now(),
      name: '',
      file: null,
      preview: null
    }]);
  };

  const handleActivityPhotoChange = async (id, e) => {
    const file = e.target.files[0];
    if (file && validateImage(file)) {
      const uploadId = Date.now();
      setActiveUploads(prev => [...prev, { id: uploadId, fileName: `Project Photo`, progress: 0, status: 'loading' }]);

      const localPreview = URL.createObjectURL(file);
      setProjectPhotos(prev => prev.map(p => p.id === id ? { ...p, file, preview: localPreview, cloudinaryUrl: null } : p));

      try {
        const url = await uploadToCloudinary(file);
        setProjectPhotos(prev => prev.map(p => p.id === id ? { ...p, cloudinaryUrl: url } : p));
        setActiveUploads(prev => prev.map(u => u.id === uploadId ? { ...u, progress: 100, status: 'success' } : u));
        setTimeout(() => setActiveUploads(prev => prev.filter(u => u.id !== uploadId)), 2000);
      } catch (err) {
        setActiveUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'error' } : u));
        setErrorMsg('Gagal mengupload foto project.');
      }
    }
  };

  const updateProjectPhotoName = (id, name) => {
    setProjectPhotos(projectPhotos.map(p => p.id === id ? { ...p, name } : p));
  };

  const removeProjectPhoto = (id) => {
    setProjectPhotos(projectPhotos.filter(p => p.id !== id));
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { id: Date.now(), url: '' }]);
  };

  const updateSocialLink = (id, value) => {
    setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, url: value } : l));
  };

  const removeSocialLink = (id) => {
    setSocialLinks(socialLinks.filter(l => l.id !== id));
  };

  const handleSubmit = async () => {
    if (isProcessing || isGenerating) return;


    if (activeUploads.some(u => u.status === 'loading')) {
      setErrorMsg('Tunggu sebentar, masih ada file yang sedang diupload.');
      return;
    }

    if (!fileContent) {
      setErrorMsg('Mohon unggah CV Anda (PDF) terlebih dahulu sebelum membuat portofolio.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProgress({ current: 1, total: 3, status: 'Menyiapkan data portofolio...' });

    try {
      console.log('--- STARTING GENERATION WITH PRE-UPLOADED ASSETS ---');

      const extraData = {
        profilePhoto: profilePhoto?.cloudinaryUrl || null,
        projectPhotos: projectPhotos.map(p => ({
          name: p.name,
          url: p.cloudinaryUrl || null
        })),
        socialLinks: socialLinks.filter(l => l.url).map(l => l.url)
      };

      console.log('Final Extra Data:', extraData);
      await onGenerate(fileContent, customNotes, selectedTheme, extraData);
    } catch (err) {
      console.error('Generation Error:', err);
      setIsGenerating(false);
      setErrorMsg(`Gagal: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '8rem 2rem 4rem', background: 'var(--bg)', color: 'var(--text)', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(236, 72, 153, 0.1)',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          borderRadius: '16px',
          padding: '1rem',
          marginBottom: '1rem',
          color: 'var(--text)',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem'
        }}>

          <span>
            <strong>PortoVibe Beta:</strong> Anda dapat membuat hingga <strong>3 portofolio per hari</strong>.
            Guest (belum login) hanya bisa membuat <strong>1 portofolio per hari</strong> tanpa fitur simpan. Terima kasih telah mencoba!
          </span>
        </div>

        {!user && (
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            color: 'var(--text)',
            fontSize: '0.9rem'
          }}>
            <Info size={18} color="#8b5cf6" />
            <span>
              Anda belum masuk. Portofolio Anda akan disimpan secara anonim.
              <Link to="/auth" style={{ color: '#8b5cf6', fontWeight: 700, marginLeft: '0.5rem', textDecoration: 'none' }}>
                Masuk sekarang
              </Link> agar portofolio ini tersimpan permanen di akun Anda setelah dibuat.
            </span>
          </div>
        )}
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
          Your CV to <span style={{
            background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Website</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '4rem' }}>
          Select a vibe, upload your CV, and let AI build your professional world.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '4rem', opacity: isGenerating ? 0.5 : 1, pointerEvents: isGenerating ? 'none' : 'auto' }}>
          {themes.map(t => (
            <div key={t.name} onClick={() => setSelectedTheme(t.name)}
              className="benefit-card"
              style={{
                padding: '1.5rem',
                background: selectedTheme === t.name ? '#8b5cf615' : 'var(--card-bg)',
                border: `1px solid ${selectedTheme === t.name ? '#8b5cf6' : 'var(--card-border)'}`,
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedTheme === t.name ? 'translateY(-5px)' : 'none',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                {t.icon}
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)' }}>{t.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Section: Mandatory Input */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '32px',
          padding: '3rem', textAlign: 'left', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          opacity: (isGenerating || isProcessing) ? 0.7 : 1,
          pointerEvents: (isGenerating || isProcessing) ? 'none' : 'auto'
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>Wajib Diisi</h3>
          </div>

          {/* Section 1: CV Upload */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
              <LuBookOpen size={20} color="#8b5cf6" /> Upload CV (PDF)
            </label>
            <input type="file" id="cv-upload" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            <div onClick={() => !isGenerating && !isProcessing && document.getElementById('cv-upload').click()}
              className="btn-secondary-hover"
              style={{ border: '2px dashed var(--card-border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', cursor: (isGenerating || isProcessing) ? 'not-allowed' : 'pointer', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {isProcessing && !fileContent && !profilePhoto && projectPhotos.every(p => !p.file) ? (
                <LoadingEffect size={80} text="Mengekstrak data CV... Meow!" />
              ) : (
                <>
                  <Upload size={32} style={{ marginBottom: '1rem', color: '#8b5cf6' }} />
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{fileName}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section: Optional Assets */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '32px',
          padding: '3rem', textAlign: 'left', marginBottom: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
          opacity: (isGenerating || isProcessing) ? 0.7 : 1,
          pointerEvents: (isGenerating || isProcessing) ? 'none' : 'auto'
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Aset Pendukung</h3>
            <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>Opsional - Agar Porto Lebih Keren</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '3rem' }}>
            {/* Section 2: Profile Photo */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                <User size={20} color="#8b5cf6" /> Foto Profil
              </label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Gunakan foto dengan background transparan. <a href="https://www.iloveimg.com/remove-background" target="_blank" rel="noreferrer" style={{ color: '#ec4899', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>Hapus background disini <ExternalLink size={12} /></a>
              </p>
              <input type="file" id="profile-photo" accept=".png,.jpg,.jpeg" style={{ display: 'none' }} onChange={handleProfilePhotoChange} />
              <div onClick={() => document.getElementById('profile-photo').click()}
                style={{
                  width: '100%', height: '150px', border: '2px dashed var(--card-border)', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: 'var(--bg)'
                }}>
                {profilePhoto ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img src={profilePhoto.preview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfilePhoto(null);
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        zIndex: 5
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                    {profilePhoto.cloudinaryUrl && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: '#22c55e',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        READY
                      </div>
                    )}
                  </div>
                ) : (
                  <Plus size={32} color="var(--text-muted)" />
                )}
              </div>
            </div>

            {/* Section 3: Social Links */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                <Globe size={20} color="#8b5cf6" /> Links Media Sosial
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {socialLinks.map((link) => (
                  <div key={link.id} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      placeholder="Masukkan Link (Instagram, LinkedIn, Portfolio, dll)"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, e.target.value)}
                      style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg)', color: 'var(--text)' }}
                    />
                    <button onClick={() => removeSocialLink(link.id)} style={{ padding: '0.8rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button onClick={handleAddSocialLink} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <Plus size={16} /> Tambah Link
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Project Documentation */}
          <div style={{ marginBottom: '3rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
              <Image size={20} color="#8b5cf6" /> Dokumentasi Kegiatan/Project/Pekerjaan (Maks 10)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {projectPhotos.map((p) => (
                <div key={p.id} style={{
                  background: 'var(--bg)', borderRadius: '16px', padding: '1.5rem',
                  border: '1px solid var(--card-border)', display: 'flex', gap: '1.5rem',
                  alignItems: 'center', position: 'relative'
                }}>
                  <button
                    onClick={() => removeProjectPhoto(p.id)}
                    style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', zIndex: 10 }}
                  >
                    ×
                  </button>

                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nama Kegiatan/Project</label>
                    <input
                      placeholder="Contoh: Juara 1 Lomba UI/UX"
                      value={p.name}
                      onChange={(e) => updateProjectPhotoName(p.id, e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text)' }}
                    />
                  </div>

                  <div style={{ width: '150px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Foto (Maks 1)</label>
                    <input
                      type="file"
                      id={`project-photo-${p.id}`}
                      accept=".png,.jpg,.jpeg"
                      style={{ display: 'none' }}
                      onChange={(e) => handleActivityPhotoChange(p.id, e)}
                    />
                    <div
                      onClick={() => document.getElementById(`project-photo-${p.id}`).click()}
                      style={{
                        height: '100px', border: '2px dashed var(--card-border)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: 'var(--card-bg)'
                      }}>
                      {p.preview ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <img src={p.preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {p.cloudinaryUrl && (
                            <div style={{
                              position: 'absolute',
                              bottom: '5px',
                              right: '5px',
                              background: '#22c55e',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.6rem',
                              fontWeight: 900
                            }}>
                              OK
                            </div>
                          )}
                        </div>
                      ) : (
                        <Plus size={20} color="var(--text-muted)" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {projectPhotos.length < 10 && (
                <button
                  onClick={handleAddActivity}
                  style={{
                    padding: '1.2rem', border: '2px dashed var(--card-border)', borderRadius: '16px',
                    background: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600
                  }}
                >
                  <Plus size={20} /> Tambah Project Baru
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
              <LuSparkles size={20} color="#8b5cf6" /> Special Instructions
            </label>
            <textarea className="input-area" placeholder="e.g. Focus on my management skills..."
              value={customNotes} onChange={e => setCustomNotes(e.target.value)}
              style={{ minHeight: '120px', padding: '1.2rem', width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '16px', color: 'var(--text)', fontSize: '1rem' }} />
          </div>

          <button onClick={handleSubmit} className="btn-primary-hover"
            disabled={isGenerating || isProcessing}
            style={{
              width: '100%',
              padding: '1.5rem',
              borderRadius: '16px',
              background: (isGenerating || isProcessing) ? 'var(--text-muted)' : 'linear-gradient(to right, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: (isGenerating || isProcessing) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: (isGenerating || isProcessing) ? 'none' : '0 10px 20px rgba(139, 92, 246, 0.2)',
              transition: 'all 0.3s ease'
            }}>
            <Sparkles size={20} />
            {(isGenerating || isProcessing) ? 'Sabar ya, kucing lagi lari bikin porto...' : 'Generate My PortoVibe'}
          </button>
        </div>
        <UploadTracker
          uploads={activeUploads}
          onRemove={(id) => setActiveUploads(prev => prev.filter(u => u.id !== id))}
        />
      </div>
    </div>
  );
};

export default Dashboard;
