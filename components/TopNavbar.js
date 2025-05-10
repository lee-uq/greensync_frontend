/**
 * TopNavbar
 *
 * Displays a top navigation bar on native platforms.
 * - Shows logo and greeting with username from UserContext.
 * - Provides notification and logout buttons.
 * - Hidden on web platform.
 */

// Core React import
import React from 'react';
// React Native UI components and Platform utility
import { View, Text, Image, Pressable, StyleSheet, Platform } from 'react-native';
// Icon library for vector icons
import { Ionicons } from '@expo/vector-icons';
// Hook to access React context
import { useContext } from 'react';
// Context providing shared user data
import { UserContext } from '../UserContext';
// Hook to access navigation actions
import { useNavigation } from '@react-navigation/native';

/**
 * TopNavbar component
 *
 * Renders:
 * - Logo and greeting (left side)
 * - Notifications and logout icons (right side)
 * - Only on native; returns null on web.
 */
export default function TopNavbar() {
  // Retrieve username from UserContext
  const { username } = useContext(UserContext);
  // Get navigation object for screen transitions
  const navigation = useNavigation();
  console.log('TopNavbar received username:', username);
  return Platform.OS === 'web' ? null : (
    // Only render on native platforms (iOS/Android)
    // Container for navbar with padding and horizontal layout
    <View style={styles.container}>
      {/* Left section: app logo and user greeting */}
      <View style={styles.leftSection}>
        {/* App logo image */}
        <Image
          source={require('../assets/lettuce_logo_with_background.png')}
          style={styles.logo}
        />
        {/* Greeting message showing the username */}
        <Text style={styles.greeting}>{`Hi ${username ?? ''}`}</Text>
      </View>

      {/* Right section: notification and logout buttons */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Notifications button with alert on press */}
        <Pressable
          onPress={() => alert('No New Notifications')}
          android_ripple={{ color: '#ccc', borderless: true }}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </Pressable>
        {/* Logout button that navigates to the Icon (login) screen */}
        <Pressable
          onPress={() => navigation.navigate('Icon')}
          android_ripple={{ color: '#ccc', borderless: true }}
          style={({ pressed }) => [
            {
              marginLeft: 16,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <Ionicons name="log-out-outline" size={24} color="#333" />
        </Pressable>
      </View>
    </View>
  );
}

// ── Styles: navbar container, sections, and typography ──
const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 48 : 36,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 10,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
});
