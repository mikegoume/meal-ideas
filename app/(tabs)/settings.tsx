import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { useAuth } from '@/hooks/useAuth';
import { MealAim, MealRole, UserPreferences } from '@/types/meal';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mealRoles: { key: MealRole; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snack', label: 'Snack' },
  { key: 'dessert', label: 'Dessert' },
];

const mealAims: { key: MealAim; label: string; description: string }[] = [
  { key: 'normal', label: 'Normal', description: 'Balanced and healthy meals' },
  { key: 'diet', label: 'Weight Loss', description: 'Lower calorie options' },
  { key: 'bulk', label: 'Muscle Building', description: 'High protein meals' },
  { key: 'keto', label: 'Keto', description: 'Low carb, high fat' },
  { key: 'vegan', label: 'Vegan', description: 'Plant-based only' },
  { key: 'vegetarian', label: 'Vegetarian', description: 'No meat options' },
];

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { storedValue: preferences, setValue: setPreferences } = useAsyncStorage<UserPreferences>(
    'userPreferences',
    {
      selectedRoles: [],
      selectedAims: [],
    },
  );

  const toggleRole = async (role: MealRole) => {
    const currentRoles = preferences.selectedRoles;
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];

    await setPreferences({
      ...preferences,
      selectedRoles: newRoles,
    });
  };

  const toggleAim = async (aim: MealAim) => {
    const currentAims = preferences.selectedAims;
    const newAims = currentAims.includes(aim)
      ? currentAims.filter((a) => a !== aim)
      : [...currentAims, aim];

    await setPreferences({
      ...preferences,
      selectedAims: newAims,
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView className="flex-1">
        <View className="px-6 ">
          <Text className="text-3xl font-bold text-gray-900">Settings</Text>
          <Text className="text-gray-600 text-lg">Customize your meal preferences</Text>
        </View>

        {/* User Profile Section */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Profile</Text>
          <View className="bg-gray-50 p-4 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-lg">{user?.name || 'User'}</Text>
                <Text className="text-gray-600 text-sm">{user?.email}</Text>
              </View>
              <TouchableOpacity onPress={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg">
                <Text className="text-white font-medium">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Meal Times</Text>
          <Text className="text-gray-600 mb-4">When do you want meal suggestions?</Text>
          <View className="flex-row flex-wrap gap-3">
            {mealRoles.map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                onPress={() => toggleRole(key)}
                className={`px-4 py-2 rounded-full border-2 ${preferences.selectedRoles.includes(key)
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white border-gray-200'
                  }`}>
                <Text
                  className={`font-medium ${preferences.selectedRoles.includes(key) ? 'text-white' : 'text-gray-700'
                    }`}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Dietary Goals</Text>
          <Text className="text-gray-600 mb-4">What are your nutritional goals?</Text>

          <View className="space-y-3">
            {mealAims.map(({ key, label, description }) => (
              <TouchableOpacity
                key={key}
                onPress={() => toggleAim(key)}
                className={`p-4 rounded-2xl border-2 ${preferences.selectedAims.includes(key)
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-200'
                  }`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className={`font-bold text-lg ${preferences.selectedAims.includes(key) ? 'text-green-700' : 'text-gray-900'
                        }`}>
                      {label}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">{description}</Text>
                  </View>
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${preferences.selectedAims.includes(key)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                      }`}>
                    {preferences.selectedAims.includes(key) && (
                      <Text className="text-white font-bold text-xs">✓</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-6 mb-8">
          <View className="bg-orange-50 p-4 rounded-2xl">
            <Text className="text-orange-800 font-bold text-lg mb-2">💡 Pro Tip</Text>
            <Text className="text-orange-700">
              Leave preferences empty to see all available meals, or select specific options to get
              personalized recommendations!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
