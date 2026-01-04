import { supabase } from '@/lib/supabase';
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

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 pt-12 gap-4">
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</Text>
            </View>
            <View className="mb-4 gap-4">
              <View>
                <Text className="text-gray-700 font-medium mb-2">Email</Text>
                <TextInput
                  className={`bg-white border px-4 py-4 rounded-3xl ${
                    // emailError ? 'border-red-500' : 'border-gray-300'
                    ''
                  }`}
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    // if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
                {/* {emailError && <Text className="text-red-500 text-sm mt-1">{emailError}</Text>} */}
              </View>
              <View>
                <Text className="text-gray-700 font-medium mb-2">Password</Text>
                <TextInput
                  className={`bg-white border px-4 py-4 rounded-3xl ${
                    // emailError ? 'border-red-500' : 'border-gray-300'
                    ''
                  }`}
                  onChangeText={(e) => setPassword(e)}
                  value={password}
                  secureTextEntry={true}
                  placeholder="Password"
                  autoCapitalize={'none'}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={signInWithEmail}
              disabled={loading}
              className={`bg-orange-500 rounded-3xl py-3 ${loading ? 'opacity-50' : ''}`}>
              <Text className="text-white text-center font-semibold text-lg">Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={signUpWithEmail}
              disabled={loading}
              className={`bg-orange-500 rounded-3xl py-3 ${loading ? 'opacity-50' : ''}`}>
              <Text className="text-white text-center font-semibold text-lg">Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
