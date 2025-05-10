/**
 * LettuceDetailScreen
 *
 * Shows details and care guide for a selected lettuce type.
 * - Retrieves `lettuce` object from route params.
 * - Provides back navigation.
 * - Displays image, name, and variety-specific description.
 * - Shows scientific info and care guide based on lettuce.name.
 * - Allows user to “add” lettuce with a confirmation alert.
 */

// Core React import
import React, { useState } from 'react';
// UI primitives from React Native
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
// Top navigation bar component for mobile platforms
import TopNavbar from '../components/TopNavbar';
// FlipCard component for web modal
// Hook to access navigation object
import { useNavigation } from '@react-navigation/native';
// Icon library for vector icons
import { Ionicons } from '@expo/vector-icons';

/**
 * LettuceDetailScreen component
 *
 * Props:
 * - route.params.lettuce: object containing name, image, and more.
 */
function LettuceDetailScreen({ route }) {
  // Extract selected lettuce data from navigation parameters
  const { lettuce } = route.params;
  // Initialize navigation for header back action
  const navigation = useNavigation();

  return (
    // Root container with safe area to avoid notches and status bars
    <SafeAreaView style={styles.container}>
      {/* Render top navbar (mobile only) */}
      <TopNavbar />
      {/* Enable vertical scrolling for content */}
      <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 40 }}
