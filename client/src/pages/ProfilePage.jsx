import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Loader2, KeyRound } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  // Profile details state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      return toast.error('Please enter name and email');
    }

    try {
      setIsSubmitting(true);
      const res = await updateProfile({ name, email });
      if (res.success) {
        toast.success('Profile details updated successfully!');
      } else {
        toast.error(res.message || 'Profile update failed');
      }
    } catch (error) {
      toast.error('Profile update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in all password fields');
    }

    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      setIsSubmitting(true);
      const res = await updateProfile({
        name,
        email,
        password: newPassword,
      });

      if (res.success) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Password update failed');
      }
    } catch (error) {
      toast.error('Password update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px 10px 38px',
    background: '#F4F3EE',
    border: '1px solid #E5E2DA',
    borderRadius: 8,
    color: '#1F1E1D',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#1F1E1D',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 6,
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
      }}
    >
      {/* Edit Profile Details Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          padding: '28px',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1F1E1D', margin: '0 0 4px' }}>
            Profile Configurations
          </h3>
          <p style={{ fontSize: 13, color: '#6B6762', margin: 0 }}>
            Configure your personal account identity info
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 12,
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  color: '#B1ADA1',
                }}
              >
                <User size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 12,
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  color: '#B1ADA1',
                }}
              >
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              width: '100%',
              padding: '12px',
              background: isSubmitting ? '#D4896A' : '#C15F3C',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease',
              marginTop: 4,
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = '#A8512F')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.background = '#C15F3C')}
          >
            {isSubmitting ? (
              <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : (
              'Save Profile Details'
            )}
          </button>
        </form>
      </div>

      {/* Edit Password Card */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E5E2DA',
          borderRadius: 12,
          padding: '28px',
          boxShadow: '0 1px 3px rgba(31,30,29,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1F1E1D', margin: '0 0 4px' }}>
            Security Settings
          </h3>
          <p style={{ fontSize: 13, color: '#6B6762', margin: 0 }}>
            Configure user password credentials
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Current Password */}
          <div>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 12,
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  color: '#B1ADA1',
                }}
              >
                <Lock size={16} />
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label style={labelStyle}>New Password</label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 12,
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  color: '#B1ADA1',
                }}
              >
                <KeyRound size={16} />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                placeholder="•••••••• (Min 6 chars)"
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 12,
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  color: '#B1ADA1',
                }}
              >
                <Lock size={16} />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                onFocus={focusHandler}
                onBlur={blurHandler}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              width: '100%',
              padding: '12px',
              background: isSubmitting ? '#D4896A' : '#C15F3C',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s ease',
              marginTop: 4,
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = '#A8512F')}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.background = '#C15F3C')}
          >
            {isSubmitting ? (
              <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
            ) : (
              'Save New Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
