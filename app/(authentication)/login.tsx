import { db } from '@/lib/db';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateCode = (code: string): boolean => {
    if (!code) {
      setCodeError('Code is required');
      return false;
    }
    if (code.length < 6) {
      setCodeError('Code must be at least 6 characters');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleSendCode = async () => {
    if (!validateEmail(email)) return;

    setIsLoading(true);
    try {
      await db.auth.sendMagicCode({ email });
      setCode('');
      setCodeError('');
      setShowCodeInput(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to send code. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateCode(code)) return;

    setIsLoading(true);
    try {
      await db.auth.signInWithMagicCode({ email, code });
      // Successfully logged in - navigation will be handled automatically
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Invalid code. Please try again.',
      );
      setCodeError('Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setShowCodeInput(false);
    setCode('');
    setCodeError('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 pt-12">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</Text>
              <Text className="text-gray-600">
                {showCodeInput ? `Enter the code sent to ${email}` : 'Log in to your account'}
              </Text>
            </View>

            {showCodeInput ? (
              <>
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Verification Code</Text>
                  <TextInput
                    className={`bg-white border px-4 py-4 rounded-3xl ${
                      codeError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChangeText={(text) => {
                      setCode(text);
                      if (codeError) setCodeError('');
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                  />
                  {codeError && <Text className="text-red-500 text-sm mt-1">{codeError}</Text>}
                </View>

                <TouchableOpacity
                  onPress={handleVerifyCode}
                  disabled={isLoading}
                  className={`bg-orange-500 rounded-3xl py-3 mb-4 ${
                    isLoading ? 'opacity-50' : ''
                  }`}>
                  <Text className="text-white text-center font-semibold text-lg">
                    {isLoading ? 'Verifying...' : 'VERIFY CODE'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleBackToEmail} disabled={isLoading}>
                  <Text className="text-center text-orange-600 font-medium">
                    Use a different email
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Email</Text>
                  <TextInput
                    className={`bg-white border px-4 py-4 rounded-3xl ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                  />
                  {emailError && <Text className="text-red-500 text-sm mt-1">{emailError}</Text>}
                </View>

                <TouchableOpacity
                  onPress={handleSendCode}
                  disabled={isLoading}
                  className={`bg-orange-500 rounded-3xl py-3 mb-6 ${
                    isLoading ? 'opacity-50' : ''
                  }`}>
                  <Text className="text-white text-center font-semibold text-lg">
                    {isLoading ? 'Sending Code...' : 'SEND CODE'}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row items-center mb-6">
                  <View className="flex-1 h-px bg-gray-300" />
                  <Text className="mx-4 text-gray-500">or</Text>
                  <View className="flex-1 h-px bg-gray-300" />
                </View>

                <View className="flex flex-row justify-center gap-2 align-middle">
                  <Text className="text-center text-gray-600">Don&apos;t have an account?</Text>
                  <TouchableOpacity>
                    <Text className="text-orange-600 font-medium">Register</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
