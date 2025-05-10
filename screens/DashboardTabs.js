/**
 * DashboardTabs
 *
 * Defines the bottom tab navigator for the app.
 * - Configures four tabs: Home, Search, Insights, Profile.
 * - Hides the tab bar on web by applying `display: none`.
 * - Customizes tab labels and icons per route name.
 */

// Core React import
import React from 'react';
// Import function to create bottom tab navigator
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Icon set for tab icons
import { Ionicons } from '@expo/vector-icons';
// Platform detection and Text component for custom labels
import { Platform, Text } from 'react-native';
// Import native stack navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Import screens for each tab
import DashboardScreen from './DashboardScreen';
import SelectionScreen from './SelectionScreen';
import NotificationsScreen from './InsightsScreen';
import ProfileScreen from './ProfileScreen';
import InsightScreen from './InsightsScreen';

// Instantiate a Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const DashboardStack = createNativeStackNavigator();

function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="DashboardMain" component={DashboardScreen} />
      <DashboardStack.Screen name="Insight" component={InsightScreen} />
    </DashboardStack.Navigator>
  );
}

export default function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Common screen options for all tabs:
        // - headerShown: disable top header
        // - tabBarActiveTintColor: color for selected tab
        // - tabBarInactiveTintColor: color for unselected tabs
        headerShown: false,
        tabBarActiveTintColor: '#108b49',
        tabBarInactiveTintColor: '#888',
        // Hide the tab bar on web by setting display:none; on native, apply height and padding
        tabBarStyle:
          Platform.OS === 'web'
            ? { display: 'none' }
            : {
                height: 70,
                paddingBottom: 12,
                paddingTop: 6,
              },
        // Render tab label: uses route.name and applies the provided color
        tabBarLabel: ({ color }) => (
          <Text style={{ fontSize: 12, marginBottom: 4, color }}>
            {route.name}
          </Text>
        ),
        // Render tab icon: choose Ionicons name based on route.name
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Search') iconName = 'search-outline';
          else if (route.name === 'Insights') iconName = 'bar-chart-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Each screen here becomes a tab */}
      {/* Register the "Home" tab, rendering DashboardStackNavigator component */}
      <Tab.Screen name="Home" component={DashboardStackNavigator} />
      {/* Register the "Search" tab, rendering SelectionScreen component */}
      <Tab.Screen name="Search" component={SelectionScreen} />
      {/* Register the "Insights" tab, rendering NotificationsScreen component */}
      <Tab.Screen name="Insights" component={NotificationsScreen} />
      {/* Register the "Profile" tab, rendering ProfileScreen component */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
