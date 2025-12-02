import { AuthProvider } from '@/contexts/AuthContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, vars } from 'nativewind';
import { ReactElement } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

const themes = {
  brand: {
    light: vars({
      '--color-primary': 'black',
      '--color-secondary': 'white',
    }),
    dark: vars({
      '--color-primary': 'white',
      '--color-secondary': 'dark',
    }),
  },
  christmas: {
    light: vars({
      '--color-primary': 'red',
      '--color-secondary': 'green',
    }),
    dark: vars({
      '--color-primary': 'green',
      '--color-secondary': 'red',
    }),
  },
};

type ThemeProps = {
  children: ReactElement;
  name: 'brand' | 'christmas';
};

function Theme({ children, name }: ThemeProps) {
  const { colorScheme } = useColorScheme();

  console.log(colorScheme);

  if (!colorScheme) return;

  return <View style={themes[name][colorScheme]}>{children}</View>;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <Theme name="brand">
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(authentication)" />
            <Stack.Screen name="recipe/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="chat/[recipeId]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </GestureHandlerRootView>
      </AuthProvider>
    </Theme>
  );
}
