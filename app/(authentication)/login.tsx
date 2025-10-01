import GoogleIcon from '@/assets/images/google-login-icon.png';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loginWithApple, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Navigate to main app when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Login failed. Please try again.',
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Google login failed');
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Apple login failed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-12">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</Text>
              <Text className="text-gray-600 ">log in to your account</Text>
            </View>

            {/* Login Form */}
            <View className="flex-1">
              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`bg-white border px-4 py-4 rounded-3xl ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="johndoe@gmail.com"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={{ textAlignVertical: 'center' }}
                      />
                    </View>
                  )}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
                )}
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-medium mb-2">Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View className="relative">
                      <TextInput
                        className={`bg-white border px-4 py-4 pr-12 rounded-3xl ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="min. 8 characters"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        style={{ textAlignVertical: 'center' }}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4">
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          className="text-gray-400"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                )}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="mb-6 ml-auto">
                <Text className="text-orange-600 font-medium text-right">forgot password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className={`bg-orange-500 rounded-3xl py-3 mb-6 ${isLoading ? 'opacity-50' : ''}`}>
                <Text className="text-white text-center font-semibold text-lg">
                  {isLoading ? 'Signing In...' : 'LOGIN'}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-4 text-gray-500">or</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              {/* Social Login Buttons */}
              <View className="flex flex-col gap-6">
                {/* Google Login */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
                  className={`bg-white border border-gray-300 rounded-3xl py-3 flex-row items-center justify-center ${isLoading ? 'opacity-50' : ''}`}>
                  <Image source={GoogleIcon} className="size-6 mr-3" />
                  <Text className="text-gray-700 font-medium ">Sign up with Google</Text>
                </TouchableOpacity>

                {/* Apple Login */}
                <TouchableOpacity
                  onPress={handleAppleLogin}
                  disabled={isLoading}
                  className={`bg-white border border-gray-300 rounded-3xl py-3 flex-row items-center justify-center ${isLoading ? 'opacity-50' : ''}`}>
                  <Ionicons name="logo-apple" size={20} className="size-6 mr-3" />
                  <Text className="text-gray-700 font-medium ">Sign up with Apple</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View className="py-6">
              <Text className="text-center text-gray-600">
                Don&apos;t have an account?{' '}
                <Text className="text-orange-600 font-medium">Register</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
