import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Decode JWT payload without a library
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return false;
  // exp is in seconds; Date.now() is ms
  return decoded.exp * 1000 < Date.now();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('w3b_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('w3b_token');
    // If token exists but is expired, clear it
    if (t && isTokenExpired(t)) {
      localStorage.removeItem('w3b_token');
      localStorage.removeItem('w3b_user');
      return null;
    }
    return t || null;
  });

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return;
    const msUntilExpiry = decoded.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(() => logout(), msUntilExpiry);
    return () => clearTimeout(timer);
  }, [token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('w3b_user', JSON.stringify(userData));
    localStorage.setItem('w3b_token', tokenData);
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('w3b_user');
    localStorage.removeItem('w3b_token');
    // Also clear old keys if any
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
