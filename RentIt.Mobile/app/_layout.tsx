import { Button } from '@/src/shared/ui/components/button';
import { Text } from '@/src/shared/ui/components/text';
import { AuthProvider } from '@/src/shared/auth/session';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundaryProps, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from "react";
import { View } from 'react-native';
import 'react-native-reanimated';
import { THEME } from '@/src/shared/constants/theme';
import '../styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const { colorScheme = 'light' } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = THEME[scheme];

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
          <Stack.Screen name="client" options={{ headerShown: false }} />
          <Stack.Screen name="owner" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
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
