/**
 * SelectionScreen
 *
 * Screen for browsing and selecting different lettuce types.
 * - Displays a searchable and filterable grid of lettuce cards.
 * - Supports three filter modes: all, A-Z, popular.
 * - Shows placeholder cards for upcoming lettuce types.
 * - Navigates to LettuceDetail when a card is selected.
 */
// screens/SelectionScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Alert,
} from 'react-native';
import TopNavbar from '../components/TopNavbar';
import WebNavbar from '../components/WebNavbar';
import WebFooter from '../components/WebFooter';
import { Ionicons } from '@expo/vector-icons';

// Enable LayoutAnimation on Android for smooth filter transitions
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Static list of lettuce options; some entries marked as placeholders
const originalLettuces = [
  { id: '1', name: 'Romaine', image: require('../assets/lettuce_romaine.png'), popular: true },
  { id: '2', name: 'Butterhead', image: require('../assets/lettuce_butterhead.png'), popular: false },
  { id: '3', name: 'Oak Leaf', image: require('../assets/lettuce_oakleaf.png'), popular: true },
  { id: '4', name: 'Cos', image: require('../assets/lettuce_cos.png'), popular: false },
  { id: '5', name: 'Coming Soon', image: require('../assets/coming.png'), placeholder: true },
  { id: '6', name: 'Coming Soon', image: require('../assets/coming1.png'), placeholder: true },
];

/**
 * SelectionScreen component
 *
 * Props:
 * - route.params.username: optional username from navigation
 * - navigation: React Navigation object for screen transitions
 *
 * Internal state:
 * - searchQuery: current text filter for lettuce names
 * - filter: current sort mode ('all', 'az', 'popular')
 */
