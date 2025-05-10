/**
 * IconScreen
 *
 * Entry screen for GreenSync.
 * - Loads custom fonts.
 * - Displays logo, title, and subtitle.
 * - “Lettuce Begin” button:
 *    • Web: window.alert → navigate to Login
 *    • Mobile: Alert.alert → navigate to Login
 * - Renders WebFooter on web.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import WebFootbar from '../components/WebFooter';

export default function IconScreen() {
  const navigation = useNavigation();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // If custom fonts aren’t ready, display a full-screen spinner to avoid unstyled text
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  const handlePress = () => {
    // Button press: use browser alert on web; native Alert.alert on mobile
    if (Platform.OS === 'web') {
      // For web
      window.alert('Lettuce Begin \nWelcome to GreenSync!');
      navigation.navigate('Login');
    } else {
      // For iOS/Android
      Alert.alert('Lettuce Begin', 'Welcome to GreenSync!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Draw user’s attention to branding and entry point */}
        <Image
          source={require('../assets/lettuce_logo_white_background.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Display app name and description */}
        <Text style={styles.title}>GreenSync</Text>
        <Text style={styles.subtitle}>AI-Optimised Smart Hydroponic System</Text>

        {/* Primary call-to-action */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>Lettuce Begin</Text>
        </Pressable>
      </View>

      {/* Web-only footer navigation */}
      {Platform.OS === 'web' && <WebFootbar />}
    </SafeAreaView>
  );
}

// ── Layout Containers ───────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },

  // ── Logo & Text ─────────────────────────────────
  logo: {
    width: Platform.OS === 'web' ? 300 : 200,
    height: Platform.OS === 'web' ? 300 : 200,
    marginBottom: 32,
    borderRadius: 70,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontFamily: 'Inter_700Bold',
    color: '#97BE25',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 20 : 16,
    fontFamily: 'Inter_400Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
  },

  // ── Button Styles ──────────────────────────────
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: '#F7DCCB',
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontFamily: 'Inter_700Bold',
  },
});
