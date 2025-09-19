import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const FavoritesLayout = () => {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            headerTitle: 'Your Favorites',
            headerLargeTitle: true,
            headerTransparent: true,
            headerBlurEffect: 'regular',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default FavoritesLayout;
