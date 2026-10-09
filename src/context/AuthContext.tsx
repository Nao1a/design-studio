import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  status?: 'pending' | 'verified' | 'rejected';
  department?: string;
  studentId?: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<any>;
  register: (memberData: {
    name: string;
    email: string;
    password: string;
    department?: string;
    studentId?: string;
    phone?: string;
    bio?: string;
  }) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isMember: boolean;
  isVerifiedMember: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => ({}),
  logout: () => {},
  refreshUser: async () => {},
  isAdmin: false,
  isMember: false,
  isVerifiedMember: false,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('aau_admin_token');
    const savedUser = localStorage.getItem('aau_user_data');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const register = async (memberData: any) => {
    const data = await authApi.register(memberData);
    return data;
  };

  const refreshUser = async () => {
    try {
      const data = await authApi.getMe();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('aau_user_data', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error('Failed to refresh user profile', e);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'admin';
  const isMember = user?.role === 'member';
  const isVerifiedMember = user?.role === 'member' && user?.status === 'verified';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        refreshUser,
        isAdmin,
        isMember,
        isVerifiedMember,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