export default function SelectionScreen({ route, navigation, username }) {
  // Determine which username to display: prop, param, or default to 'Guest'
  const nameToUse = username || route?.params?.username || 'Guest';

  // ── Form state: search text and current filter mode ───────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'az' | 'popular'

  // Apply search and filter (A-Z or popularity) to the lettuce list
  const filteredLettuces = originalLettuces
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filter === 'az') return a.name.localeCompare(b.name);
      if (filter === 'popular') return b.popular - a.popular;
      return 0;
    });

  /**
   * handleFilterPress()
   *
   * Cycles filter through 'all' → 'az' → 'popular' and triggers animation
   */
  const handleFilterPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = filter === 'all' ? 'az' : filter === 'az' ? 'popular' : 'all';
    setFilter(next);
  };

  /**
   * renderItem()
   *
   * Renders each lettuce card:
   * - If placeholder: shows placeholder card and alert on press.
   * - Otherwise: shows image, name, and navigates to detail screen.
   */
  const renderItem = ({ item }) => {
    if (item.placeholder) {
      return (
        <TouchableOpacity
          style={[styles.card, { justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => {
            if (Platform.OS === 'web') {
              window.alert('This lettuce type is coming soon! Stay tuned.');
            } else {
              Alert.alert('Notice', 'This lettuce type is coming soon! Stay tuned.');
            }
          }}
        >
          {item.image && <Image source={item.image} style={styles.image} />}
          <Text style={styles.name}>Coming Soon</Text>
          <Text style={styles.label}>Lettuce</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('LettuceDetail', {
          lettuce: {
            name: item.name,
            image: item.image,
            scientificName: 'Lactuca sativa var. capitata',
            family: 'Asteraceae',
            difficulty: 'Easy',
            idealTemp: '18–22°C',
            care: [
              { icon: '💧', title: 'Water', description: 'Butterhead lettuce thrives in consistently moist environments. Keep the nutrient solution topped up and avoid letting roots dry out.' },
              { icon: '💧', title: 'Humidity', description: 'Prefers 40–60% humidity.' },
              { icon: '☀️', title: 'Light', description: 'Requires 12–14 hours of light per day. Use full-spectrum LED grow lights.' },
              { icon: '🌡', title: 'Temperature', description: 'Ideal temperature: 15–22°C (59–72°F).' },
              { icon: '☠️', title: 'Toxicity', description: 'Non-toxic and safe to consume.' }
            ]
          }
        })}
      >
        <Image source={item.image} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.label}>Lettuce</Text>
      </TouchableOpacity>
    );
  };

  // Root container avoiding notches; wraps web and mobile layouts
  return (
    <SafeAreaView style={styles.container}>
      {/* Web-specific layout inside a ScrollView for horizontal flexibility */}
      {Platform.OS === 'web' ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Render top and web navbars for web interface */}
          <TopNavbar username={nameToUse} />
          <WebNavbar />
          <View style={{ flex: 1 }}>
            {/* Section header with responsive styling for web vs. mobile */}
            <Text style={[styles.header, Platform.OS === 'web' && { fontSize: 42, textAlign: 'left', marginLeft: 40 }]}>
              {Platform.OS === 'web' ? "Let’s Find Your Lettuce!" : "Let’s Find\nYour Lettuce!"}
            </Text>
            {/* Subtitle text shown only on web for extra spacing */}
            {Platform.OS === 'web' && (
              <Text style={[styles.dashboardDescription, { fontSize: 20, textAlign: 'left', marginLeft: 45, marginBottom: 40 }]}>
                Choose your lettuce type and start monitoring smart growth.
              </Text>
            )}
            {/* Search input and filter button container */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#555" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search plants..."
                  placeholderTextColor="#555"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <Pressable style={styles.filterButton} onPress={handleFilterPress}>
                <Ionicons name="funnel-outline" size={20} color="#fff" />
              </Pressable>
            </View>
            {/* Display the current filter mode to the user */}
            <Text style={styles.filterLabel}>
              {filter === 'all' ? 'Showing All' : filter === 'az' ? 'Sorted A-Z' : 'Most Popular First'}
            </Text>
            {/* Grid of lettuce cards; adjusts columns per platform */}
            <FlatList
              data={filteredLettuces}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{ justifyContent: 'center', gap: 24 }}
              contentContainerStyle={[styles.grid]}
            />
          </View>
          <WebFooter />
        </ScrollView>
      ) : (
        // Native mobile layout without ScrollView wrapper
        <>
          <TopNavbar username={nameToUse} />
          {/* Section header with responsive styling for web vs. mobile */}
          <Text style={styles.header}>
            Let’s Find{'\n'}Your Lettuce!
          </Text>
          {/* Search input and filter button container */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search plants..."
                placeholderTextColor="#555"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable style={styles.filterButton} onPress={handleFilterPress}>
              <Ionicons name="funnel-outline" size={20} color="#fff" />
            </Pressable>
          </View>
          {/* Display the current filter mode to the user */}
          <Text style={styles.filterLabel}>
            {filter === 'all' ? 'Showing All' : filter === 'az' ? 'Sorted A-Z' : 'Most Popular First'}
          </Text>
          {/* Grid of lettuce cards; adjusts columns per platform */}
          <FlatList
            data={filteredLettuces}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.grid}
          />
        </>
      )}
    </SafeAreaView>
  );
}

// ── Styles: SelectionScreen layout and visual elements ─────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    ...(Platform.OS === 'web'
      ? {
          justifyContent: 'flex-end',
          paddingHorizontal: 60,
          gap: 12,
        }
      : { justifyContent: 'center' }),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 12,
    marginLeft: 20,
    flex: 1,
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 600,
          marginLeft: 0,
          marginRight: 0,
          flex: 1,
        }
      : {}),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    ...(Platform.OS === 'web'
      ? {
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
        }
      : {}),
  },
  filterLabel: {
    marginBottom: 8,
    fontSize: 14,
    ...(Platform.OS === 'web' ? { marginLeft: 100 } : { marginLeft: 20 }),
    color: '#555',
  },
  grid: {
    paddingBottom: 100,
    ...(Platform.OS === 'web'
      ? {
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 60,
          rowGap: 24,
          columnGap: 24,
        }
      : { marginLeft: 10, marginRight: 10 }),
  },
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    ...(Platform.OS === 'web' ? {
      padding: 40,
      minWidth: 400,
      maxWidth: 420,
      marginHorizontal: 12,
      marginVertical: 12,
    } : {}),
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
    ...(Platform.OS === 'web' ? { width: '100%', height: 200 } : {}),
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  dashboardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    marginLeft: 20,
  },
});
