import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../services/api';
import { User } from '../types/domain';

interface AuthContextData {
  user: User | null;
  isLoadingAuth: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signInDemo: () => Promise<void>;
  signUp: (payload: {
    name: string;
    email: string;
    password: string;
    dietGoal?: number;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (payload: { name?: string; dietGoal?: number }) => Promise<User>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    if (!cached) return null;
    try {
      return JSON.parse(cached) as User;
    } catch {
      return null;
    }
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const persistSession = useCallback((nextUser: User, token: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setIsLoadingAuth(false);
      return;
    }

    api.auth
      .me()
      .then(({ user: freshUser }) => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        clearSession();
      })
      .finally(() => {
        setIsLoadingAuth(false);
      });
  }, [clearSession]);

  useEffect(() => {
    const handleUnauthorized = () => clearSession();
    window.addEventListener('dailydiet:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('dailydiet:unauthorized', handleUnauthorized);
  }, [clearSession]);

  const signIn = useCallback(
    async (credentials: { email: string; password: string }) => {
      const { user: loggedUser, token } = await api.auth.login(credentials);
      persistSession(loggedUser, token);
    },
    [persistSession],
  );

  const signInDemo = useCallback(async () => {
    const { user: demoUser, token } = await api.auth.loginDemo();
    persistSession(demoUser, token);
  }, [persistSession]);

  const signUp = useCallback(
    async (payload: { name: string; email: string; password: string; dietGoal?: number }) => {
      const { user: createdUser, token } = await api.auth.register(payload);
      persistSession(createdUser, token);
    },
    [persistSession],
  );

  const signOut = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignora falha de rede no logout para garantir limpeza local
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const updateUserProfile = useCallback(
    async (payload: { name?: string; dietGoal?: number }) => {
      const { user: updated } = await api.auth.updateProfile(payload);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
      return updated;
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        signIn,
        signInDemo,
        signUp,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
