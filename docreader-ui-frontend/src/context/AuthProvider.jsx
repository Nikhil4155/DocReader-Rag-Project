import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '../api/authApi';
import { isJwtExpired } from '../utils/jwt';
import toast from 'react-hot-toast';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && !isJwtExpired(storedToken)) {
        return storedUser ? JSON.parse(storedUser) : null;
      } else if (storedToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch {
      // Ignore initial state parse failure
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !isJwtExpired(storedToken)) {
        return storedToken;
      }
    } catch {
      // Ignore initial token check error
    }
    return null;
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (token && isJwtExpired(token)) {
      const timer = setTimeout(() => {
        logout();
        toast.error('Session expired, please log in again.');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, logout]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    if (data && data.accessToken) {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.accessToken);
      setUser(data.user);
      return data.user;
    } else {
      throw new Error('Invalid response from server during login');
    }
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    return data;
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
