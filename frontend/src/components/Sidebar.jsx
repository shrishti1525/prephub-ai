import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/coach', label: 'AI Study Coach', icon: '🧭', badge: 'PRO' },
    { to: '/dsa-tracker', label: 'DSA Tracker', icon: '⚡' },
    { to: '/aptitude', label: 'Aptitude Practice', icon: '🎯' },
    { to: '/resume', label: 'Resume & ATS', icon: '📄' },
    { to: '/experiences', label: 'Interview Archive', icon: '💼' },
    { to: '/notes', label: 'Prep Notes', icon: '📝' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <div className="logo-badge">P</div>
          <div className="logo-text">
            PrepHub <span>AI</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: '2px' }}>
          <span className="live-dot" style={{ width: '6px', height: '6px' }} />
          <span>Gemini AI Connected</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  color: '#fff',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  letterSpacing: '0.5px'
                }}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {/* Motivational Streak Widget inside Sidebar */}
        <div
          style={{
            marginTop: 'auto',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '24px' }}>🔥</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Daily Placement Sprint</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Keep momentum going!</div>
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-snippet">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Student'}</div>
            <div className="user-email">{user?.email || 'Logged in'}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: '4px' }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
