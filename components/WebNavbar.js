/**
 * WebNavbar
 *
 * Displays a navigation bar for the web platform.
 * - Renders logo and greeting with username from context or route params.
 * - Lists navigation items (Home, Search, Insights, Profile, Logout).
 * - Highlights the active route.
 * - Hidden on non-web platforms.
 */

// Core React import and context hook
import React, { useContext } from 'react';
// React Native UI components and platform utility
import { View, Text, TouchableOpacity, Platform, StyleSheet, Image } from 'react-native';
// Navigation hooks for route info and navigation actions
import { useNavigation, useRoute } from '@react-navigation/native';
// Context providing shared user data (username)
import { UserContext } from '../UserContext';

const NAV_ITEMS = [
  { label: 'Home', route: 'DashboardMain' },
  { label: 'Search', route: 'Search' },
  { label: 'Insights', route: 'Insights' },
  { label: 'Profile', route: 'Profile' },
  { label: 'Logout', route: 'Icon' },
];

/**
 * WebNavbar component
 *
 * Renders a horizontal navbar only on web:
 * - Shows app logo and greeting.
 * - Maps NAV_ITEMS to navigation buttons.
 * - Applies active style on current route.
 */
const WebNavbar = () => {
  // Get navigation object to perform screen transitions
  const navigation = useNavigation();
  // Retrieve username from UserContext as fallback
  const { username: contextUsername } = useContext(UserContext);
  // Get current route to determine active nav item
  const route = useRoute();
  // Extract username passed via navigation params, if any
  const paramUsername = route.params?.username;
  // Choose display username: route param, context, or default 'User'
  const displayUsername = paramUsername ?? contextUsername ?? 'User';
  // Only render this navbar on web platform
  if (Platform.OS !== 'web') return null;

  return (
    // Navbar container: horizontal layout, spaced between logo and nav items
    <View style={styles.navbar}>
      {/* Left section: logo image and greeting */}
      <View style={styles.leftSection}>
        {/* App logo image */}
        <Image
          source={require('../assets/lettuce_logo_white_background.png')}
          style={styles.logo}
        />
        {/* Greeting message with the username */}
        <Text style={styles.usernameText}>Hi {displayUsername}</Text>
      </View>
      {/* Right section: navigation item buttons */}
      <View style={styles.navItems}>
        {NAV_ITEMS.map((item) => (
          // Navigation button for {item.label}
          <TouchableOpacity
            key={item.route}
            onPress={() => {
              if (item.label === 'Logout') {
                navigation.navigate(item.route);
              } else {
                navigation.navigate(item.route, { username: displayUsername });
              }
            }}
          >
            {/* Label text, highlights if active route */}
            <Text style={[
              styles.navItem,
              (
                (item.route === 'Home' && route.name === 'DashboardMain') ||
                route.name.toLowerCase() === item.route.toLowerCase()
              ) && styles.activeNavItem
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ── Styles: navbar layout, sections, and typography ──
const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  usernameText: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    color: '#000',
    fontWeight: 'bold',
    marginHorizontal: 10,
    fontSize: 16,
  },
  separator: {
    color: '#000',
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeNavItem: {
    color: '#4CAF50',
  },
});

export default WebNavbar;