>
        {/* Back button: navigate to previous screen */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        {/* Display main image of the lettuce variety */}
        <Image source={lettuce.image} style={styles.image} />

        {/* Wrapper for all textual information and buttons */}
        <View style={styles.content}>
          {/* Show the name of the lettuce variety */}
          <Text style={styles.title}>{lettuce.name}</Text>
          {/* Conditional subtitle: detailed description per variety */}
          {lettuce.name === 'Romaine' && (
            <Text style={styles.subtitle}>A crunchy and upright variety commonly used in Caesar salads.</Text>
          )}
          {lettuce.name === 'Butterhead' && (
            <Text style={styles.subtitle}>Soft, tender leaves with a buttery texture. Great for wraps and fresh salads.</Text>
          )}
          {lettuce.name === 'Oak Leaf' && (
            <Text style={styles.subtitle}>Distinctive lobed leaves and mild flavor make it perfect for delicate salads.</Text>
          )}
          {lettuce.name === 'Cos' && (
            <Text style={styles.subtitle}>Crisp texture and tall heads, often confused with Romaine but slightly sweeter.</Text>
          )}

          {/* Butterhead: display scientific name, family, and difficulty */}
          {lettuce.name === 'Butterhead' && (
            <>
              <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. capitata</Text>
              <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
              <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Easy</Text>
            </>
          )}
          {/* Romaine: display scientific name, family, and difficulty */}
          {lettuce.name === 'Romaine' && (
            <>
              <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. longifolia</Text>
              <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
              <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Moderate</Text>
            </>
          )}
          {/* Oak Leaf: display scientific name, family, and difficulty */}
          {lettuce.name === 'Oak Leaf' && (
            <>
              <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. crispa</Text>
              <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
              <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Easy</Text>
            </>
          )}
          {/* Cos: display scientific name, family, and difficulty */}
          {lettuce.name === 'Cos' && (
            <>
              <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. longifolia</Text>
              <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
              <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Moderate</Text>
            </>
          )}

          {/* “Add” button: confirms addition of lettuce slot via alert */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              Alert.alert(
                "Success",
                "Lettuce added! Check your slot.",
                [{ text: "OK", style: "default" }]
              )
            }
          >
            <Text style={styles.addButtonText}>Lettuce added!</Text>
          </TouchableOpacity>
          {/* Coming Soon lettuce types */}
          {lettuce.name === 'Coming Soon' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                Alert.alert(
                  "Success",
                  "This lettuce type is coming soon. Stay tuned for updates.",
                  [{ text: "OK", style: "default" }]
                )
              }
            >
              <Text style={styles.addButtonText}>Coming Soon</Text>
            </TouchableOpacity>
          )}

          {/* Care Guide for Butterhead: light, temperature, water, humidity, nutrients, toxicity */}
          {lettuce.name === 'Butterhead' && (
            <>
              <Text style={styles.sectionTitle}>Care Guide</Text>
              <View style={styles.careBlock}>
                <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Light</Text>
                  <Text style={styles.careDescription}>Butterhead grows well under full sun to partial shade. Ensure at least 6 hours of light per day.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Temperature</Text>
                  <Text style={styles.careDescription}>Optimal temperature is between 15–18°C. It may bolt in warmer conditions.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Water</Text>
                  <Text style={styles.careDescription}>Keep the soil consistently moist but not soggy. Regular watering is essential for tender leaves.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Humidity</Text>
                  <Text style={styles.careDescription}>Tolerates moderate humidity, ideal range is 50–65%.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Nutrients</Text>
                  <Text style={styles.careDescription}>Requires nutrient-rich media. Supplement with nitrogen-based fertilizer during growth phase.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Toxicity</Text>
                  <Text style={styles.careDescription}>Completely safe and edible.</Text>
                </View>
              </View>
            </>
          )}

          {/* Care Guide for Romaine: light, temperature, water, humidity, nutrients, toxicity */}
          {lettuce.name === 'Romaine' && (
            <>
              <Text style={styles.sectionTitle}>Care Guide</Text>
              <View style={styles.careBlock}>
                <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Light</Text>
                  <Text style={styles.careDescription}>Needs 12–16 hours of bright light daily. Use full-spectrum LEDs for strong, upright growth. Low light may result in floppy leaves.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Temperature</Text>
                  <Text style={styles.careDescription}>Ideal range is 16–20°C. Temperatures above 24°C can cause bitterness.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Water</Text>
                  <Text style={styles.careDescription}>Romaine lettuce requires consistently moist conditions. Avoid waterlogging by ensuring good drainage in hydroponic setups.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Humidity</Text>
                  <Text style={styles.careDescription}>Prefers relatively high humidity—around 60–75%.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Nutrients</Text>
                  <Text style={styles.careDescription}>Romaine lettuce thrives in a nutrient-rich environment. Maintain balanced nitrogen, phosphorus, and potassium levels for optimal growth and flavor.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Toxicity</Text>
                  <Text style={styles.careDescription}>Non-toxic and safe to consume.</Text>
                </View>
              </View>
            </>
          )}

          {/* Care Guide for Oak Leaf: light, temperature, water, humidity, nutrients, toxicity */}
          {lettuce.name === 'Oak Leaf' && (
            <>
              <Text style={styles.sectionTitle}>Care Guide</Text>

              <View style={styles.careBlock}>
                <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Light</Text>
                  <Text style={styles.careDescription}>Thrives in full sun but can tolerate partial shade. Aim for 6–8 hours of sunlight daily.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Temperature</Text>
                  <Text style={styles.careDescription}>Ideal growing temperature is 14–20°C. Sensitive to heat, which can cause bolting.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Water</Text>
                  <Text style={styles.careDescription}>Keep soil evenly moist. Avoid overhead watering to prevent leaf damage.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Humidity</Text>
                  <Text style={styles.careDescription}>Prefers moderate humidity levels around 55–65% for best growth.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Nutrients</Text>
                  <Text style={styles.careDescription}>Feed with a balanced nutrient mix. Avoid over-fertilizing to maintain tender texture.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Toxicity</Text>
                  <Text style={styles.careDescription}>Edible and safe for all ages.</Text>
                </View>
              </View>
            </>
          )}

          {/* Care Guide for Cos: light, temperature, water, humidity, nutrients, toxicity */}
          {lettuce.name === 'Cos' && (
            <>
              <Text style={styles.sectionTitle}>Care Guide</Text>

              <View style={styles.careBlock}>
                <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Light</Text>
                  <Text style={styles.careDescription}>Needs full sun to grow upright and crisp. 6–8 hours of sunlight recommended.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Temperature</Text>
                  <Text style={styles.careDescription}>Grows best between 15–21°C. Heat stress can cause early bolting.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Water</Text>
                  <Text style={styles.careDescription}>Keep soil evenly moist. Avoid dry spells to maintain leaf quality.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Humidity</Text>
                  <Text style={styles.careDescription}>Prefers 60–70% humidity. Adequate air circulation prevents disease.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Nutrients</Text>
                  <Text style={styles.careDescription}>Fertilize lightly but regularly with a balanced formula. Too much nitrogen may reduce crunchiness.</Text>
                </View>
              </View>

              <View style={styles.careBlock}>
                <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.careLabel}>Toxicity</Text>
                  <Text style={styles.careDescription}>Safe and healthy to eat.</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// LettuceModal for web
function LettuceModal({ route, navigation: navigationProp }) {
  const { lettuce } = route.params;
  const [modalVisible, setModalVisible] = useState(true);
  // Use passed navigation if available, otherwise fallback to useNavigation
  const navigation = navigationProp ?? useNavigation();
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => navigation.navigate('SelectionScreen')}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Close icon at top-right */}
          <TouchableOpacity
            onPress={() => {
              console.log('Closing modal...');
              navigation.goBack();
            }}
            style={styles.modalCloseIcon}
          >
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 0 }}>
            <Image source={lettuce.image} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.title}>{lettuce.name}</Text>
              {lettuce.name === 'Romaine' && (
                <Text style={styles.subtitle}>A crunchy and upright variety commonly used in Caesar salads.</Text>
              )}
              {lettuce.name === 'Butterhead' && (
                <Text style={styles.subtitle}>Soft, tender leaves with a buttery texture. Great for wraps and fresh salads.</Text>
              )}
              {lettuce.name === 'Oak Leaf' && (
                <Text style={styles.subtitle}>Distinctive lobed leaves and mild flavor make it perfect for delicate salads.</Text>
              )}
              {lettuce.name === 'Cos' && (
                <Text style={styles.subtitle}>Crisp texture and tall heads, often confused with Romaine but slightly sweeter.</Text>
              )}

              {lettuce.name === 'Butterhead' && (
                <>
                  <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. capitata</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Easy</Text>
                </>
              )}
              {lettuce.name === 'Romaine' && (
                <>
                  <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. longifolia</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Moderate</Text>
                </>
              )}
              {lettuce.name === 'Oak Leaf' && (
                <>
                  <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. crispa</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Easy</Text>
                </>
              )}
              {lettuce.name === 'Cos' && (
                <>
                  <Text style={styles.label}><Text style={styles.bold}>Scientific name:</Text> Lactuca sativa var. longifolia</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Family:</Text> Asteraceae</Text>
                  <Text style={styles.label}><Text style={styles.bold}>Difficulty:</Text> Moderate</Text>
                </>
              )}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (Platform.OS === 'web') {
                    window.alert("Lettuce added! Check your slot.");
                  } else {
                    Alert.alert(
                      "Success",
                      "Lettuce added! Check your slot.",
                      [{ text: "OK", style: "default" }]
                    );
                  }
                }}
              >
                <Text style={styles.addButtonText}>Lettuce added!</Text>
              </TouchableOpacity>

              {/* Coming Soon lettuce types for Modal */}
              {lettuce.name === 'Coming Soon' && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    Alert.alert(
                      "Success",
                      "This lettuce type is coming soon. Stay tuned for updates.",
                      [{ text: "OK", style: "default" }]
                    )
                  }
                >
                  <Text style={styles.addButtonText}>Coming Soon</Text>
                </TouchableOpacity>
              )}

              {lettuce.name === 'Butterhead' && (
                <>
                  <Text style={styles.sectionTitle}>Care Guide</Text>
                  <View style={styles.careBlock}>
                    <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Light</Text>
                      <Text style={styles.careDescription}>Butterhead grows well under full sun to partial shade. Ensure at least 6 hours of light per day.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Temperature</Text>
                      <Text style={styles.careDescription}>Optimal temperature is between 15–18°C. It may bolt in warmer conditions.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Water</Text>
                      <Text style={styles.careDescription}>Keep the soil consistently moist but not soggy. Regular watering is essential for tender leaves.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Humidity</Text>
                      <Text style={styles.careDescription}>Tolerates moderate humidity, ideal range is 50–65%.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Nutrients</Text>
                      <Text style={styles.careDescription}>Requires nutrient-rich media. Supplement with nitrogen-based fertilizer during growth phase.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Toxicity</Text>
                      <Text style={styles.careDescription}>Completely safe and edible.</Text>
                    </View>
                  </View>
                </>
              )}

              {lettuce.name === 'Romaine' && (
                <>
                  <Text style={styles.sectionTitle}>Care Guide</Text>
                  <View style={styles.careBlock}>
                    <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Light</Text>
                      <Text style={styles.careDescription}>Needs 12–16 hours of bright light daily. Use full-spectrum LEDs for strong, upright growth. Low light may result in floppy leaves.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Temperature</Text>
                      <Text style={styles.careDescription}>Ideal range is 16–20°C. Temperatures above 24°C can cause bitterness.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Water</Text>
                      <Text style={styles.careDescription}>Romaine lettuce requires consistently moist conditions. Avoid waterlogging by ensuring good drainage in hydroponic setups.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Humidity</Text>
                      <Text style={styles.careDescription}>Prefers relatively high humidity—around 60–75%.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Nutrients</Text>
                      <Text style={styles.careDescription}>Romaine lettuce thrives in a nutrient-rich environment. Maintain balanced nitrogen, phosphorus, and potassium levels for optimal growth and flavor.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Toxicity</Text>
                      <Text style={styles.careDescription}>Non-toxic and safe to consume.</Text>
                    </View>
                  </View>
                </>
              )}

              {lettuce.name === 'Oak Leaf' && (
                <>
                  <Text style={styles.sectionTitle}>Care Guide</Text>

                  <View style={styles.careBlock}>
                    <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Light</Text>
                      <Text style={styles.careDescription}>Thrives in full sun but can tolerate partial shade. Aim for 6–8 hours of sunlight daily.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Temperature</Text>
                      <Text style={styles.careDescription}>Ideal growing temperature is 14–20°C. Sensitive to heat, which can cause bolting.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Water</Text>
                      <Text style={styles.careDescription}>Keep soil evenly moist. Avoid overhead watering to prevent leaf damage.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Humidity</Text>
                      <Text style={styles.careDescription}>Prefers moderate humidity levels around 55–65% for best growth.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Nutrients</Text>
                      <Text style={styles.careDescription}>Feed with a balanced nutrient mix. Avoid over-fertilizing to maintain tender texture.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Toxicity</Text>
                      <Text style={styles.careDescription}>Edible and safe for all ages.</Text>
                    </View>
                  </View>
                </>
              )}

              {lettuce.name === 'Cos' && (
                <>
                  <Text style={styles.sectionTitle}>Care Guide</Text>

                  <View style={styles.careBlock}>
                    <Ionicons name="sunny-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Light</Text>
                      <Text style={styles.careDescription}>Needs full sun to grow upright and crisp. 6–8 hours of sunlight recommended.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="thermometer-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Temperature</Text>
                      <Text style={styles.careDescription}>Grows best between 15–21°C. Heat stress can cause early bolting.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-sharp" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Water</Text>
                      <Text style={styles.careDescription}>Keep soil evenly moist. Avoid dry spells to maintain leaf quality.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="water-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Humidity</Text>
                      <Text style={styles.careDescription}>Prefers 60–70% humidity. Adequate air circulation prevents disease.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="leaf-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Nutrients</Text>
                      <Text style={styles.careDescription}>Fertilize lightly but regularly with a balanced formula. Too much nitrogen may reduce crunchiness.</Text>
                    </View>
                  </View>

                  <View style={styles.careBlock}>
                    <Ionicons name="skull-outline" size={20} color="#4CAF50" style={styles.careIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.careLabel}>Toxicity</Text>
                      <Text style={styles.careDescription}>Safe and healthy to eat.</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Styles: LettuceDetailScreen layout and visual elements ─────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: Platform.OS === 'web' ? 200 : '100%',
    height: Platform.OS === 'web' ? 200 : 300,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 16 : 13,
    color: '#444',
    marginBottom: 16,
  },
  label: {
    fontSize: Platform.OS === 'web' ? 14 : 12,
    color: '#333',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Platform.OS === 'web' ? 22 : 18,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'web' ? 22 : 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  cardTitle: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#333',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: 'bold',
    color: '#333',
  },
  careBlock: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  careIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  careLabel: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  careDescription: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#555',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    width: 400,
    maxHeight: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingBottom: 0,
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
});

// Platform-specific export: modal for web, screen for native
export default Platform.OS === 'web' ? LettuceModal : LettuceDetailScreen;