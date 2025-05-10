/**
 * DashboardScreen
 *
 * Displays the main dashboard showing hydroponic slots and status.
 * - Reads `username` from navigation params or defaults to 'Guest'.
 * - Defines mock `slots` data for demonstration.
 * - Renders different navbars based on platform.
 * - Lists each slot with plant info or add option.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import TopNavbar from '../components/TopNavbar';
import WebNavbar from '../components/WebNavbar';
import WebFooter from '../components/WebFooter';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({ route, navigation }) {
  // Retrieve username passed from previous screen, fallback to 'Guest'
  const username = route?.params?.username || 'Guest';

  // Mock data: array of slot objects with id, plant status, and environmental readings
  const slots = [
    { id: 1, hasPlant: true, data: { temp: 22.5, humidity: 65, ph: 6.3, imageUri: null } },
    { id: 2, hasPlant: false },
    { id: 3, hasPlant: false },
  ];

  // Flag to determine if running in web environment
  const isWeb = Platform.OS === 'web';
  // Root container with safe area for notches and top bars
  return (
    <SafeAreaView style={styles.container}>
      {/* Show WebNavbar on web, TopNavbar on native platforms */}
      {isWeb ? <WebNavbar username={username} /> : <TopNavbar username={username} />}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 5, flexGrow: 1 }}>
        {/* Section header: dynamic text layout for web vs. mobile */}
        <Text style={[styles.header, Platform.OS === 'web' && { fontSize: 42, textAlign: 'left', marginLeft: 40 }]}>
          {Platform.OS === 'web' ? "Let’s Check Your Lettuce!" : "Let’s Check\nYour Lettuce!"}
        </Text>
        {/* Subtitle explaining the dashboard functionality */}
        <Text style={[styles.dashboardDescription, Platform.OS === 'web' && { fontSize: 20, textAlign: 'left', marginLeft: 45, marginBottom: 40 }]}>Monitor the status of each hydroponic slot below.</Text>
        {/* Container for slot cards; uses grid layout on web */}
        <View style={isWeb ? styles.webSlotRow : null}>
          {/* Iterate over each slot and render its card */}
          {slots.map((slot) => (
            // Individual slot card: styled box with padding and shadow
            <View key={slot.id} style={[styles.slot, isWeb && styles.webSlot]}>
            {/* Display slot identifier */}
            <Text style={styles.slotTitle}>Slot #{slot.id}</Text>
            {/* If a plant exists in this slot, show image and metrics */}
            {slot.hasPlant ? (
              <>
                {/* Image container: shows plant photo or placeholder with overlay */}
                <View style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 12,
                  marginBottom: 12,
                  backgroundColor: '#f7f7f7',
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {slot.data.imageUri ? (
                    <Image
                      source={{ uri: slot.data.imageUri }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <Image
                        source={{ uri: 'https://via.placeholder.com/300x150' }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                      <View style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4
                      }}>
                        <Ionicons name="camera-outline" size={12} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 12, marginLeft: 4 }}>Smart Cam</Text>
                      </View>
                    </>
                  )}
                </View>
                {/* Timestamp for when the plant photo was last captured */}
                <Text style={{ fontSize: 10, fontStyle:'italic', color: '#555', marginBottom: 1, alignSelf: 'flex-end' }}>
             Photo taken 5 minutes ago
                </Text>
                {/* Insight icon button */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Insight', { slotId: slot.id })}
                  style={{ position: 'absolute', top: 16, right: 16 }}
                >
                  <Ionicons name="bar-chart-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                {/* Row of metric cards (Temperature, Humidity, pH, etc.) */}
                <View style={styles.blockRow}>
                  <View style={styles.blockCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Ionicons name="thermometer-outline" size={18} color="#4CAF50" />
                      <Text style={[styles.blockLabel, { marginLeft: 6 }]}>Temperature</Text>
                    </View>
                    <Text style={styles.blockValue}>{slot.data.temp}°C</Text>
                  </View>
                  <View style={styles.blockCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Ionicons name="water-outline" size={18} color="#4CAF50" />
                      <Text style={[styles.blockLabel, { marginLeft: 6 }]}>Humidity</Text>
                    </View>
                    <Text style={styles.blockValue}>{slot.data.humidity}%</Text>
                  </View>
                  <View style={styles.blockCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Ionicons name="flask-outline" size={18} color="#4CAF50" />
                      <Text style={[styles.blockLabel, { marginLeft: 6 }]}>pH</Text>
                    </View>
                    <Text style={styles.blockValue}>{slot.data.ph}</Text>
                  </View>
                  <View style={styles.blockCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Ionicons name="speedometer-outline" size={18} color="#4CAF50" />
                      <Text style={[styles.blockLabel, { marginLeft: 6 }]}>TDS</Text>
                    </View>
                    <Text style={styles.blockValue}>846.69 ppm</Text>
                  </View>
                  <View style={styles.blockCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Ionicons name="sunny-outline" size={18} color="#4CAF50" />
                      <Text style={[styles.blockLabel, { marginLeft: 6 }]}>Light</Text>
                    </View>
                    <Text style={styles.blockValue}>2 lux</Text>
                  </View>
                  <View style={styles.blockCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Ionicons name="water-sharp" size={18} color="#4CAF50" />
                      <Text style={[styles.blockLabel, { marginLeft: 6 }]}>Water</Text>
                    </View>
                    <Text style={styles.blockValue}>6.5 L</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* If no plant is present, show message and Add button */}
                <Text style={styles.slotStatus}>No lettuce planted</Text>
                {/* Button to navigate to Search screen for adding a plant */}
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard', { screen: 'Search' })}>
                  <Text style={styles.chooseText}>+ Add</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          ))}
        </View>
        {/* Footer navigation displayed only on web */}
        {isWeb && <WebFooter />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 20,
  },
  text: {
    fontSize: 20,
  },
  slot: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'flex-start',
  },
  slotTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  slotStatus: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
  },
  placeholderNote: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  slotData: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 20,
  },
  dashboardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    marginLeft: 20,
  },
  chooseText: {
    fontSize: 15,
    color: '#4CAF50',
    marginTop: 10,
    fontWeight: '600',
  },
  blockCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
  },  
  blockLabel: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
    fontWeight: '500',
  },
  blockValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  blockRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  prediction: {
    marginTop: 12,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  webSlotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    rowGap: 20,
    columnGap: 20,
    paddingHorizontal: 20,
  },
  webSlot: {
    flexGrow: 1,
    minWidth: 320,
    maxWidth: 400,
    flexBasis: '30%',
    marginBottom: 20,
  },
  footer: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});