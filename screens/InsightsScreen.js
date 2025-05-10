/**
 * InsightsScreen
 *
 * Screen displaying environmental and growth insights for each hydroponic slot.
 * - Reads `username` from route params (defaults to 'Guest').
 * - Generates mock data for temperature, pH, TDS, light, water, and growth charts.
 * - Renders a list of slots showing sensor cards or “no plant” placeholders.
 * - Provides modals for detailed insights on each metric.
 */

// Core React imports
import React, { useState } from 'react';
import { Alert } from 'react-native';

// React Native UI primitives and utilities
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView, Modal,
  Pressable, Dimensions, Image, Platform
} from 'react-native';

// Slider component for selecting ranges in modals
import Slider from '@react-native-community/slider';

// Navigation bars
import TopNavbar from '../components/TopNavbar';    // mobile
import WebNavbar from '../components/WebNavbar';    // web
import WebFooter from '../components/WebFooter';    // web footer

// Iconography for sensor cards and controls
import { Ionicons } from '@expo/vector-icons';

// Chart component for time-series data
import { LineChart } from 'react-native-chart-kit';

// Generate labels (dates) and temperature values for the past 5 days
const generateTempChartData = () => {
  const today = new Date();
  const days = [-2, -1, 0, 1, 2];

  const labels = days.map(offset => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    return `${date.getDate()} ${date.toLocaleDateString('en-AU', { month: 'short' })}`;
  });

  const temps = [21.5, 21.8, 22.5, 22.1, 23.0]; // Consistent within preferred range

  return { labels, temps };
};

// Generate labels and pH readings for the past 5 days
const generatePhChartData = () => {
  const today = new Date();
  const days = [-2, -1, 0, 1, 2];
  const labels = days.map(offset => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return `${d.getDate()} ${d.toLocaleDateString('en-AU', { month: 'short' })}`;
  });
  const data = [6.0, 6.1, 6.3, 6.2, 6.0];
  return { labels, data };
};

// Generate labels and TDS(Total Dissolved solids) values for the past 5 days (mock)
const generateTDSChartData = () => {
  const today = new Date();
  const days = [-2, -1, 0, 1, 2];
  const labels = days.map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return `${d.getDate()} ${d.toLocaleDateString('en-AU', { month: 'short' })}`;
  });
  const data = [1.4, 1.5, 1.6, 1.7, 1.8]; // Mock values
  return { labels, data };
};

// Generate labels and light intensity (lux) readings for the past 5 days
const generateLightChartData = () => {
  const today = new Date();
  const days = [-2, -1, 0, 1, 2];
  const labels = days.map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return `${d.getDate()} ${d.toLocaleDateString('en-AU', { month: 'short' })}`;
  });
  const data = [0, 1, 2, 3, 4, 5]; // Mock lux values
  return { labels, data };
};

// Generate labels and water volume values (litres) for the past 5 days (realistic values 5.8–6.6)
const generateWaterChartData = () => {
  const today = new Date();
  const days = [-2, -1, 0, 1, 2];
  const labels = days.map(offset => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return `${d.getDate()} ${d.toLocaleDateString('en-AU',{ month:'short' })}`;
  });
  // Realistic water volume values in litres
  const data = [5.8, 6.0, 6.2, 6.4, 6.6];
  return { labels, data };
};

// Generate weekly growth progression over 4 weeks (cm)
const generateGrowthChartData = () => {
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const data = [5, 10, 15, 20]; // cm values
  return { labels, data };
};

/**
 * InsightsScreen component
 *
 * Props:
 * - route.params.username: username passed via navigation (fallback 'Guest')
 * - navigation: navigation object for screen transitions
 */
