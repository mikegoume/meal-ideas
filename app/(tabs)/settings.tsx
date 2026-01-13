import Breakfast from '@/assets/images/meals/breakfast.png';
import Dessert from '@/assets/images/meals/candies.png';
import Dinner from '@/assets/images/meals/dinner.png';
import Lunch from '@/assets/images/meals/lunch.png';
import Salad from '@/assets/images/meals/salad.png';
import Snack from '@/assets/images/meals/snacks.png';
import {
  MeasurementBottomSheet,
  MeasurementBottomSheetRef,
} from '@/components/MeasurementBottomSheet';
import SettingsProfileInfo from '@/components/molecules/SettingsProfileInfo';
import { useAuthContext } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { MealAim, MealRole } from '@/types/meal';
import React, { useCallback, useRef } from 'react';
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

const mealRoles: { id: number; key: MealRole; label: string; imageUrl?: ImageSourcePropType }[] = [
  { id: 0, key: 'breakfast', label: 'Breakfast', imageUrl: Breakfast },
  { id: 1, key: 'lunch', label: 'Lunch', imageUrl: Lunch },
  { id: 2, key: 'salad', label: 'Salad', imageUrl: Salad },
  { id: 3, key: 'dinner', label: 'Dinner', imageUrl: Dinner },
  { id: 4, key: 'snack', label: 'Snack', imageUrl: Snack },
  { id: 5, key: 'dessert', label: 'Dessert', imageUrl: Dessert },
];

const mealAims: { id: number; key: MealAim; label: string; description: string }[] = [
  { id: 0, key: 'normal', label: 'Normal', description: 'Balanced and healthy meals' },
  { id: 1, key: 'diet', label: 'Weight Loss', description: 'Lower calorie options' },
  { id: 2, key: 'bulk', label: 'Muscle Building', description: 'High protein meals' },
  { id: 3, key: 'keto', label: 'Keto', description: 'Low carb, high fat' },
  { id: 4, key: 'vegan', label: 'Vegan', description: 'Plant-based only' },
  { id: 5, key: 'vegetarian', label: 'Vegetarian', description: 'No meat options' },
];

export default function SettingsScreen() {
  const { top } = useSafeAreaInsets();
  const { profile, session, refetchProfile } = useAuthContext();

  const measurementSheetRef = useRef<MeasurementBottomSheetRef>(null);

  const scaleAnimations = useRef(
    mealRoles.reduce(
      (acc, role) => {
        acc[role.key] = new Animated.Value(1);
        return acc;
      },
      {} as Record<MealRole, Animated.Value>,
    ),
  ).current;

  const toggleRole = useCallback(
    async ({ roleId, roleKey }: { roleId: number; roleKey: MealRole }) => {
      if (!session?.user?.id) return;

      const isSelected = profile.selected_meal_ids.includes(roleId);

      if (!isSelected) {
        Animated.sequence([
          Animated.timing(scaleAnimations[roleKey], {
            toValue: 0.5,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimations[roleKey], {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      }

      const newRoles = isSelected
        ? profile.selected_meal_ids.filter((r: number) => r !== roleId)
        : [...profile.selected_meal_ids, roleId];

      const { error } = await supabase
        .from('profiles')
        .update({ selected_meal_ids: newRoles })
        .eq('id', session.user.id);

      if (error) {
        Alert.alert('Error', `Failed to update selected_meal_ids`);
        throw error;
      } else {
        await refetchProfile();
      }
    },
    [profile.selected_meal_ids, refetchProfile, scaleAnimations, session?.user.id],
  );

  const toggleAim = useCallback(
    async (aimId: number) => {
      if (!session?.user?.id) return;

      const { error } = await supabase
        .from('profiles')
        .update({ goal_id: aimId })
        .eq('id', session.user.id)
        .select();

      if (error) {
        Alert.alert('Error', `Failed to update goal_id`);
        throw error;
      } else {
        await refetchProfile();
      }
    },
    [refetchProfile, session?.user.id],
  );

  const handleMeasurementPress = useCallback(
    (type: 'height' | 'weight') => {
      const currentValue = type === 'height' ? profile?.height : profile?.weight;
      measurementSheetRef.current?.open(type, currentValue || 0);
    },
    [profile],
  );

  const handleSaveMeasurement = useCallback(
    async (type: 'height' | 'weight', value: number) => {
      if (!session?.user?.id) return;

      const { error } = await supabase
        .from('profiles')
        .update({ [type]: value })
        .eq('id', session.user.id);

      if (error) {
        Alert.alert('Error', `Failed to update ${type}`);
        throw error;
      }
    },
    [session],
  );

  return (
    <>
      <View className="flex-1 bg-neutral-50" style={{ paddingTop: top }}>
        <ScrollView className="flex-1 px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">Settings</Text>
            <Text className="text-gray-600 text-lg">Customize your meal preferences</Text>
          </View>
          {/* Profile */}
          <SettingsProfileInfo />
          {/* Profile Measurements */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900">Profile Measurements</Text>
            <Text className="text-gray-600 mb-4">What are your current measurements?</Text>
            <View className="gap-3">
              <TouchableOpacity
                onPress={() => handleMeasurementPress('height')}
                className="flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-200"
                activeOpacity={0.7}>
                <Text className="text-gray-600 font-medium">Height</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-gray-900 font-semibold">{profile?.height || '--'} cm</Text>
                  <Text className="text-gray-400">›</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleMeasurementPress('weight')}
                className="flex-row justify-between items-center bg-white p-4 rounded-2xl border border-gray-200"
                activeOpacity={0.7}>
                <Text className="text-gray-600 font-medium">Weight</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-gray-900 font-semibold">{profile?.weight || '--'} kg</Text>
                  <Text className="text-gray-400">›</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Meal Times */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900">Meal Times</Text>
            <Text className="text-gray-600 mb-4">When do you want meal suggestions?</Text>

            <View className="flex-row justify-between">
              {mealRoles.map(({ id, key, label, imageUrl }) => {
                const selected = profile.selected_meal_ids.includes(id);

                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => toggleRole({ roleId: id, roleKey: key })}
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
                      className={`mt-1 text-xs ${
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

            {mealAims.map(({ id, key, label, description }) => (
              <TouchableOpacity
                key={key}
                onPress={() => toggleAim(id)}
                className={`p-4 mb-3 rounded-2xl border-2 ${
                  profile.goal_id === id
                    ? 'bg-orange-50 border-orange-500'
                    : 'bg-white border-gray-200'
                }`}
                activeOpacity={0.7}>
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

      <MeasurementBottomSheet ref={measurementSheetRef} onSave={handleSaveMeasurement} />
    </>
  );
}
