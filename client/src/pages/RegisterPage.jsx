import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return toast.error('Please fill in all fields');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setIsSubmitting(true);
    const res = await register(name, email, password);
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Account created! Welcome to StockWise.');
      navigate('/dashboard');
    } else {
      toast.error(res.message || 'Registration failed');
    }
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

  const focusHandler = (e) => {
    e.target.style.borderColor = '#C15F3C';
    e.target.style.boxShadow = '0 0 0 3px rgba(193,95,60,0.15)';
    e.target.style.background = '#fff';
  };
  const blurHandler = (e) => {
    e.target.style.borderColor = '#E5E2DA';
    e.target.style.boxShadow = 'none';
    e.target.style.background = '#F4F3EE';
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1F1E1D', margin: 0 }}>
          Create your account
        </h2>
        <p style={{ color: '#6B6762', fontSize: 14, marginTop: 6 }}>
          Start tracking your investments today
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {[
          { label: 'Full name', value: name, setter: setName, type: 'text', placeholder: 'Jane Doe' },
          { label: 'Email address', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
          { label: 'Password', value: password, setter: setPassword, type: 'password', placeholder: '•••••••• (min. 6 chars)' },
          { label: 'Confirm password', value: confirmPassword, setter: setConfirmPassword, type: 'password', placeholder: '••••••••' },
        ].map(({ label, value, setter, type, placeholder }) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#1F1E1D',
                marginBottom: 6,
              }}
            >
              {label}
            </label>
            <input
              type={type}
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={placeholder}
              required
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
          </div>
        ))}

        <div style={{ marginTop: 8 }}>
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
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => !isSubmitting && (e.target.style.background = '#A8512F')}
            onMouseLeave={(e) => !isSubmitting && (e.target.style.background = '#C15F3C')}
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </div>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 14,
          color: '#6B6762',
        }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: '#C15F3C', fontWeight: 600, textDecoration: 'none' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
