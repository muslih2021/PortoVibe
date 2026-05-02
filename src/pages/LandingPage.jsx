import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuPalette, LuMonitorSmartphone } from "react-icons/lu";
import { HiLightningBolt } from "react-icons/hi";
import { HiGlobeAlt } from "react-icons/hi2";
import kucingTidur from '../assets/images/kucing tdr.png';
import kucingBangun from '../assets/images/kucing bangun.png';
import kucingBerdiri from '../assets/images/kucing berdiri.png';
import bubbleKucingKerja from '../assets/images/bumble text kucing kerja.png';
import suaraKucing from '../assets/audio/suara kucing.mp3';
import { askKucing } from '../services/kucingService';
import catOff1 from '../assets/images/cat_office/Gemini_Generated_Image_2pr7s22pr7s22pr7.png';
import catOff2 from '../assets/images/cat_office/Gemini_Generated_Image_9i95109i95109i95.png';
import catOff3 from '../assets/images/cat_office/Gemini_Generated_Image_by8traby8traby8t.png';
import catOff4 from '../assets/images/cat_office/Gemini_Generated_Image_emsg3xemsg3xemsg.png';
import catOff5 from '../assets/images/cat_office/Gemini_Generated_Image_j8mtmcj8mtmcj8mt.png';
import catOff6 from '../assets/images/cat_office/Gemini_Generated_Image_nuzwdjnuzwdjnuzw.png';
import catOff7 from '../assets/images/cat_office/Gemini_Generated_Image_rk78pirk78pirk78.png';

