import React, { useState } from 'react';

function GoogleAuthButton({ onSuccess, onError, text = 'Continue with Google', fullWidth = true, disabled = false }) {
  const [loading, setLoading] = useState(false);

  function handleGoogleSignIn() {
    if (disabled || loading) return;
    setLoading(true);

    const googleClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '210805382032-pddbsivr12ir7s93qpeofnbvd6gvkihu.apps.googleusercontent.com';

    const rawApiUrl = import.meta.env.VITE_CLIENT_URI || 'http://localhost:5000/api/';
    const apiBaseUrl = rawApiUrl.replace(/\/+$/, '') + '/';
    const callbackUrl = `${apiBaseUrl}auth/google/callback`;

    // Center popup coordinates
    const width = 500;
    const height = 620;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

    // Directly open Google's OAuth2 consent screen in the popup window
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      googleClientId
    )}&redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&scope=openid%20profile%20email&prompt=select_account&state=popup`;

    const popup = window.open(
      googleAuthUrl,
      'google_oauth_popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,resizable=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setLoading(false);
      if (onError) onError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      return;
    }

    const handleMessage = (event) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage);
        clearInterval(pollTimer);
        setLoading(false);

        const { token, user } = event.data;
        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          if (onSuccess) onSuccess({ token, user });
        }
      } else if (event.data?.type === 'GOOGLE_AUTH_FAILURE') {
        window.removeEventListener('message', handleMessage);
        clearInterval(pollTimer);
        setLoading(false);
        if (onError) onError(event.data.error || 'Google authentication failed. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);

    const pollTimer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(pollTimer);
        window.removeEventListener('message', handleMessage);
        setLoading(false);
      }
    }, 600);
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={handleGoogleSignIn}
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
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
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
      <span>{loading ? 'Opening Google...' : text}</span>
    </button>
  );
}

export default GoogleAuthButton;
