import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Eye, EyeOff, Trash2, Layout, Clock, Globe, Lock, User, Edit3 } from 'lucide-react';
import { EditPortfolioModal } from '../components/modals/EditPortfolioModal';

const MyPortfolios = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const navigate = useNavigate();

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchPortfolios = async () => {
      try {
        const q = query(collection(db, "portfolios"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by createdAt descending
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPortfolios(data);
      } catch (err) {
        console.error("Error fetching portfolios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user, navigate]);

  const toggleVisibility = async (portfolioId, currentVisibility) => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
    try {
      await updateDoc(doc(db, "portfolios", portfolioId), { visibility: newVisibility });
      setPortfolios(prev => prev.map(p => p.id === portfolioId ? { ...p, visibility: newVisibility } : p));
    } catch (err) {
      console.error("Error updating visibility:", err);
    }
  };

  const deletePortfolio = async (portfolioId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus portofolio ini?")) return;
    try {
      await deleteDoc(doc(db, "portfolios", portfolioId));
      setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
    } catch (err) {
      console.error("Error deleting portfolio:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyItems: 'center', width: '100%' }}>
        <p style={{ margin: 'auto', color: 'var(--text-secondary)' }}>Memuat portofolio Anda...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
      <header className="portfolios-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--title-size, 2.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>Portofolio Saya</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Kelola dan atur visibilitas karya AI Anda.</p>
        </div>
        <Link to="/maker" style={{
          padding: '0.8rem 1.5rem',
          background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
          color: 'white',
          borderRadius: '12px',
          textDecoration: 'none',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap'
        }}>
          <Layout size={18} /> Buat Baru
        </Link>
      </header>

      {portfolios.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '6rem 2rem',
          background: 'var(--card-bg)',
          borderRadius: '24px',
          border: '1px solid var(--card-border)'
        }}>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <Layout size={64} strokeWidth={1} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text)', marginBottom: '1rem' }}>Belum ada portofolio</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Anda belum membuat portofolio apa pun. Mulai buat sekarang!</p>
          <Link to="/maker" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none' }}>Mulai Membuat &rarr;</Link>
        </div>
      ) : (
        <div className="portfolios-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {portfolios.map((item) => (
            <div key={item.id} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '20px',
              padding: '1.5rem',
              transition: 'transform 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <User size={20} />
                </div>
                <div style={{ 
                  padding: '0.4rem 0.8rem', 
                  borderRadius: '50px', 
                  background: item.visibility === 'public' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                  color: item.visibility === 'public' ? '#22c55e' : '#6b7280',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  {item.visibility === 'public' ? <Globe size={12} /> : <Lock size={12} />}
                  {item.visibility === 'public' ? 'Public' : 'Private'}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem' }}>
                  {item.meta?.username || 'Untitled Portfolio'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Clock size={14} />
                  {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.8rem' }}>
                <Link 
                  to={`/${item.meta?.username}`} 
                  target="_blank"
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <ExternalLink size={16} /> Lihat
                </Link>
                <button 
                  onClick={() => setEditingPortfolio(item)}
                  style={{
                    padding: '0.7rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Edit Portofolio"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => toggleVisibility(item.id, item.visibility)}
                  style={{
                    padding: '0.7rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={item.visibility === 'public' ? "Jadikan Private" : "Jadikan Publik"}
                >
                  {item.visibility === 'public' ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button 
                  onClick={() => deletePortfolio(item.id)}
                  style={{
                    padding: '0.7rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '10px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingPortfolio && (
        <EditPortfolioModal 
          portfolio={editingPortfolio} 
          apiKey={apiKey}
          onClose={() => setEditingPortfolio(null)}
          onUpdate={(updatedData) => {
            setPortfolios(prev => prev.map(p => p.id === editingPortfolio.id ? { ...p, ...updatedData } : p));
          }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          .portfolios-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
          .portfolios-grid {
            grid-template-columns: 1fr !important;
          }
          :root {
            --title-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyPortfolios;
