import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

const getRegistrationErrorMessage = (error) => {
  const responseData = error.response?.data;
  const serverMessage = typeof responseData?.message === 'string'
    ? responseData.message
    : typeof responseData === 'string' ? responseData : '';

  if (serverMessage === 'CivicWatch user already exists' || serverMessage === 'An account with this email already exists.') {
    return 'An account with this email already exists. Sign in or use a different email.';
  }
  if (error.response?.status === 403 || error.response?.status === 409) {
    return serverMessage || 'This administrator account cannot be registered.';
  }
  if (serverMessage === 'Invalid administrator credentials.') {
    return serverMessage;
  }
  if (error.response?.status === 400) {
    return 'We could not create your account with those details. Please check them and try again.';
  }
  if (!error.response) {
    return 'We could not connect to the registration service. Check your internet connection and try again.';
  }
  return 'Registration is temporarily unavailable. Please try again later.';
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Token is automatically attached by our api interceptor
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Could not reach the sign-in service.'
      };
    }
  };

  const register = async (name, email, password, role = 'citizen') => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: getRegistrationErrorMessage(error)
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