const LandingPage = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCatShaking, setIsCatShaking] = useState(false);
  const [isCatAwake, setIsCatAwake] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const initialCatText = "Meow! Saya akan menjawab pertanyaan mu tentang portofolio dan juga sistem di website ini .";
  const [targetText, setTargetText] = useState(initialCatText);

  const handleCatClick = () => {
    if (isCatAwake) {
      playCatSound();
      return;
    }

    if (!isCatShaking) {
      setIsCatShaking(true);
      setTimeout(() => {
        setIsCatShaking(false);
      }, 500);
    }

    setIsCatAwake(true);
    setTimeout(() => {
      setShowDialog(true);
    }, 3000);

    playCatSound();
  };

  const playCatSound = () => {
    const audio = new Audio(suaraKucing);
    audio.play().catch(e => console.error("Error playing audio:", e));
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setIsCatAwake(false);
    setTargetText(initialCatText);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAsking) return;

    setIsAsking(true);
    setTargetText("Mengeong memikirkan jawaban...");

    try {
      const answer = await askKucing(chatInput);
      setTargetText(answer);
    } catch (err) {
      setTargetText("Meow... maaf, sistem sedang bermasalah.");
    } finally {
      setIsAsking(false);
      setChatInput("");
    }
  };

  useEffect(() => {
    if (showDialog && targetText) {
      setDisplayedText("");
      let currentIndex = 0;


      playCatSound();

      const interval = setInterval(() => {
        if (currentIndex < targetText.length) {
          setDisplayedText(targetText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [showDialog, targetText]);

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

  const benefits = [
    { title: 'AI-Powered Layouts', desc: 'Tidak perlu desain manual. AI kami merancang layout yang sempurna untuk Anda.', icon: <HiLightningBolt size={32} style={{ fill: "url(#icon-gradient)" }} /> },
    { title: 'Premium Themes', desc: 'Pilih dari berbagai filosofi desain mulai dari Bauhaus hingga Luxury Editorial.', icon: <LuPalette size={32} style={{ stroke: "url(#icon-gradient)" }} /> },
    { title: 'Instant Live URL', desc: 'Bagikan hasil karyamu ke dunia dengan URL unik yang langsung aktif.', icon: <HiGlobeAlt size={32} style={{ fill: "url(#icon-gradient)" }} /> },
    { title: 'Responsive Design', desc: 'Website Anda akan terlihat menakjubkan di ponsel, tablet, maupun desktop.', icon: <LuMonitorSmartphone size={32} style={{ stroke: "url(#icon-gradient)" }} /> }
  ];

  const faqs = [
    { q: "Apa itu PortoVibe AI?", a: "PortoVibe AI adalah platform portfolio builder yang menggunakan kecerdasan buatan untuk mengubah CV Anda menjadi website portofolio yang mewah dan interaktif secara instan." },
    { q: "Apakah saya perlu bisa coding?", a: "Sama sekali tidak! PortoVibe dirancang agar siapa pun bisa membangun portofolio berkelas dunia tanpa menulis satu baris kode pun. AI kami yang akan menangani semua aspek teknis." },
    { q: "Bagaimana cara mengunggah CV?", a: "Anda cukup klik tombol 'Mulai Buat', pilih tema yang Anda sukai, lalu unggah file PDF CV Anda. AI akan langsung mengekstrak data Anda secara otomatis." },
    { q: "Apakah website hasil AI bisa diedit?", a: "Saat ini hasil website bersifat statis berdasarkan data CV Anda. Namun, Anda bisa melakukan 'Re-generate' dengan instruksi khusus untuk mengubah gaya atau fokus konten." },
    { q: "Apakah ini gratis?", a: "Ya! Anda bisa mencoba membuat dan melihat portofolio Anda secara gratis sebagai bagian dari komitmen kami membantu profesional tampil menonjol." }
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', transition: 'all 0.3s ease' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </svg>
      <section className="reveal hero-section" style={{ padding: '12rem 2rem 6rem', textAlign: 'center', position: 'relative' }}>

        <div className="kucing-tidur-container">
          <div className="kucing-tidur-wrapper">
            <div style={{ position: 'relative' }}>
              <img
                src={kucingTidur}
                alt="Kucing Tidur"
                className={`kucing-tidur-img ${isCatShaking ? 'cat-shake-animate' : ''}`}
                onClick={handleCatClick}
                style={{ opacity: isCatAwake ? 0 : 1, transition: 'opacity 0.8s ease' }}
              />
              <img
                src={kucingBangun}
                alt="Kucing Bangun"
                className={`kucing-tidur-img ${isCatShaking ? 'cat-shake-animate' : ''}`}
                onClick={handleCatClick}
                style={{ opacity: isCatAwake ? 1 : 0, transition: 'opacity 0.8s ease', position: 'absolute', top: 0, left: 0, pointerEvents: isCatAwake ? 'auto' : 'none' }}
              />
            </div>

            <div style={{ opacity: isCatAwake ? 0 : 1, transition: 'opacity 0.8s ease', pointerEvents: isCatAwake ? 'none' : 'auto' }}>
              <div className="zzzz-container">
                <span className="zzzz-animate zzzz-char zzzz-1">z</span>
                <span className="zzzz-animate zzzz-char zzzz-2">z</span>
                <span className="zzzz-animate zzzz-char zzzz-3">z</span>
              </div>

              <div className="bubble-occasional bubble-occasional-container">
                <div className="bubble-wrapper">
                  <img src={bubbleKucingKerja} alt="Bubble" className="bubble-img" loading="lazy" />
                  <div className="bubble-text">
                    bangunkan aku kalau mau bertanya sesuatu, klik aku!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className='text-hero-title' style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, color: 'var(--text)' }}>
          Saatnya Kamu Jadi <br />
          <span className="animated-gradient-text">PortoVibe Maker!</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Ubah CV membosankanmu menjadi website portofolio mewah dalam hitungan detik.
          Gunakan kekuatan AI untuk membangun dunia profesionalmu.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={onStart} className="btn-primary-hover" style={{ padding: '1rem 2.5rem', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', color: '#fff', borderRadius: '50px', border: 'none', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)' }}>
            Mulai Sekarang →
          </button>
          <Link to="/showcase" className="btn-secondary-hover" style={{ padding: '1rem 2.5rem', background: 'transparent', color: '#8b5cf6', borderRadius: '50px', border: '2px solid #8b5cf6', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
            Lihat Hasil Karya AI
          </Link>
        </div>
      </section>

      <section className="showcase-grid image-landing-page" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="showcase-row-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {[catOff1, catOff2, catOff3, catOff4].map((url, i) => (
            <div key={i} onClick={() => setSelectedImage(url)} className={`${i % 2 === 0 ? 'reveal-left' : 'reveal-right'} stagger-${i + 1}`} style={{ height: '320px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', cursor: 'zoom-in', transition: 'transform 0.3s ease' }}>
              <img src={url} alt="Showcase" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="showcase-row-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[catOff5, catOff6, catOff7].map((url, i) => (
            <div key={i} onClick={() => setSelectedImage(url)} className={`${i === 1 ? 'reveal' : (i === 0 ? 'reveal-left' : 'reveal-right')} stagger-${i + 2}`} style={{ height: '420px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', cursor: 'zoom-in', transition: 'transform 0.3s ease' }}>
              <img src={url} alt="Showcase" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', cursor: 'zoom-out', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img src={selectedImage} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: '85vh', borderRadius: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', transform: 'scale(1)', animation: 'zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} />
            <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} style={{ position: 'absolute', top: '-40px', right: '-40px', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>×</button>
          </div>
        </div>
      )}

      {showDialog && (
        <div className="vn-overlay">
          <button className="vn-close-btn" onClick={handleCloseDialog}>×</button>
          <div className="vn-scene">
            <div className="vn-actors">
              <div className="vn-actor-left">
                <img src={kucingBerdiri} alt="Kucing Berdiri" loading="lazy" />
              </div>
              <div className="vn-actor-right">
                <h3>Ada yang ingin ditanyakan?</h3>
                <form onSubmit={handleChatSubmit}>
                  <textarea
                    placeholder="Ketik pesan Anda di sini..."
                    rows={3}
                    required
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isAsking}
                  ></textarea>
                  <button type="submit" disabled={isAsking}>
                    {isAsking ? 'Loading...' : 'Kirim Pesan'}
                  </button>
                </form>
              </div>
            </div>
            <div className="vn-dialog-box">
              <span className="vn-name-tag">Kucing Vibes</span>
              <div className="vn-dialog-content" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' }}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="features" className="reveal benefits-section" style={{ padding: '10rem 2rem', textAlign: 'center', background: 'var(--section-bg)', transition: 'all 0.3s ease' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '5rem', color: 'var(--text)' }}>
          <span style={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Benefit Seru</span> Buat Kamu yang Gabung!
        </h2>
        <div className="benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', maxWidth: '1300px', margin: '0 auto' }}>
          {benefits.map((b, i) => (
            <div key={i} className={`benefit-card glow-card ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'} stagger-${i + 1}`} style={{ padding: '3rem 2rem', borderRadius: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '1.5rem' }}>{b.icon}</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>{b.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="faq-section" style={{ padding: '8rem 2rem', background: 'var(--bg)' }}>
        <div className="faq-container" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
          <div className="reveal">
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              <span style={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Frequently Asked Questions</span>
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Temukan jawaban untuk pertanyaan umum yang sering ditanyakan tentang PortoVibe AI.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} className={`reveal stagger-${i + 1} glow-card`} onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ padding: '1.5rem', borderRadius: '24px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                  {faq.q}
                  <span style={{ color: '#8b5cf6', fontSize: '1.5rem', transition: '0.3s', transform: activeFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>{activeFaq === i ? '×' : '+'}</span>
                </div>
                {activeFaq === i && (
                  <div style={{ marginTop: '1rem', color: '#8b5cf6', lineHeight: 1.6, fontWeight: 500, fontSize: '0.95rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal cta-section" style={{ padding: '8rem 2rem', textAlign: 'center', backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200")', backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff', margin: '2rem 2rem 4rem', borderRadius: '40px', overflow: 'hidden', position: 'relative' }}>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 700, marginBottom: '2rem', position: 'relative', zIndex: 1 }}>Elevate your portfolio with <br /> a professional vibe</h2>
        <Link to="/auth" state={{ mode: 'register' }} className="btn-primary-hover" style={{ padding: '1rem 3.5rem', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', color: '#fff', borderRadius: '50px', border: 'none', fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', position: 'relative', zIndex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.3)', textDecoration: 'none', display: 'inline-block' }}>Daftar Sekarang</Link>
      </section>
    </div>
  );
};

export default LandingPage;
