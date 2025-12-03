import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ name, password }) => {
    if (!password || typeof password !== 'string') return;
    const role = password[0] === 'D' ? 'admin' : password[0] === 'C' ? 'cashier' : 'guest';
    const profile = { name: name || 'User', role, avatar: '' };
    setUser(profile);
    return profile;
  };

  const verifyCode = ({ name, email, password, code, role }) => {
    // Validate that code matches role
    const codePrefix = code[0].toUpperCase();
    const expectedPrefix = role === 'admin' ? 'D' : 'C';
    
    if (codePrefix !== expectedPrefix) {
      return null;
    }

    const profile = {
      name: name || 'User',
      email: email || '',
      role,
      verificationCode: code,
      avatar: ''
    };
    setUser(profile);
    return profile;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates) => setUser((u) => ({ ...(u || {}), ...updates }));

  const value = useMemo(() => ({ user, login, logout, updateProfile, verifyCode }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
