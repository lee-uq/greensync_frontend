/**
 * App
 *
 * Main entry point for the GreenSync application.
 * - Wraps the app in UserProvider for shared user state.
 * - Configures NavigationContainer for React Navigation.
 * - Defines a Native Stack Navigator with:
 *   • Icon (splash/logo) screen
 *   • Authentication screens: Login, SignUp
 *   • Main app screens: DashboardTabs, LettuceDetailScreen
 */

// Core React import
import React from 'react';
// Platform utility to detect web vs. native environments
import { Platform } from 'react-native';
// Container component managing navigation state
import { NavigationContainer } from '@react-navigation/native';
// Factory for creating a native stack navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Context provider to share user data across the app
import { UserProvider } from './UserContext';

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

// Import screen components for stack navigation
// Logo/splash screen
import IconScreen from './screens/IconScreen';
// Login screen
import LoginScreen from './screens/LoginScreen';
// Sign-up screen
import SignUpScreen from './screens/SignUpScreen';
// Main dashboard with bottom tabs
import DashboardTabs from './screens/DashboardTabs';
// Detail view for a selected lettuce type
import LettuceDetailScreen from './screens/LettuceDetailScreen';
// Insights screen
import InsightScreen from './screens/InsightsScreen';

// Instantiate the native stack navigator
const Stack = createNativeStackNavigator();

/**
 * App component
 *
 * Wraps the entire app with UserProvider and sets up navigation.
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Wrap the app in UserProvider and configure navigation
  return (
    <>
      {/* Provide global user context */}
      <UserProvider>
        {/* Manage navigation tree and state */}
        <NavigationContainer>
          {/* Disable default headers for all screens */}
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Logo screen shown at startup */}
            <Stack.Screen name="Icon" component={IconScreen} />

            {/* Login screen for user authentication */}
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* Sign-up screen for new users */}
            <Stack.Screen name="SignUp" component={SignUpScreen} />

            {/* Dashboard with bottom tab navigator */}
            <Stack.Screen name="Dashboard" component={DashboardTabs} />
            {/* Lettuce detail view screen */}
            <Stack.Screen name="LettuceDetail" component={LettuceDetailScreen} />
            {/* Insights screen */}
            <Stack.Screen name="Insight" component={InsightScreen} />
          </Stack.Navigator>
          {/* End of navigation container */}
        </NavigationContainer>
        {/* End of UserProvider */}
      </UserProvider>
    </>
  );
}
