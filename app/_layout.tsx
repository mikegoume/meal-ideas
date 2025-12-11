import { AuthProvider } from '@/contexts/AuthContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { db } from '@/lib/db';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

function AppLayout() {
  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return (
      <View>
        <Text>Is Loading</Text>;
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error.message}</Text>;
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="chat/[recipeId]" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(authentication)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    // <Theme name="brand">
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppLayout />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </AuthProvider>
    // </Theme>
  );
}
