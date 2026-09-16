import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DsaTracker from './pages/DsaTracker.jsx';
import Aptitude from './pages/Aptitude.jsx';
import ResumeManager from './pages/ResumeManager.jsx';
import InterviewExperiences from './pages/InterviewExperiences.jsx';
import Notes from './pages/Notes.jsx';
import AiCoach from './pages/AiCoach.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  // Determine topbar page title
  const routeTitles = {
    '/dashboard': 'Placement Preparation Dashboard',
    '/coach': 'Personalized AI Study Coach',
    '/dsa-tracker': 'DSA Problem Tracker',
    '/aptitude': 'Aptitude Practice & Tests',
    '/resume': 'Resume & AI ATS Scanner',
    '/experiences': 'Interview Experience Archive',
    '/notes': 'Placement Revision Notes'
  };
  const currentTitle = routeTitles[location.pathname] || 'PrepHub AI';

  // If not logged in, render simple public navbar + landing
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}
        >
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge">P</div>
            <span style={{ fontWeight: 700, fontSize: '18px', color: '#fff' }}>
              PrepHub <span style={{ color: '#60B5FF' }}>AI</span>
            </span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/" className="btn btn-secondary btn-sm">Home</Link>
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </nav>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home token={token} />} />
            <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
            <Route path="/signup" element={<Signup setToken={setToken} setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  // Authenticated SaaS App Shell with Sidebar
  return (
    <div className="app-layout">
      <Sidebar user={user} onLogout={handleLogout} />

      <div className="main-wrapper">
        <header className="top-bar">
          <div className="page-title-wrap">
            <h2>{currentTitle}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Home Overview
            </Link>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name || 'Candidate'}</span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/dashboard" element={<Dashboard token={token} />} />
            <Route path="/coach" element={<AiCoach token={token} />} />
            <Route path="/dsa-tracker" element={<DsaTracker token={token} />} />
            <Route path="/aptitude" element={<Aptitude token={token} />} />
            <Route path="/resume" element={<ResumeManager token={token} />} />
            <Route
              path="/experiences"
              element={<InterviewExperiences token={token} currentUser={user} />}
            />
            <Route path="/notes" element={<Notes token={token} />} />
            <Route path="/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;