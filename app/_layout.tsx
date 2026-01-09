import AuthProvider from '@/contexts/AuthContext';
import { useAuthContext } from '@/hooks/useAuth';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

function AppLayout() {
  const { isLoggedIn } = useAuthContext();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="chat/[recipeId]" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(authentication)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppLayout />
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
