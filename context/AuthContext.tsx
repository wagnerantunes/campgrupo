import React, { createContext, useContext, useState, useEffect } from 'react';
import API_URL from '../config/api';

interface AuthContextType {
  token: string | null;
  user: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('camp_token'));
  const [user, setUser] = useState<string | null>(localStorage.getItem('camp_user'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('camp_token', token);
    } else {
      localStorage.removeItem('camp_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('camp_user', user);
    } else {
      localStorage.removeItem('camp_user');
    }
  }, [user]);

  const login = (newToken: string, username: string) => {
    setToken(newToken);
    setUser(username);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
