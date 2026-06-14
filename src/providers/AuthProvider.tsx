import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { loginApi } from '@/services/auth/auth.service';
import { AuthContextData, SessionUser } from '@/types/auth';

const TOKEN_KEY = 'scge_token';
const USER_KEY = 'scge_user';

const demoUser: SessionUser = {
  id: 'demo-admin',
  nome: 'Diogo Queiroz',
  email: 'demo@scge.com',
  role: 'Administrador',
};

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function persistSession(nextToken: string, nextUser: SessionUser) {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, nextToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser)),
    ]);

    setToken(nextToken);
    setUser(nextUser);
  }

  async function signIn(email: string, senha: string) {
    const response = await loginApi(email, senha);
    const nextUser: SessionUser = {
      id: email,
      nome: email.split('@')[0] || 'Usuario SCGE',
      email,
      role: 'Administrador',
    };

    await persistSession(response.data.access_token, nextUser);
  }

  async function signInDemo() {
    await persistSession('demo-token', demoUser);
  }

  async function signOut() {
    await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user,
      signIn,
      signInDemo,
      signOut,
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  }

  return context;
}
