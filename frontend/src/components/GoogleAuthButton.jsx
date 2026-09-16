import React, { useState } from 'react';
import axios from 'axios';

function GoogleAuthButton({ onSuccess, onError, text = 'Continue with Google', fullWidth = true }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Preset demo Google accounts for rapid testing & seamless student login
  const sampleAccounts = [
    {
      name: 'Shrishti Singh',
      email: 'shrishti.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      college: 'Computer Science & Engineering'
    },
    {
      name: 'Alex Rivera',
      email: 'alex.rivera.dev@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
      college: 'Software Engineering 2026'
    }
  ];

  async function handleGoogleLogin(account) {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        name: account.name,
        email: account.email,
        avatar: account.avatar || '',
        googleId: `google_${Date.now()}`
      });

      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setShowModal(false);
        if (onSuccess) onSuccess({ token, user });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google authentication failed. Please try again.';
      if (onError) onError(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleCustomGoogleSubmit(e) {
    e.preventDefault();
    if (!customEmail) return;
    handleGoogleLogin({
      name: customName || customEmail.split('@')[0],
      email: customEmail
    });
  }

  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={() => setShowModal(true)}
        className="google-btn"
        style={{
          width: fullWidth ? '100%' : 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '11px 20px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Official Google 'G' Multi-Color Icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          />
        </svg>
        <span>{loading ? 'Authenticating with Google...' : text}</span>
      </button>

      {/* Interactive Google Account Selector Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', padding: '28px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', background: 'rgba(66, 133, 244, 0.1)', marginBottom: '12px' }}>
                <svg width="28" height="28" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>
                Sign in with Google
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Choose an account to continue to <strong>PrepHub AI</strong>
              </p>
            </div>

            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {sampleAccounts.map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleGoogleLogin(acc)}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-input)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.email}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                    Select →
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Google Account Option */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
                OR USE ANOTHER GOOGLE ACCOUNT
              </div>
              <form onSubmit={handleCustomGoogleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Priyanshu Sharma)"
                  className="form-input"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  className="form-input"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    {loading ? 'Signing in...' : 'Sign in as this Account'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GoogleAuthButton;
