import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { AuthProvider, useAuth } from '@/src/shared/auth';
import { PortalHost } from '@rn-primitives/portal';
import { isUnauthorizedError } from '@/src/shared/api/errors';
import { notifyUnauthorized } from '@/src/shared/auth/infrastructure/auth-events';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';
import { ErrorBoundaryProps, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { THEME } from '@/src/shared/constants/theme';
import '../styles/global.css';

function handleQueryError(error: unknown): void {
  console.error(error);
  if (!isUnauthorizedError(error)) return;
  notifyUnauthorized();
}

function createQueryClient() {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: handleQueryError,
    }),
    mutationCache: new MutationCache({
      onError: handleQueryError,
    }),
  });

  return queryClient;
}

const queryClient = createQueryClient();

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[scheme];
  const isAuthenticated = !!user;
  const isClient = user?.accountType === 'client';
  const isOwner = user?.accountType === 'owner';

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            color: colors.foreground,
            fontWeight: '700',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTintColor: colors.foreground,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Protected guard={!isLoading && !isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isLoading && isAuthenticated && isClient}>
          <Stack.Screen name="client" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isLoading && isAuthenticated && isOwner}>
          <Stack.Screen name="owner" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <PortalHost />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="w-full gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
        <Text className="text-sm font-medium text-destructive">
          Wystapil blad aplikacji. Sprobuj ponownie.
        </Text>
        <Button
          size="sm"
          onPress={() => {
            reset();
            retry();
          }}
          className="self-start"
        >
          <Text variant="small">Sprobuj ponownie</Text>
        </Button>
      </View>
    </View>
  );
}
