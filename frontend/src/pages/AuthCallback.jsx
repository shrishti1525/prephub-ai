import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

function AuthCallback({ setToken, setUser }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setErrorMsg(decodeURIComponent(errorParam));
      return;
    }

    const token = searchParams.get('token');
    const userJson = searchParams.get('user');

    if (token) {
      try {
        localStorage.setItem('token', token);
        if (setToken) setToken(token);

        if (userJson) {
          const userObj = JSON.parse(decodeURIComponent(userJson));
          localStorage.setItem('user', JSON.stringify(userObj));
          if (setUser) setUser(userObj);
        }

        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Failed to parse Google OAuth callback payload:', err);
        setErrorMsg('Authentication succeeded, but failed to load user profile. Please try logging in.');
      }
    } else {
      setErrorMsg('No authentication token received from Google.');
    }
  }, [searchParams, navigate, setToken, setUser]);

  if (errorMsg) {
    return (
      <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 20px' }}>
        <div className="card" style={{ padding: '36px', textAlign: 'center' }}>
          <div className="logo-badge" style={{ margin: '0 auto 16px auto', background: '#EF4444' }}>!</div>
          <h2 style={{ fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 12px' }}>
            Authentication Failed
          </h2>
          <div className="alert alert-error" style={{ marginBottom: '20px', textAlign: 'left' }}>
            {errorMsg}
          </div>
          <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', width: '100%' }}>
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '18px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <div>
        <h3 style={{ fontSize: '18px', margin: '0 0 6px', color: 'var(--text-primary)' }}>
          Signing in with Google...
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          Verifying credentials and redirecting to your dashboard
        </p>
      </div>
    </div>
  );
}

export default AuthCallback;
