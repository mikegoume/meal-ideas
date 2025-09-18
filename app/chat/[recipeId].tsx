import { sampleMeals } from '@/data/meals';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bot, Send, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const { recipeId } = useLocalSearchParams();
  const meal = sampleMeals.find((m) => m.id === recipeId);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your AI cooking assistant. I can help you with the "${meal?.name}" recipe. Feel free to ask about substitutions, cooking techniques, or any modifications you'd like to make!`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText.trim()),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('substitute') || input.includes('replace')) {
      return "I'd be happy to help with substitutions! For most ingredients, there are great alternatives. For example, you can replace eggs with flax eggs, use coconut milk instead of dairy milk, or swap honey for maple syrup. What specific ingredient would you like to substitute?";
    }

    if (input.includes('allergi') || input.includes('gluten') || input.includes('dairy')) {
      return 'I can definitely help adapt this recipe for dietary restrictions! Many ingredients can be substituted to make recipes gluten-free, dairy-free, or allergen-friendly. Could you tell me more about your specific dietary needs?';
    }

    if (input.includes('cook') || input.includes('how')) {
      return "Great question about cooking technique! The key to this recipe is following the timing and temperature guidelines. Make sure to prep all your ingredients first, and don't rush the process. Would you like me to explain any specific cooking step in more detail?";
    }

    if (input.includes('time') || input.includes('long')) {
      return `This recipe takes about ${meal?.cookingTime} minutes total. You can prep some ingredients ahead of time to make it faster. Would you like tips on meal prepping or speeding up the cooking process?`;
    }

    if (input.includes('healthy') || input.includes('nutrition')) {
      return (
        'This recipe is quite nutritious! You can make it even healthier by adding more vegetables, using whole grains, or reducing sodium. Each serving has approximately ' +
        meal?.calories +
        ' calories. Want suggestions for making it even more nutritious?'
      );
    }

    return "That's a great question! I'm here to help you make the perfect meal. Whether you need cooking tips, ingredient substitutions, or want to modify the recipe, just let me know what you're looking for and I'll provide personalized guidance.";
  };

  if (!meal) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-bold text-gray-900">Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-gray-900 ml-4">AI Cooking Assistant</Text>
          <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center">
            <Bot size={16} color="white" />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-2">
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
              <View
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser ? 'bg-orange-500 rounded-br-lg' : 'bg-gray-100 rounded-bl-lg'
                }`}>
                <View className="flex-row items-center mb-1">
                  {message.isUser ? (
                    <User size={14} color="white" />
                  ) : (
                    <Bot size={14} color="#6b7280" />
                  )}
                  <Text
                    className={`ml-2 text-xs ${
                      message.isUser ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                    {message.isUser ? 'You' : 'AI Assistant'}
                  </Text>
                </View>
                <Text
                  className={`text-base leading-5 ${
                    message.isUser ? 'text-white' : 'text-gray-900'
                  }`}>
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="px-4 pb-4 pt-2 border-t border-gray-200">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about ingredients, cooking tips..."
              className="flex-1 text-base py-2"
              multiline
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="ml-2 w-8 h-8 bg-orange-500 rounded-full items-center justify-center"
              disabled={inputText.trim() === ''}>
              <Send size={16} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-2 mt-3">
            {[
              'Can I substitute an ingredient?',
              'Make it healthier',
              'Cooking tips?',
              'Allergen-free options',
            ].map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                onPress={() => setInputText(suggestion)}
                className="bg-orange-100 px-3 py-2 rounded-full">
                <Text className="text-orange-700 text-sm">{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
