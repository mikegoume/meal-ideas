import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import DefaultProfile from '@/assets/images/default_profile_pic.png';
import { LogOut } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { useAuthContext } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function SettingsProfileInfo() {
  const { profile } = useAuthContext();

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.push('/(authentication)/auth');
        },
      },
    ]);
  }, []);

  return (
    <View className="mb-8">
      <View className="flex-row items-center gap-4">
        <Image
          source={
            profile?.avatar_url
              ? {
                  uri: profile?.avatar_url,
                }
              : DefaultProfile
          }
          className="size-12 rounded-full border-2 p-1 border-gray-400"
        />
        <View className="flex-1">
          <Text className="text-lg font-semibold">{profile?.username || 'User'}</Text>
          <Text className="text-gray-600">{profile?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
          <LogOut size={18} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
