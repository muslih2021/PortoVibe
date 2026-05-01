import React, { useState, useEffect } from 'react';
import { Upload, Sparkles, Link as LinkIcon, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  LuZap, LuPencil, LuBox, LuTriangle, LuSparkles, LuBookOpen, LuLayoutGrid, 
  LuTv, LuLeaf, LuShapes, LuCircle, LuBook
} from "react-icons/lu";
import { extractTextFromPdf } from '../utils/pdf';

const Dashboard = ({ onGenerate, isGenerating, setErrorMsg }) => {
  const { user } = useAuth();
  const [customNotes, setCustomNotes] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('Click to browse or drag and drop');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Maximalism');

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(`Processing: ${file.name}...`);
    setIsProcessing(true);
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const text = await extractTextFromPdf(arrayBuffer);
        setFileContent(text);
        setFileName(`Ready: ${file.name}`);
      } else {
        setErrorMsg('Format file tidak didukung. Mohon unggah file PDF.');
        setFileName('Pilih file PDF');
      }
    } catch (err) {
      console.error('File error:', err);
      setFileName('Error processing file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (isProcessing || isGenerating) return;
    if (!fileContent) {
      setErrorMsg('Mohon unggah CV Anda (PDF) terlebih dahulu sebelum membuat portofolio.');
      return;
    }
    await onGenerate(fileContent, customNotes, selectedTheme);
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
          <Sparkles size={18} color="#ec4899" />
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
              Anda belum masuk. Hasil karya akan muncul sebagai <strong>Preview</strong> dan tidak akan disimpan permanen. 
              <Link to="/auth" style={{ color: '#8b5cf6', fontWeight: 700, marginLeft: '0.5rem', textDecoration: 'none' }}>
                Masuk sekarang
              </Link> untuk menyimpan secara otomatis.
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
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '32px', padding: '3rem', textAlign: 'left', marginBottom: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', opacity: isGenerating ? 0.7 : 1, pointerEvents: isGenerating ? 'none' : 'auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Upload CV (PDF)</label>
            <input type="file" id="cv-upload" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
            <div onClick={() => !isGenerating && document.getElementById('cv-upload').click()}
              className="btn-secondary-hover"
              style={{ border: '2px dashed var(--card-border)', borderRadius: '16px', padding: '3rem', textAlign: 'center', cursor: isGenerating ? 'not-allowed' : 'pointer' }}>
              <Upload size={32} style={{ marginBottom: '1rem', color: '#8b5cf6' }} />
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{fileName}</p>
            </div>
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Special Instructions</label>
            <textarea className="input-area" placeholder="e.g. Focus on my management skills..."
              value={customNotes} onChange={e => setCustomNotes(e.target.value)}
              style={{ minHeight: '120px', padding: '1.2rem', width: '100%', background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '16px', color: 'var(--text)', fontSize: '1rem' }} />
          </div>
          <button onClick={handleSubmit} className="btn-primary-hover"
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '1.5rem',
              borderRadius: '16px',
              background: isGenerating ? 'var(--text-muted)' : 'linear-gradient(to right, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: isGenerating ? 'none' : '0 10px 20px rgba(139, 92, 246, 0.2)',
              transition: 'all 0.3s ease'
            }}>
            {isGenerating ? <div className="loading-animation" style={{ fontSize: '1rem' }}>...</div> : <Sparkles size={20} />} 
            {isGenerating ? 'Generating Your Portfolio...' : 'Generate My PortoVibe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