export default function InsightsScreen({ route, navigation }) {
  // Retrieve username from navigation params or fallback to 'Guest'
  const username = route?.params?.username || 'Guest';

  // ── Modal visibility and current value state for each insight metric ──
  const [showHumidityModal, setShowHumidityModal] = useState(false);
  const [humidityPref, setHumidityPref] = useState('Medium');
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [showTempModal, setShowTempModal] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(null);
  // Tooltip state for temperature modal
  const [showTempTooltip, setShowTempTooltip] = useState(false);
  // Tooltip state for humidity modal
  const [showHumidityTooltip, setShowHumidityTooltip] = useState(false);
  // Tooltip state for pH modal
  const [showPhTooltip, setShowPhTooltip] = useState(false);
  // Tooltip state for TDS modal
  const [showTDSTooltip, setShowTDSTooltip] = useState(false);
  // Tooltip state for light modal
  const [showLightTooltip, setShowLightTooltip] = useState(false);
  // Tooltip state for water modal
  const [showWaterTooltip, setShowWaterTooltip] = useState(false);
  // pH modal state
  const [showPhModal, setShowPhModal] = useState(false);
  const [currentPh, setCurrentPh] = useState(null);
  const [phRange, setPhRange] = useState([5.8, 6.3]);
  const [waterMode, setWaterMode] = useState('Auto');
  // New pH control mode state
  const [phMode, setPhMode] = useState('Auto');
  // TDS modal state
  const [showTDSModal, setShowTDSModal] = useState(false);
  const [currentTDS, setCurrentTDS] = useState(null);
  const [TDSRange, setTDSRange] = useState([0, 2000]);
  // Light modal state
  const [showLightModal, setShowLightModal] = useState(false);
  const [currentLight, setCurrentLight] = useState(null);
  const [lightMode, setLightMode] = useState('Auto');
  // Water modal state
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [currentWaterLevel, setCurrentWaterLevel] = useState(null);

  // Determine device width for responsive chart sizing
  const screenWidth = Dimensions.get('window').width;

  // Static array defining each slot’s plant presence and sensor data
  const slots = [
    { id: 1, hasPlant: true, data: { temp: 22.5, humidity: 65, ph: 6.3, TDS: 846.69, light: 2 } },
    { id: 2, hasPlant: false },
    { id: 3, hasPlant: false },
  ];

  // Root safe-area view to respect device notches/status bars
  return (
    <SafeAreaView style={styles.container}>
      {/* Mobile top navigation bar with username display */}
      <TopNavbar username={username} />
      {/* Conditional web navigation bar for browser environment */}
      {Platform.OS === 'web' && <WebNavbar />}
      {/* Use full-page ScrollView on web, smaller on mobile */}
      {Platform.OS === 'web' ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <Text style={[styles.header, Platform.OS === 'web' && { fontSize: 42, textAlign: 'left', marginLeft: 40 }]}>
              {Platform.OS === 'web' ? "Let’s Explore Your Lettuce!" : "Let’s Explore\nYour Lettuce!"}
            </Text>
            <Text style={[styles.dashboardDescription, Platform.OS === 'web' && { fontSize: 20, textAlign: 'left', marginLeft: 45, marginBottom: 40 }]}>Monitor real-time sensor data and get AI-powered growth forecasts.</Text>
            {/* Loop through each slot to render its insight or placeholder UI */}
            {slots.map((slot) => (
              <View key={slot.id} style={styles.slot}>
                <Text style={styles.slotTitle}>Slot #{slot.id}</Text>
                {slot.hasPlant ? (
                  <>
                {/* Environment Insight Mini Cards */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={[styles.blockLabel, { marginLeft: 2}]}>Environmental Overview</Text>
                </View>
                {/* Sensor Cards Layout */}
                {Platform.OS === 'web' ? (
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    rowGap: 24,
                    paddingHorizontal: 40,
                    maxWidth: '100%',
                  }}>
                    <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                      <TouchableOpacity onPress={() => {
                        setCurrentTemp(slot.data.temp);
                        setShowTempModal(true);
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="thermometer-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>Temperature: {slot.data.temp}°C</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                      <TouchableOpacity onPress={() => {
                        setCurrentHumidity(slot.data.humidity);
                        setShowHumidityModal(true);
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="water-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>Humidity: {slot.data.humidity}%</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                      <TouchableOpacity onPress={() => {
                        setCurrentLight(slot.data.light);
                        setShowLightModal(true);
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="sunny-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>Light: {slot.data.light} lux</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                      <TouchableOpacity onPress={() => { setCurrentPh(slot.data.ph); setShowPhModal(true); }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="flask-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>pH: {slot.data.ph}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                      <TouchableOpacity onPress={() => { setCurrentTDS(slot.data.TDS || 846.69); setShowTDSModal(true); }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="speedometer-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>TDS: {slot.data.TDS || 846.69} ppm</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                      <TouchableOpacity onPress={() => {
                        setCurrentWaterLevel(60);
                        setShowWaterModal(true);
                      }}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                          <View style={{ flexDirection:'row', alignItems:'center' }}>
                            <Ionicons name="water-sharp" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>
                              Water: {humidityPref === 'Low' ? '5.0 L' : humidityPref === 'Medium' ? '6.5 L' : '8.0 L'}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.blockCard}>
                      <TouchableOpacity onPress={() => {
                        setCurrentTemp(slot.data.temp);
                        setShowTempModal(true);
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="thermometer-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>Temperature: {slot.data.temp}°C</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.blockCard}>
                      <TouchableOpacity onPress={() => {
                        setCurrentHumidity(slot.data.humidity);
                        setShowHumidityModal(true);
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="water-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>Humidity: {slot.data.humidity}%</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.blockCard}>
                      <TouchableOpacity onPress={() => {
                        setCurrentLight(slot.data.light);
                        setShowLightModal(true);
                      }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="sunny-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>Light: {slot.data.light} lux</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    {/* Interactive pH Card */}
                    <View style={styles.blockCard}>
                      <TouchableOpacity onPress={() => { setCurrentPh(slot.data.ph); setShowPhModal(true); }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="flask-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>pH: {slot.data.ph}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    {/* Interactive TDS Card */}
                    <View style={styles.blockCard}>
                      <TouchableOpacity onPress={() => { setCurrentTDS(slot.data.TDS || 846.69); setShowTDSModal(true); }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="speedometer-outline" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData, { marginLeft: 8 }]}>TDS: {slot.data.TDS || 846.69} ppm</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.blockCard}>
                      <TouchableOpacity onPress={() => {
                        setCurrentWaterLevel(60);
                        setShowWaterModal(true);
                      }}>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                          <View style={{ flexDirection:'row', alignItems:'center' }}>
                            <Ionicons name="water-sharp" size={18} color="#4CAF50" />
                            <Text style={[styles.slotData,{ marginLeft:8 }]}>Water: Medium Level</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color="#999" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* Divider between Water and Growth */}
                <View style={styles.divider} />

                {/* Growth Insight Card */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={[styles.blockLabel, { marginLeft: 2}]}>Growth Forecast</Text>
                </View>
                {/* Smart Cam image mockup */}
                <View style={[styles.blockCard, {
                  padding: 0,
                  overflow: 'hidden',
                  marginBottom: 12,
                  width: '100%',
                  ...(Platform.OS === 'web' ? { paddingHorizontal: 40 } : {})
                }]}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/300x140' }}
                    style={{
                      width: Platform.OS === 'web' ? '95%' : '100%',
                      height: Platform.OS === 'web' ? 200 : 140,
                      alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
                      borderRadius: Platform.OS === 'web' ? 8 : 0,
                    }}
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
                </View>
                <Text style={[
                  { fontSize: 10, fontStyle: 'italic', color: '#555', marginBottom: 12, alignSelf: 'flex-end' },
                  Platform.OS === 'web' && { fontSize: 12 }
                ]}>
                  Photo taken 5 minutes ago
                </Text>
                {/* Growth Progress Card */}
                <View style={styles.blockCard}>
                  <Text style={styles.modalTitle}>Growth Progress</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 12 }}>
                    <Text style={styles.slotData}>0 days</Text>
                    <View style={{
                      flex: 1,
                      height: 8,
                      backgroundColor: '#e8f5e9',
                      marginHorizontal: 8,
                      borderRadius: 4,
                    }}>
                      <View style={{
                        width: `${(5/35) * 100}%`,
                        height: '100%',
                        backgroundColor: '#4CAF50',
                      }} />
                    </View>
                    <Text style={styles.slotData}>30 days</Text>
                  </View>
                  <Text style={[
                    styles.slotData,
                    {
                      fontSize: Platform.OS === 'web' ? 12 : 11,
                      fontStyle: 'italic',
                      marginBottom: 10,
                      alignSelf: Platform.OS === 'web' ? 'flex-end' : 'center'
                    }
                  ]}>
                    Harvest in 25 days (30 May 2025).
                  </Text>
                </View>

                {/* Average Growth Card */}
                <View style={styles.blockCard}>
                  <Text style={styles.modalTitle}>Average Growth</Text>
                  {(() => {
                    const chart = generateGrowthChartData();
                    return (
                      <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', marginVertical: 12 }}>
                        <LineChart
                          data={{ labels: chart.labels, datasets: [{ data: chart.data }] }}
                          width={Platform.OS === 'web' ? screenWidth - 100 : screenWidth - 72}
                          height={Platform.OS === 'web' ? 360 : 180}
                          yAxisSuffix=" cm"
                          withInnerLines
                          withVerticalLines={false}
                          chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: () => '#4CAF50',
                            labelColor: () => '#555',
                            propsForBackgroundLines: {
                              strokeDasharray: [4, 4],
                            },
                            formatYLabel: (label) => `${label} cm`,
                            propsForLabels: Platform.OS === 'web' ? { fontSize: 14 } : {},
                            paddingLeft: Platform.OS === 'web' ? 30 : 12,
                            paddingRight: Platform.OS === 'web' ? 16 : 0,
                          }}
                          bezier
                          style={{
                            marginVertical: 12,
                            borderRadius: 8,
                            marginTop: Platform.OS === 'web' ? 44 : 12,
                            marginLeft: Platform.OS === 'web' ? 50 : -8,
                            marginRight: Platform.OS === 'web' ? 240 : 30
                          }}
                        />
                      </View>
                    );
                  })()}
                  <Text style={[
                    styles.slotData,
                    { fontSize: 11, fontStyle: 'italic', marginTop: 10, alignSelf: 'center' },
                    Platform.OS === 'web' && { fontSize: 12, alignSelf: 'flex-end' }
                  ]}>
                    Growth is 6% ahead of schedule.
                  </Text>
                </View>
                
              </>
            ) : (
              <>
                <Text style={styles.slotStatus}>No insights available {"\n"}— no lettuce planted in this slot</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard', { screen: 'Search' })}>
                  <Text style={styles.chooseText}>+ Add</Text>
                </TouchableOpacity>
              </>
                )}
              </View>
            ))}
          </View>
          <WebFooter />
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={[styles.header, Platform.OS === 'web' && { fontSize: 42, textAlign: 'left', marginLeft: 40 }]}>
            {Platform.OS === 'web' ? "Let’s Explore Your Lettuce!" : "Let’s Explore\nYour Lettuce!"}
          </Text>
          <Text style={[styles.dashboardDescription, Platform.OS === 'web' && { fontSize: 20, textAlign: 'left', marginLeft: 45, marginBottom: 40 }]}>Monitor real-time sensor data and get AI-powered growth forecasts.</Text>
          {slots.map((slot) => (
            <View key={slot.id} style={styles.slot}>
              <Text style={styles.slotTitle}>Slot #{slot.id}</Text>
              {slot.hasPlant ? (
                <>
                  {/* Environment Insight Mini Cards */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[styles.blockLabel, { marginLeft: 2}]}>Environmental Overview</Text>
                  </View>
                  {/* Sensor Cards Layout */}
                  {Platform.OS === 'web' ? (
                    <View style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      rowGap: 24,
                      paddingHorizontal: 40,
                      maxWidth: '100%',
                    }}>
                      <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                        <TouchableOpacity onPress={() => {
                          setCurrentTemp(slot.data.temp);
                          setShowTempModal(true);
                        }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="thermometer-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>Temperature: {slot.data.temp}°C</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                        <TouchableOpacity onPress={() => {
                          setCurrentHumidity(slot.data.humidity);
                          setShowHumidityModal(true);
                        }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="water-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>Humidity: {slot.data.humidity}%</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                        <TouchableOpacity onPress={() => {
                          setCurrentLight(slot.data.light);
                          setShowLightModal(true);
                        }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="sunny-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>Light: {slot.data.light} lux</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                        <TouchableOpacity onPress={() => { setCurrentPh(slot.data.ph); setShowPhModal(true); }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="flask-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>pH: {slot.data.ph}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                        <TouchableOpacity onPress={() => { setCurrentTDS(slot.data.TDS || 846.69); setShowTDSModal(true); }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="speedometer-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>TDS: {slot.data.TDS || 846.69} mS/cm</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.blockCard, { width: '32%', minWidth: 280 }]}>
                        <TouchableOpacity onPress={() => {
                          setCurrentWaterLevel(60);
                          setShowWaterModal(true);
                        }}>
                          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                            <View style={{ flexDirection:'row', alignItems:'center' }}>
                              <Ionicons name="water-sharp" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>
                                Water: {humidityPref === 'Low' ? '5.0 L' : humidityPref === 'Medium' ? '6.5 L' : '8.0 L'}
                              </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <>
                      <View style={styles.blockCard}>
                        <TouchableOpacity onPress={() => {
                          setCurrentTemp(slot.data.temp);
                          setShowTempModal(true);
                        }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="thermometer-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>Temperature: {slot.data.temp}°C</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.blockCard}>
                        <TouchableOpacity onPress={() => {
                          setCurrentHumidity(slot.data.humidity);
                          setShowHumidityModal(true);
                        }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="water-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>Humidity: {slot.data.humidity}%</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.blockCard}>
                        <TouchableOpacity onPress={() => {
                          setCurrentLight(slot.data.light);
                          setShowLightModal(true);
                        }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="sunny-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>Light: {slot.data.light} lux</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      {/* Interactive pH Card */}
                      <View style={styles.blockCard}>
                        <TouchableOpacity onPress={() => { setCurrentPh(slot.data.ph); setShowPhModal(true); }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="flask-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>pH: {slot.data.ph}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      {/* Interactive TDS Card */}
                      <View style={styles.blockCard}>
                        <TouchableOpacity onPress={() => { setCurrentTDS(slot.data.TDS || 846.69); setShowTDSModal(true); }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="speedometer-outline" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData, { marginLeft: 8 }]}>TDS: {slot.data.TDS || 846.69} ppm</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.blockCard}>
                        <TouchableOpacity onPress={() => {
                          setCurrentWaterLevel(60);
                          setShowWaterModal(true);
                        }}>
                          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                            <View style={{ flexDirection:'row', alignItems:'center' }}>
                              <Ionicons name="water-sharp" size={18} color="#4CAF50" />
                              <Text style={[styles.slotData,{ marginLeft:8 }]}>Water: 6.5 L</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {/* Divider between Water and Growth */}
                  <View style={styles.divider} />

                  {/* Growth Insight Card */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[styles.blockLabel, { marginLeft: 2}]}>Growth Forecast</Text>
                  </View>
                  {/* Smart Cam image mockup */}
                  <View style={[styles.blockCard, {
                    padding: 0,
                    overflow: 'hidden',
                    marginBottom: 12,
                    width: '100%',
                    ...(Platform.OS === 'web' ? { paddingHorizontal: 40 } : {})
                  }]}>
                    <Image
                      source={{ uri: 'https://via.placeholder.com/300x140' }}
                      style={{
                        width: Platform.OS === 'web' ? '95%' : '100%',
                        height: Platform.OS === 'web' ? 200 : 140,
                        alignSelf: Platform.OS === 'web' ? 'center' : 'stretch',
                        borderRadius: Platform.OS === 'web' ? 8 : 0,
                      }}
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
                  </View>
                  <Text style={[
                    { fontSize: 10, fontStyle: 'italic', color: '#555', marginBottom: 12, alignSelf: 'flex-end' },
                    Platform.OS === 'web' && { fontSize: 12 }
                  ]}>
                    Photo taken 5 minutes ago
                  </Text>
                  {/* Growth Progress Card */}
                  <View style={styles.blockCard}>
                    <Text style={styles.modalTitle}>Growth Progress</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 12 }}>
                      <Text style={styles.slotData}>0 days</Text>
                      <View style={{
                        flex: 1,
                        height: 8,
                        backgroundColor: '#e8f5e9',
                        marginHorizontal: 8,
                        borderRadius: 4,
                      }}>
                        <View style={{
                          width: `${(5/35) * 100}%`,
                          height: '100%',
                          backgroundColor: '#4CAF50',
                        }} />
                      </View>
                      <Text style={styles.slotData}>30 days</Text>
                    </View>
                    <Text style={[
                      styles.slotData,
                      { fontSize: 11, fontStyle: 'italic', marginBottom: 10, alignSelf: 'center' },
                      Platform.OS === 'web' && { fontSize: 12, alignSelf: 'flex-end' }
                    ]}>
                      Harvest in 25 days (30 May 2025).
                    </Text>
                  </View>

                  {/* Average Growth Card */}
                  <View style={styles.blockCard}>
                    <Text style={styles.modalTitle}>Average Growth</Text>
                    {(() => {
                      const chart = generateGrowthChartData();
                      return (
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', marginVertical: 12 }}>
                          <LineChart
                            data={{ labels: chart.labels, datasets: [{ data: chart.data }] }}
                            width={Platform.OS === 'web' ? screenWidth - 100 : screenWidth - 72}
                            height={Platform.OS === 'web' ? 360 : 180}
                            yAxisSuffix=" cm"
                            withInnerLines
                            withVerticalLines={false}
                            chartConfig={{
                              backgroundColor: '#fff',
                              backgroundGradientFrom: '#fff',
                              backgroundGradientTo: '#fff',
                              decimalPlaces: 0,
                              color: () => '#4CAF50',
                              labelColor: () => '#555',
                              propsForBackgroundLines: {
                                strokeDasharray: [4, 4],
                              },
                              formatYLabel: (label) => `${label} cm`,
                              propsForLabels: Platform.OS === 'web' ? { fontSize: 14 } : {},
                              paddingLeft: Platform.OS === 'web' ? 30 : 12,
                              paddingRight: Platform.OS === 'web' ? 16 : 0,
                            }}
                            bezier
                            style={{
                              marginVertical: 12,
                              borderRadius: 8,
                              marginTop: Platform.OS === 'web' ? 44 : 12,
                              marginLeft: Platform.OS === 'web' ? 50 : -8,
                              marginRight: Platform.OS === 'web' ? 240 : 30
                            }}
                          />
                        </View>
                      );
                    })()}
                    <Text style={[
                      styles.slotData,
                      { fontSize: 11, fontStyle: 'italic', marginTop: 10, alignSelf: 'center' },
                      Platform.OS === 'web' && { fontSize: 12, alignSelf: 'flex-end' }
                    ]}>
                      Growth is 6% ahead of schedule.
                    </Text>
                  </View>
                  
                </>
              ) : (
                <>
                  <Text style={styles.slotStatus}>No insights available {"\n"}— no lettuce planted in this slot</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Dashboard', { screen: 'Search' })}>
                    <Text style={styles.chooseText}>+ Add</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent
        visible={showWaterModal}
        onRequestClose={() => setShowWaterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBody}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={[
                { fontWeight: 'bold', marginBottom: 12 },
                Platform.OS === 'web' ? { fontSize: 34 } : { fontSize: 24 }
              ]}>
                Water Insight
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#333', marginLeft: 6 }}>
                  Current Water: <Text style={{ fontWeight: 'bold' }}>
                    {humidityPref === 'Low' ? '5.0 L' : humidityPref === 'Medium' ? '6.5 L' : '8.0 L'}
                  </Text>
                </Text>
                <View style={{ marginLeft: 6 }}>
                  <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS !== 'web') setShowWaterTooltip?.(prev => !prev);
                    }}
                    onMouseEnter={() => Platform.OS === 'web' && setShowWaterTooltip?.(true)}
                    onMouseLeave={() => Platform.OS === 'web' && setShowWaterTooltip?.(false)}
                  >
                    <Ionicons name="information-circle-outline" size={16} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              </View>
              {showWaterTooltip && (
                <View
                  style={{
                    position: 'absolute',
                    top: 28,
                    left: -20,
                    backgroundColor: '#e8f5e9',
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 8,
                    zIndex: 999999,
                    elevation: 10,
                    maxWidth: Dimensions.get('window').width * 0.95,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#333', lineHeight: 16, textAlign: 'center' }}>
                    {Platform.OS === 'web'
                      ? 'Ideal water level for lettuce growth is between 5.0–8.0 L. Your current water level is within this optimal range.'
                      : 'Ideal water level for lettuce growth is between 5.0–8.0 L.\nYour current water level is within this optimal range.'}
                  </Text>
                </View>
              )}
            </View>
            {/* Chart */}
            {(() => {
              const chart = generateWaterChartData();
              return (
                <LineChart
                  data={{ labels: chart.labels, datasets: [{ data: chart.data, color:()=> '#4CAF50', yAxisMin: 5, yAxisMax: 8 }] }}
                  width={Dimensions.get('window').width * 0.68}
                  height={180}
                  withVerticalLines={false}
                  yAxisSuffix=" L"
                  chartConfig={{
                    backgroundColor:'#fff',
                    backgroundGradientFrom:'#fff',
                    backgroundGradientTo:'#fff',
                    decimalPlaces: 1,
                    color:()=> '#4CAF50',
                    labelColor:()=> '#555',
                    propsForDots:{ r:'4', strokeWidth:'2', stroke:'#fff' },
                  }}
                  bezier
                  style={{
                    marginVertical: 12,
                    borderRadius: 8,
                    marginTop: Platform.OS === 'web' ? 48 : 12
                  }}
                  fromZero={false}
                  yAxisInterval={1}
                  segments={3}
                  getDotColor={() => '#4CAF50'}
                  yLabelsOffset={10}
                  formatYLabel={(label) => `${parseFloat(label).toFixed(1)}`}
                  decorator={() => null}
                />
              );
            })()}

            {/* Water Volume */}
            <Text style={styles.modalSectionTitle}>Target Water Volume</Text>
            <Text style={[
              { color: '#333', marginTop: 4, marginBottom: 6 },
              Platform.OS === 'web' ? { fontSize: 16 } : { fontSize: 14 }
            ]}>
              Current Volume: <Text style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                {humidityPref} {humidityPref === 'Low' ? '(≈5.0 L)' : humidityPref === 'Medium' ? '(≈6.5 L)' : '(≈8.0 L)'}
              </Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 10 }}>
              <Text
                style={{
                  color: humidityPref === 'Low' ? '#4CAF50' : '#A0A0A0',
                  fontWeight: humidityPref === 'Low' ? 'bold' : 'normal'
                }}
              >
                Low
              </Text>
              <Text
                style={{
                  color: humidityPref === 'Medium' ? '#4CAF50' : '#A0A0A0',
                  fontWeight: humidityPref === 'Medium' ? 'bold' : 'normal'
                }}
              >
                Medium
              </Text>
              <Text
                style={{
                  color: humidityPref === 'High' ? '#4CAF50' : '#A0A0A0',
                  fontWeight: humidityPref === 'High' ? 'bold' : 'normal'
                }}
              >
                High
              </Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={2}
              step={1}
              minimumTrackTintColor="#4CAF50"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#4CAF50"
              value={humidityPref === 'Low' ? 0 : humidityPref === 'Medium' ? 1 : 2}
              onValueChange={(value) => {
                const pref = value === 0 ? 'Low' : value === 1 ? 'Medium' : 'High';
                setHumidityPref(pref);
              }}
            />

            <View style={{ alignSelf: 'center', marginTop: 14 }}>
              <Text style={{
                fontSize: 13,
                color: '#000',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Optimized by AI 15 minutes ago
              </Text>
            </View>
            <Pressable style={{ marginTop:20, alignSelf:'flex-end' }} onPress={()=>setShowWaterModal(false)}>
              <Text style={{ fontWeight:'bold' }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLightModal}
        onRequestClose={() => setShowLightModal(false)}
      >
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)' }}>
          <View style={{ width:'80%', backgroundColor:'white', borderRadius:12, padding:24 }}>
            <Text style={[
              { fontWeight: 'bold', marginBottom: 12 },
              Platform.OS === 'web' ? { fontSize: 34 } : { fontSize: 24 }
            ]}>
              Light Insight
            </Text>
            {/* Brightness label */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, color: '#333', marginLeft: 6 }}>
                Current Brightness: <Text style={{ fontWeight: 'bold' }}>{currentLight}</Text> lux
              </Text>
              <View style={{ marginLeft: 6 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== 'web') setShowLightTooltip(!showLightTooltip);
                  }}
                  onMouseEnter={() => Platform.OS === 'web' && setShowLightTooltip(true)}
                  onMouseLeave={() => Platform.OS === 'web' && setShowLightTooltip(false)}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              {showLightTooltip && (
                <View style={{
                  position: 'absolute',
                  top: 28,
                  left: 0,
                  backgroundColor: '#e8f5e9',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  zIndex: 99,
                  maxWidth: Dimensions.get('window').width * 0.85,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}>
                  <Text style={{ fontSize: 12, color: '#333', lineHeight: 16 }}>
                    {Platform.OS === 'web'
                      ? 'Lettuce thrives in well-lit environments. Your current light intensity supports healthy growth.'
                      : 'Lettuce thrives in well-lit environments.\nYour current light intensity supports healthy growth.'}
                  </Text>
                </View>
              )}
            </View>
            {/* Light Trend Chart */}
            {(() => {
              const lightChart = generateLightChartData();
              return (
                <LineChart
                  data={{ labels: lightChart.labels, datasets: [{ data: lightChart.data, color: () => '#4CAF50' }] }}
                  width={Dimensions.get('window').width * 0.68}
                  height={180}
                  withVerticalLines={false}
                  chartConfig={{
                    backgroundColor:'#fff',
                    backgroundGradientFrom:'#fff',
                    backgroundGradientTo:'#fff',
                    decimalPlaces:0,
                    color: () => '#4CAF50',
                    labelColor: () => '#555',
                    propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
                  }}
                  bezier
                  style={{
                    marginVertical: 12,
                    borderRadius: 8,
                    marginTop: Platform.OS === 'web' ? 48 : 12
                  }}
                />
              );
            })()}
            <Text style={styles.modalSectionTitle}>Light Mode</Text>
            <Text style={[
              { color: '#333', marginTop: 8, marginBottom: 6 },
              Platform.OS === 'web' ? { fontSize: 16 } : { fontSize: 14 }
            ]}>
              Current: <Text style={{ fontWeight: 'bold', color: '#4CAF50' }}>{lightMode}</Text>
            </Text>
            <View style={[styles.segmentContainer, { marginTop:12 }]}>
              {['Auto','Schedule','Manual'].map((mode, idx, arr) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.segmentButton,
                    idx === 0 && styles.segmentFirst,
                    idx === arr.length-1 && styles.segmentLast,
                    lightMode === mode && styles.segmentButtonActive
                  ]}
                  onPress={() => setLightMode(mode)}
                >
                  <Text style={[styles.segmentButtonText, lightMode === mode && styles.segmentButtonTextActive]}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ alignSelf: 'center', marginTop: 14 }}>
              <Text style={{
                fontSize: 13,
                color: '#000',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Optimized by AI 30 minutes ago
              </Text>
            </View>
            <Pressable style={{ marginTop:20, alignSelf:'flex-end' }} onPress={() => setShowLightModal(false)}>
              <Text style={{ fontWeight:'bold' }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTDSModal}
        onRequestClose={() => setShowTDSModal(false)}
      >
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.3)' }}>
          <View style={{ width:'80%', backgroundColor:'white', borderRadius:12, padding:24 }}>
            <Text style={[
              { fontWeight: 'bold', marginBottom: 12 },
              Platform.OS === 'web' ? { fontSize: 34 } : { fontSize: 24 }
            ]}>
              TDS Insight
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, color: '#333', marginLeft: 6 }}>
                Current TDS: <Text style={{ fontWeight: 'bold' }}>{currentTDS}</Text> ppm
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== 'web') setShowTDSTooltip(!showTDSTooltip);
                }}
                onMouseEnter={() => Platform.OS === 'web' && setShowTDSTooltip(true)}
                onMouseLeave={() => Platform.OS === 'web' && setShowTDSTooltip(false)}
              >
                <Ionicons name="information-circle-outline" size={16} color="#4CAF50" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
              {showTDSTooltip && (
                <View style={{
                  position: 'absolute',
                  top: 28,
                  left: 0,
                  backgroundColor: '#e8f5e9',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  zIndex: 999999,
                  elevation: 10,
                  maxWidth: Dimensions.get('window').width * 0.85,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}>
                  <Text style={{ fontSize: 12, color: '#333', lineHeight: 16 }}>
                    {Platform.OS === 'web'
                      ? 'Ideal nutrient concentration is between 0–2000 ppm. Your current TDS is within this optimal range.'
                      : 'Ideal nutrient concentration is between 0–2000 ppm.\nYour current TDS is within this optimal range.'}
                  </Text>
                </View>
              )}
            </View>
            {/* TDS Trend Chart */}
            {(() => {
              const TDSChart = generateTDSChartData();
              return (
                <LineChart
                  data={{ labels: TDSChart.labels, datasets: [{ data: TDSChart.data, color: () => '#4CAF50' }] }}
                  width={Dimensions.get('window').width * 0.68}
                  height={180}
                  withVerticalLines={false}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 2,
                    color: () => '#4CAF50',
                    labelColor: () => '#555',
                    propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
                  }}
                  bezier
                  style={{
                    marginVertical: 12,
                    borderRadius: 8,
                    marginTop: Platform.OS === 'web' ? 48 : 12
                  }}
                />
              );
            })()}
            {/* Dispense Nutrients Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  alert('Pumping nutrients now');
                } else {
                  Alert.alert('Notice', 'Pumping nutrients now');
                }
              }}
            >
              <Text style={styles.actionButtonText}>Dispense Nutrients</Text>
            </TouchableOpacity>
            <View style={{ alignSelf: 'center', marginTop: 14 }}>
              <Text style={{
                fontSize: 13,
                color: '#000',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Optimized by AI 15 minutes ago
              </Text>
            </View>
            <Pressable style={{ marginTop:20, alignSelf:'flex-end' }} onPress={()=>setShowTDSModal(false)}>
              <Text style={{ fontWeight:'bold' }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPhModal}
        onRequestClose={() => setShowPhModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 12, padding: 24 }}>
            <Text style={[
              { fontWeight: 'bold', marginBottom: 12 },
              Platform.OS === 'web' ? { fontSize: 34 } : { fontSize: 24 }
            ]}>
              pH Insight
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, color: '#333', marginLeft: 6 }}>
                Current pH: <Text style={{ fontWeight: 'bold' }}>{currentPh}</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS !== 'web') setShowPhTooltip(!showPhTooltip);
                }}
                onMouseEnter={() => Platform.OS === 'web' && setShowPhTooltip(true)}
                onMouseLeave={() => Platform.OS === 'web' && setShowPhTooltip(false)}
              >
                <Ionicons name="information-circle-outline" size={16} color="#4CAF50" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
              {showPhTooltip && (
                <View style={{
                  position: 'absolute',
                  top: 28,
                  left: 0,
                  backgroundColor: '#e8f5e9',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  zIndex: 999999,
                  elevation: 10,
                  maxWidth: Dimensions.get('window').width * 0.85,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}>
                  <Text style={{ fontSize: 12, color: '#333', lineHeight: 16 }}>
                    {Platform.OS === 'web'
                      ? 'Ideal pH for lettuce growth is between 5.8–6.3. Your current pH is within this optimal range.'
                      : 'Ideal pH for lettuce growth is between 5.8–6.3.\nYour current pH is within this optimal range.'}
                  </Text>
                </View>
              )}
            </View>
            {/* pH Line Chart */}
            {(() => {
              const phChart = generatePhChartData();
              return (
                <LineChart
                  data={{ labels: phChart.labels, datasets: [{ data: phChart.data }] }}
                  width={Dimensions.get('window').width * 0.68}
                  height={180}
                  withVerticalLines={false}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 2,
                    color: () => '#4CAF50',
                    labelColor: () => '#555',
                    propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
                  }}
                  style={{
                    marginVertical: 12,
                    borderRadius: 8,
                    marginTop: Platform.OS === 'web' ? 48 : 12
                  }}
                />
              );
            })()}
            {/* pH label */}
            <Text style={styles.modalSectionTitle}>pH Mode</Text>
            <Text style={[
              { color: '#333', marginTop: 8, marginBottom: 6 },
              Platform.OS === 'web' ? { fontSize: 16 } : { fontSize: 14 }
            ]}>
              Current: <Text style={{ fontWeight: 'bold', color: '#4CAF50' }}>{phMode}</Text>
            </Text>
            <View style={[styles.segmentContainer, { marginTop: 16 }]}>
              {['Auto', 'Schedule', 'Manual'].map((mode, idx, arr) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.segmentButton,
                    idx === 0 && styles.segmentFirst,
                    idx === arr.length - 1 && styles.segmentLast,
                    phMode === mode && styles.segmentButtonActive
                  ]}
                  onPress={() => setPhMode(mode)}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      phMode === mode && styles.segmentButtonTextActive
                    ]}
                  >
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ alignSelf: 'center', marginTop: 14 }}>
              <Text style={{
                fontSize: 13,
                color: '#000',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Optimized by AI 30 minutes ago
              </Text>
            </View>
            <Pressable style={{ marginTop: 20, alignSelf: 'flex-end' }} onPress={() => setShowPhModal(false)}>
              <Text style={{fontWeight: 'bold' }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Humidity Insight Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showHumidityModal}
        onRequestClose={() => setShowHumidityModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, width: '80%' }}>
            <Text style={[
              { fontWeight: 'bold', marginBottom: 12 },
              Platform.OS === 'web' ? { fontSize: 34 } : { fontSize: 24 }
            ]}>
              Humidity Insight
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', position: 'relative', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, color: '#333', marginLeft: 6 }}>
                Current Humidity: <Text style={{ fontWeight: 'bold' }}>{currentHumidity}%</Text>
              </Text>
              <View style={{ marginLeft: 6 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== 'web') setShowHumidityTooltip(!showHumidityTooltip);
                  }}
                  onMouseEnter={() => Platform.OS === 'web' && setShowHumidityTooltip(true)}
                  onMouseLeave={() => Platform.OS === 'web' && setShowHumidityTooltip(false)}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              {showHumidityTooltip && (
                <View style={{
                  position: 'absolute',
                  top: 28,
                  left: Platform.OS === 'web' ? 0 : 6,
                  backgroundColor: '#e8f5e9',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  zIndex: 99,
                  maxWidth: Dimensions.get('window').width * 0.85,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}>
                  <Text style={{ fontSize: 12, color: '#333', lineHeight: 16 }}>
                    {Platform.OS === 'web'
                      ? 'Ideal humidity for lettuce growth is between 40–65%. Your current humidity is within this optimal range.'
                      : 'Ideal humidity for lettuce growth is between 40–65%.\nYour current humidity is within this optimal range.'}
                  </Text>
                </View>
              )}
            </View>
            {(() => {
              // Dynamic humidity chart: last 5 days, realistic 40–65% values
              const today = new Date();
              const days = [-2, -1, 0, 1, 2];
              const labels = days.map(offset => {
                const d = new Date(today);
                d.setDate(today.getDate() + offset);
                return `${d.getDate()} ${d.toLocaleDateString('en-AU', { month: 'short' })}`;
              });
              // Mock data: within 40–65%, ascending for realism
              const data = [58, 60, 61, 62, 63];
              const chart = { labels, data };
              return (
                <LineChart
                  data={{ labels: chart.labels, datasets: [{ data: chart.data }] }}
                  width={Dimensions.get('window').width * 0.68}
                  height={180}
                  withVerticalLines={false}
                  yAxisSuffix="%"
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: () => '#4CAF50',
                    labelColor: () => '#555',
                    propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
                  }}
                  bezier
                  style={{
                    marginVertical: 12,
                    borderRadius: 8,
                    marginTop: Platform.OS === 'web' ? 48 : 12
                  }}
                />
              );
            })()}

            <View style={{ alignSelf: 'center', marginTop: 14 }}>
              <Text style={{
                fontSize: 13,
                color: '#000',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Optimized by AI 30 minutes ago
              </Text>
            </View>
            <Pressable style={{ marginTop: 20, alignSelf: 'flex-end' }} onPress={() => setShowHumidityModal(false)}>
              <Text style={{fontWeight: 'bold' }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
       
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTempModal}
        onRequestClose={() => setShowTempModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, width: '80%' }}>
            <Text style={[
              { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
              Platform.OS === 'web' && { fontSize: 34 }
            ]}>
              Temperature Insight
            </Text>
            {/* Current Temp label with info icon and tooltip (stacked layout) */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, position: 'relative' }}>
              <Text style={{ fontSize: 18, color: '#333', marginLeft:6 }}>
                Current Temp: <Text style={{ fontWeight: 'bold' }}>{currentTemp}</Text>°C
              </Text>
              <View style={{ marginLeft: 6 }}>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS !== 'web') setShowTempTooltip(!showTempTooltip);
                  }}
                  onMouseEnter={() => Platform.OS === 'web' && setShowTempTooltip(true)}
                  onMouseLeave={() => Platform.OS === 'web' && setShowTempTooltip(false)}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              {showTempTooltip && (
                <View style={{
                  position: 'absolute',
                  top: 28,
                  left: 0,
                  backgroundColor: '#e8f5e9',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  zIndex: 99,
                  maxWidth: Dimensions.get('window').width * 0.85,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}>
                  <Text style={{ fontSize: 12, color: '#333', lineHeight: 16 }}>
                    {Platform.OS === 'web'
                      ? 'Ideal lettuce growth occurs between 20–24°C. Your current temperature is within this optimal range.'
                      : 'Ideal lettuce growth occurs between 20–24°C.\nYour current temperature is within this optimal range.'}
                  </Text>
                </View>
              )}
            </View>

            {/** Dynamic chart data for temperature */}
            {(() => {
              const chartData = generateTempChartData();
              return (
                <LineChart
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        data: chartData.temps,
                        color: () => '#4CAF50',
                        strokeWidth: 2,
                      },
                    ],
                  }}
                  width={
                    Platform.OS === 'web'
                      ? Dimensions.get('window').width * 0.72
                      : Dimensions.get('window').width * 0.68
                  }
                  height={Platform.OS === 'web' ? 280 : 200}
                  withVerticalLines={false}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(16, 139, 73, ${opacity})`,
                    labelColor: () => '#555',
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#fff',
                    },
                    propsForLabels: Platform.OS === 'web' ? { fontSize: 14 } : {},
                    fromZero: true,
                  }}
                  bezier
                  style={{
                    marginTop: Platform.OS === 'web' ? 36 : 24,
                    marginLeft: Platform.OS === 'web' ? 40 : 0,
                    borderRadius: 8,
                  }}
                />
              );
            })()}

            {/* AI Feedback */}
            <View style={{ alignSelf: 'center', marginTop: 14 }}>
              <Text style={{
                fontSize: 13,
                color: '#000',
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Optimized by AI 15 minutes ago
              </Text>
            </View>

            <Pressable style={{ marginTop: 20, alignSelf: 'flex-end' }} onPress={() => setShowTempModal(false)}>
              <Text style={{fontWeight: 'bold' }}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles: layout, typography, cards, and modals ──
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
    ...(Platform.OS === 'web' ? { marginLeft: 60, marginRight: 60 } : {}),
  },
  slotTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  slotStatus: {
    fontSize: 15,
    color: '#999',
    fontStyle: 'italic',
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
    width: '100%',
    position: 'relative',
  },
  blockLabel: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#4CAF50',
    marginBottom: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  blockValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
    width: '100%',
  },
  phButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 6
  },
  prediction: {
    marginTop: 12,
    fontSize: 14,
    color: '#108b49',
    fontWeight: '500'
  },
  segmentContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  segmentFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  segmentLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#4CAF50',
  },
  segmentButtonText: {
    fontSize: 14,
    color: '#000',
  },
  segmentButtonTextActive: {
    fontWeight: 'bold',
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 12,
    alignSelf: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#108b49',
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  modalHighlight: {
    fontSize: 12,
    color: '#4CAF50',
  },
});

const extraStyles = StyleSheet.create({
  modalOverlay: {
    flex:1, justifyContent:'center', alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.3)'
  },
  modalBody: {
    width:'80%', backgroundColor:'white',
    borderRadius:12, padding:24
  },
  modalTitle: {
    fontSize:18, fontWeight:'bold',
  },
  modalText: {
    fontSize:12, color:'#777', marginBottom:12
  },
  modalSectionTitle: {
    fontSize: Platform.OS === 'web' ? 20 : 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
});
// Patch styles into main styles object for modal usage
Object.assign(styles, extraStyles);