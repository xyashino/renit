import { loginApi, registerApi } from '@/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from "expo-router";
import { createContext, useContext, type ReactNode } from 'react';
import { Alert } from "react-native";

const TOKEN_KEY = 'rentit_auth';
const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

export type AuthUser = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
};

type StoredAuth = { token: string; user: AuthUser };

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readStoredSession(): Promise<StoredAuth | null> {
  const raw = await AsyncStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as StoredAuth;
}

async function writeStoredSession(response: { token: string } & AuthUser): Promise<StoredAuth> {
  const { token, ...user } = response;
  const stored: StoredAuth = { token, user };
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(stored));
  return stored;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const sessionQuery = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: readStoredSession,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await loginApi(email, password);
      return writeStoredSession(response);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      password: string;
    }) => {
      const response = await registerApi(data);
      return writeStoredSession(response);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, session);
      router.replace('/(tabs)');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Spróbuj ponownie';
      Alert.alert('Błąd rejestracji', message);
      console.error(error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(TOKEN_KEY);
      return null;
    },
    onSuccess: () => {
      Alert.alert('Wylogowano');
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
      router.replace('/(auth)/sign-in');
    },
  });

  const session = sessionQuery.data ?? null;
  const isLoading = sessionQuery.isLoading;

  async function login(email: string, password: string) {
    await loginMutation.mutateAsync({ email, password });
  }

  async function register(data: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    password: string;
  }) {
    await registerMutation.mutateAsync(data);
  }

  async function logout() {
    await logoutMutation.mutateAsync();
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
