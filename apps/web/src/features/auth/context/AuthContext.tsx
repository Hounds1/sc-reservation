'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { checkSession, logout as logoutAction, getMe } from '../services/auth';
import { User } from '../services/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      const hasSession = await checkSession();
      setIsAuthenticated(hasSession);
      
      if (hasSession) {
        // 세션이 있으면 사용자 정보 조회
        const userData = await getMe();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAction();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
