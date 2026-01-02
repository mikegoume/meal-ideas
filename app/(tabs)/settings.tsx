import Breakfast from '@/assets/images/meals/breakfast.png';
import Dessert from '@/assets/images/meals/candies.png';
import Dinner from '@/assets/images/meals/dinner.png';
import Lunch from '@/assets/images/meals/lunch.png';
import Salad from '@/assets/images/meals/salad.png';
import Snack from '@/assets/images/meals/snacks.png';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { db } from '@/lib/db';
import { MealAim, MealRole, UserPreferences } from '@/types/meal';
import React, { useRef } from 'react';
import {
  Alert,
  Animated,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const mealRoles: { key: MealRole; label: string; imageUrl?: ImageSourcePropType }[] = [
  { key: 'breakfast', label: 'Breakfast', imageUrl: Breakfast },
  { key: 'lunch', label: 'Lunch', imageUrl: Lunch },
  { key: 'salad', label: 'Salad', imageUrl: Salad },
  { key: 'dinner', label: 'Dinner', imageUrl: Dinner },
  { key: 'snack', label: 'Snack', imageUrl: Snack },
  { key: 'dessert', label: 'Dessert', imageUrl: Dessert },
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
  const { top, bottom } = useSafeAreaInsets();
  const { user } = db.useAuth();

  const { storedValue: preferences, setValue: setPreferences } = useAsyncStorage<UserPreferences>(
    'userPreferences',
    {
      selectedRoles: [],
      selectedAim: null,
    },
  );

  /** 🔥 Animated scale values per meal role */
  const scaleAnimations = useRef(
    mealRoles.reduce(
      (acc, role) => {
        acc[role.key] = new Animated.Value(1);
        return acc;
      },
      {} as Record<MealRole, Animated.Value>,
    ),
  ).current;

  const toggleRole = async (role: MealRole) => {
    const isSelected = preferences.selectedRoles.includes(role);

    if (!isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnimations[role], {
          toValue: 0.5,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimations[role], {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const newRoles = isSelected
      ? preferences.selectedRoles.filter((r) => r !== role)
      : [...preferences.selectedRoles, role];

    await setPreferences({
      ...preferences,
      selectedRoles: newRoles,
    });
  };

  const toggleAim = async (aim: MealAim) => {
    await setPreferences({
      ...preferences,
      selectedAim: aim,
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          // await db.logoutUser();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-neutral-50" style={{ paddingTop: top, paddingBottom: bottom }}>
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">Settings</Text>
          <Text className="text-gray-600 text-lg">Customize your meal preferences</Text>
        </View>

        {/* Profile */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-900">Profile</Text>
          <View className="bg-white p-4 rounded-2xl flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-semibold">{user?.imageURL || 'User'}</Text>
              <Text className="text-gray-600">{user?.email}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meal Times */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-900">Meal Times</Text>
          <Text className="text-gray-600 mb-4">When do you want meal suggestions?</Text>

          <View className="flex-row justify-between">
            {mealRoles.map(({ key, label, imageUrl }) => {
              const selected = preferences.selectedRoles.includes(key);

              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => toggleRole(key)}
                  className="items-center"
                  activeOpacity={0.8}>
                  <Animated.View
                    style={{ transform: [{ scale: scaleAnimations[key] }] }}
                    className={`p-1 rounded-full border-2 ${
                      selected ? 'border-orange-500' : 'border-transparent'
                    }`}>
                    {imageUrl && (
                      <Image
                        source={imageUrl}
                        className="size-12 rounded-full overflow-hidden"
                        resizeMode="contain"
                      />
                    )}
                  </Animated.View>

                  <Text
                    className={`mt-1 ${
                      selected ? 'text-black font-semibold' : 'text-gray-600 font-medium'
                    }`}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dietary Goals */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-900">Dietary Goals</Text>
          <Text className="text-gray-600 mb-4">What are your nutritional goals?</Text>

          {mealAims.map(({ key, label, description }) => (
            <TouchableOpacity
              key={key}
              onPress={() => toggleAim(key)}
              className={`p-4 mb-3 rounded-2xl border-2 ${
                preferences.selectedAim === key
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-white border-gray-200'
              }`}>
              <Text className="font-bold text-lg">{label}</Text>
              <Text className="text-gray-600 mt-1">{description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tip */}
        <View className="bg-orange-50 p-4 rounded-2xl mb-8">
          <Text className="text-orange-800 font-bold mb-1">💡 Pro Tip</Text>
          <Text className="text-orange-700">
            Leave preferences empty to see all meals or select options for personalized results.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
