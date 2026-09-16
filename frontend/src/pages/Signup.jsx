import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import { API_BASE_URL } from '../config/api.js';

function Signup({ setToken, setUser }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setMessage(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}auth/signup`, formData);
      const { token, user } = response.data;

      setToken(token);
      localStorage.setItem('token', token);

      if (user) {
        if (setUser) setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      }

      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 20px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="logo-badge" style={{ margin: '0 auto 12px auto' }}>P</div>
          <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', margin: 0 }}>Create PrepHub Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Start your placement sprint today
          </p>
        </div>

        {message && <div className="alert alert-error">{message}</div>}

        {/* Google Authentication Option */}
        <div style={{ marginBottom: '18px' }}>
          <GoogleAuthButton
            text="Sign up with Google"
            onSuccess={({ token, user }) => {
              setToken(token);
              if (setUser) setUser(user);
              navigate('/dashboard');
            }}
            onError={(err) => setMessage(err)}
          />

          <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Or register with email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              name="name"
              className="form-input"
              placeholder="e.g. Shrishti Singh"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              name="email"
              className="form-input"
              placeholder="you@college.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Get Started Free'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#60B5FF', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;