import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, enterDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter your email and password');
    }
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Invalid email or password');
    }
  };

  const handleDemo = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: '#F4F3EE',
    border: '1px solid #E5E2DA',
    borderRadius: 8,
    color: '#1F1E1D',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1F1E1D', margin: 0 }}>
          Welcome back
        </h2>
        <p style={{ color: '#6B6762', fontSize: 14, marginTop: 6 }}>
          Sign in to view your portfolio
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#1F1E1D',
              marginBottom: 6,
            }}
          >
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#C15F3C';
              e.target.style.boxShadow = '0 0 0 3px rgba(193,95,60,0.15)';
              e.target.style.background = '#fff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E2DA';
              e.target.style.boxShadow = 'none';
              e.target.style.background = '#F4F3EE';
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#1F1E1D',
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#C15F3C';
              e.target.style.boxShadow = '0 0 0 3px rgba(193,95,60,0.15)';
              e.target.style.background = '#fff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E2DA';
              e.target.style.boxShadow = 'none';
              e.target.style.background = '#F4F3EE';
            }}
          />
        </div>

        {/* Sign In button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            background: isSubmitting ? '#D4896A' : '#C15F3C',
            color: '#ffffff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            marginBottom: 10,
            fontFamily: 'inherit',
            transition: 'background 0.15s, transform 0.1s',
          }}
          onMouseEnter={(e) => !isSubmitting && (e.target.style.background = '#A8512F')}
          onMouseLeave={(e) => !isSubmitting && (e.target.style.background = '#C15F3C')}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ flex: 1, height: 1, background: '#E5E2DA' }} />
          <span style={{ fontSize: 12, color: '#B1ADA1', whiteSpace: 'nowrap' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#E5E2DA' }} />
        </div>

        {/* Try Demo button */}
        <button
          type="button"
          onClick={handleDemo}
          style={{
            width: '100%',
            padding: '12px',
            background: '#F4F3EE',
            color: '#1F1E1D',
            border: '1px solid #E5E2DA',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ECEAE4';
            e.currentTarget.style.borderColor = '#C15F3C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F4F3EE';
            e.currentTarget.style.borderColor = '#E5E2DA';
          }}
        >
          Try Demo — no account needed
        </button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 14,
          color: '#6B6762',
        }}
      >
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          style={{ color: '#C15F3C', fontWeight: 600, textDecoration: 'none' }}
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
