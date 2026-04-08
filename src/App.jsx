import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. Paste your actual keys here!
const supabaseUrl = 'https://your-actual-project-url.supabase.co';
const supabaseKey = 'your-actual-long-anon-key-string';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    // Fetches files and orders them neatly by ID
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data) {
      setFiles(data);
    } else {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      {/* Background Graphic / Header */}
      <header style={styles.header}>
        <div style={styles.headerGlow}></div>
        <h1 style={styles.title}>HSC Resource Vault</h1>
        <p style={styles.subtitle}>Your central drive for study materials and notes</p>
      </header>

      {/* Main Content Area */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loading}>Loading your resources...</div>
        ) : files.length === 0 ? (
          <div style={styles.empty}>No materials found. Add some in Supabase!</div>
        ) : (
          <div style={styles.grid}>
            {files.map((file) => (
              <div key={file.id} style={styles.card} className="file-card">
                
                {/* Category Badge */}
                <div style={styles.cardHeader}>
                  <span style={styles.badge}>{file.category || 'General'}</span>
                </div>

                {/* File Title */}
                <h2 style={styles.cardTitle}>{file.title}</h2>

                {/* Open Button */}
                <a 
                  href={file.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.button}
                >
                  <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Material
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Injecting a tiny bit of CSS for the hover effects */}
      <style>{`
        body { margin: 0; background-color: #0f172a; color: white; font-family: 'Inter', system-ui, sans-serif; }
        .file-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .file-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3); }
        .file-card a:hover { background-color: #2563eb !important; }
      `}</style>
    </div>
  );
}

// Inline styles for a clean, 1-file setup
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    position: 'relative',
  },
  headerGlow: {
    position: 'absolute',
    top: '-50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,23,42,0) 70%)',
    zIndex: -1,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    margin: 0,
  },
  main: {
    width: '100%',
    maxWidth: '1000px',
  },
  loading: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '1.2rem',
    padding: '3rem',
  },
  empty: {
    textAlign: 'center',
    color: '#64748b',
    padding: '3rem',
    border: '2px dashed #334155',
    borderRadius: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardHeader: {
    marginBottom: '1rem',
  },
  badge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#f8fafc',
    margin: '0 0 1.5rem 0',
    lineHeight: '1.4',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background-color 0.2s',
    gap: '0.5rem',
  },
  icon: {
    width: '18px',
    height: '18px',
  }
};