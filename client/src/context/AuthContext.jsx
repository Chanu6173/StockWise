import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  // Load user data on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.success) {
            setUser(res);
          }
        } catch (error) {
          console.error('Failed to load user profile', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Enter demo mode without any API call
  const enterDemoMode = () => {
    sessionStorage.setItem('demoMode', 'true');
    setDemoMode(true);
    setUser({ name: 'Demo User', email: 'demo@stockwise.app', _id: 'demo' });
    setLoading(false);
  };

  // Register action
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
    setLoading(false);
    return { success: false, message: 'Invalid response from server' };
  };

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
    setLoading(false);
    return { success: false, message: 'Invalid response from server' };
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('demoMode');
    setUser(null);
    setDemoMode(false);
  };

  // Update profile action
  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setUser((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      };
    }
    return { success: false, message: 'Profile update failed' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode,
        enterDemoMode,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
