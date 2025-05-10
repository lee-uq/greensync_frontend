/**
 * ProfileScreen
 *
 * Screen for viewing and editing user profile information.
 * - Reads `username` and `email` from context or route params.
 * - Allows updating username, email, and password.
 * - Toggles for ethics agreement and notifications.
 * - Adapts layout for web vs. native platforms.
 */

// Core React imports and hooks
import React, { useState, useContext } from 'react';
// React Native UI components and utilities
import { View, Text, StyleSheet, SafeAreaView, TextInput, Switch, Pressable, ScrollView, Alert } from 'react-native';
// Mobile top navigation bar
import TopNavbar from '../components/TopNavbar';
// Web-only navigation components
import WebNavbar from '../components/WebNavbar';
import WebFooter from '../components/WebFooter';
// Platform detection for conditional rendering
import { Platform } from 'react-native';
// Context for shared user data
import { UserContext } from '../UserContext';

/**
 * ProfileScreen component
 *
 * Props:
 * - route.params.username: optional username passed via navigation
 * - route.params.email: optional email passed via navigation
 */
export default function ProfileScreen({ route }) {
  // Get username from context if not provided via route
  const { username: contextUsername } = useContext(UserContext);
  // Extract username and email from navigation params
  const { username: routeUsername, email: routeEmail } = route.params || {};

  // ── Local state for form fields and toggles ───────────────────────────
  const [user, setUser] = useState(routeUsername || contextUsername || '');
  const [mail, setMail] = useState(routeEmail || '');
  const [pass, setPass] = useState('');
  const [agreeEthics, setAgreeEthics] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Render safe-area container and navigation bars
  return (
    // Root safe-area view to avoid notches/status bars
    <SafeAreaView style={styles.container}>
      {/* Mobile top navigation bar */}
      <TopNavbar />
      {/* Web navigation bar (only on web) */}
      {Platform.OS === 'web' && <WebNavbar />}
      {/* Use ScrollView wrapper on web for full-page scroll; native uses direct view */}
      {Platform.OS === 'web' ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            {/* Screen header with responsive font sizing */}
            <Text style={[styles.header, Platform.OS === 'web' && { fontSize: 42, textAlign: 'left', marginLeft: 40 }]}>
              {Platform.OS === 'web' ? "Let’s Manage Your Profile!" : "Let’s Manage\nYour Profile!"}
            </Text>
            {/* Card container for profile form fields */}
            <View style={[styles.infoCard, Platform.OS === 'web' && { paddingHorizontal: 40, paddingVertical: 40 }]}>
              {/* Label for the following input */}
              <Text style={styles.infoLabel}>Username</Text>
              {/* Input bound to corresponding state */}
              <TextInput
                style={styles.infoInput}
                value={user}
                onChangeText={setUser}
                autoCapitalize="none"
              />
              {/* Label for the following input */}
              <Text style={styles.infoLabel}>Email</Text>
              {/* Input bound to corresponding state */}
              <TextInput
                style={styles.infoInput}
                value={mail}
                onChangeText={setMail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {/* Label for the following input */}
              <Text style={styles.infoLabel}>Password</Text>
              {/* Input bound to corresponding state */}
              <TextInput
                style={styles.infoInput}
                value={pass}
                onChangeText={setPass}
                secureTextEntry
                placeholder="Enter new password"
              />

              {/* Toggle to agree to ethics policy */}
              {/* Ethics Agreement */}
              <View style={styles.toggleRow}>
                <Text style={styles.infoLabel}>Agree to Ethics Policy</Text>
                {Platform.OS === 'web' ? (
                  <Pressable
                    onPress={() => setAgreeEthics(!agreeEthics)}
                    style={{
                      width: 48,
                      height: 24,
                      borderRadius: 24,
                      backgroundColor: agreeEthics ? '#4CAF50' : '#ccc',
                      justifyContent: 'center',
                      paddingHorizontal: 2,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: '#ffffff',
                        alignSelf: agreeEthics ? 'flex-end' : 'flex-start',
                      }}
                    />
                  </Pressable>
                ) : (
                  <Switch
                    value={agreeEthics}
                    onValueChange={setAgreeEthics}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#ccc"
                  />
                )}
              </View>

              {/* Link to view ethics policy */}
              {/* Read Ethics Policy link */}
              <Pressable
                onPress={() => {
                  // TODO: navigate to policy or open modal
                  alert('Opening Ethics Policy...');
                }}
              >
                <Text style={styles.link}>Read Ethics Policy</Text>
              </Pressable>

              {/* Toggle to enable notifications */}
              {/* Notifications */}
              <View style={styles.toggleRow}>
                <Text style={styles.infoLabel}>Enable Notifications</Text>
                {Platform.OS === 'web' ? (
                  <Pressable
                    onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                    style={{
                      width: 48,
                      height: 24,
                      borderRadius: 24,
                      backgroundColor: notificationsEnabled ? '#4CAF50' : '#ccc',
                      justifyContent: 'center',
                      paddingHorizontal: 2,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: '#ffffff',
                        alignSelf: notificationsEnabled ? 'flex-end' : 'flex-start',
                      }}
                    />
                  </Pressable>
                ) : (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#ccc', true: '#4CAF50' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#ccc"
                  />
                )}
              </View>

              {/* Button to save profile changes */}
              {/* Save Button */}
              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  if (Platform.OS === 'web') {
                    window.alert("Your changes have been saved successfully.");
                  } else {
                    Alert.alert(
                      "Profile Updated",
                      "Your changes have been saved successfully.",
                      [{ text: "OK", style: "default" }]
                    );
                  }
                }}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
          {/* FAQ Q&A Section */}
          <View style={[styles.infoCard, Platform.OS === 'web' && { paddingHorizontal: 40, paddingVertical: 40 }]}>
            <Text style={[styles.header, { fontSize: 25, marginBottom: 12 }]}>Frequently Asked Questions</Text>

            <Text style={styles.infoLabel}>Q: How do I change my password?</Text>
            <Text style={styles.infoValue}>A: Enter a new password in the field above and press "Save Changes."</Text>

            <Text style={styles.infoLabel}>Q: Will I receive notifications?</Text>
            <Text style={styles.infoValue}>A: Only if you enable them using the toggle above.</Text>

            <Text style={styles.infoLabel}>Q: Where can I find the ethics policy?</Text>
            <Text style={styles.infoValue}>A: Click on the "Read Ethics Policy" link above to learn more.</Text>

            <Text style={styles.infoLabel}>Have another question?</Text>
            <TextInput
              style={styles.infoInput}
              placeholder="Type your question here..."
              multiline
            />
            <Pressable
              style={styles.saveButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert("Your question has been sent to our team.");
                } else {
                  Alert.alert(
                    "Thank You!",
                    "Your question has been sent to our team.",
                    [{ text: "OK", style: "default" }]
                  );
                }
              }}
            >
              <Text style={styles.saveButtonText}>Send to Support</Text>
            </Pressable>
          </View>
          <WebFooter />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Screen header with responsive font sizing */}
          <Text style={[styles.header, Platform.OS === 'web' && { fontSize: 42, textAlign: 'left', marginLeft: 40 }]}>
            {Platform.OS === 'web' ? "Let’s Managae Your Profile!" : "Let’s Manage\nYour Profile!"}
          </Text>
          {/* Card container for profile form fields */}
          <View style={[styles.infoCard, Platform.OS === 'web' && { paddingHorizontal: 40, paddingVertical: 40 }]}>
            {/* Label for the following input */}
            <Text style={styles.infoLabel}>Username</Text>
            {/* Input bound to corresponding state */}
            <TextInput
              style={styles.infoInput}
              value={user}
              onChangeText={setUser}
              autoCapitalize="none"
            />
            {/* Label for the following input */}
            <Text style={styles.infoLabel}>Email</Text>
            {/* Input bound to corresponding state */}
            <TextInput
              style={styles.infoInput}
              value={mail}
              onChangeText={setMail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {/* Label for the following input */}
            <Text style={styles.infoLabel}>Password</Text>
            {/* Input bound to corresponding state */}
            <TextInput
              style={styles.infoInput}
              value={pass}
              onChangeText={setPass}
              secureTextEntry
              placeholder="Enter new password"
            />

            {/* Toggle to agree to ethics policy */}
            {/* Ethics Agreement */}
            <View style={styles.toggleRow}>
              <Text style={styles.infoLabel}>Agree to Ethics Policy</Text>
              {Platform.OS === 'web' ? (
                <Pressable
                  onPress={() => setAgreeEthics(!agreeEthics)}
                  style={{
                    width: 48,
                    height: 24,
                    borderRadius: 24,
                    backgroundColor: agreeEthics ? '#4CAF50' : '#ccc',
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#ffffff',
                      alignSelf: agreeEthics ? 'flex-end' : 'flex-start',
                    }}
                  />
                </Pressable>
              ) : (
                <Switch
                  value={agreeEthics}
                  onValueChange={setAgreeEthics}
                  trackColor={{ false: '#ccc', true: '#4CAF50' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#ccc"
                />
              )}
            </View>

            {/* Link to view ethics policy */}
            {/* Read Ethics Policy link */}
            <Pressable
              onPress={() => {
                // TODO: navigate to policy or open modal
                alert('Opening Ethics Policy...');
              }}
            >
              <Text style={styles.link}>Read Ethics Policy</Text>
            </Pressable>

            {/* Toggle to enable notifications */}
            {/* Notifications */}
            <View style={styles.toggleRow}>
              <Text style={styles.infoLabel}>Enable Notifications</Text>
              {Platform.OS === 'web' ? (
                <Pressable
                  onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                  style={{
                    width: 48,
                    height: 24,
                    borderRadius: 24,
                    backgroundColor: notificationsEnabled ? '#4CAF50' : '#ccc',
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#ffffff',
                      alignSelf: notificationsEnabled ? 'flex-end' : 'flex-start',
                    }}
                  />
                </Pressable>
              ) : (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#ccc', true: '#4CAF50' }}
                  thumbColor="#ffffff"
                  ios_backgroundColor="#ccc"
                />
              )}
            </View>

            {/* Button to save profile changes */}
            {/* Save Button */}
            <Pressable
              style={styles.saveButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert("Your changes have been saved successfully.");
                } else {
                  Alert.alert(
                    "Profile Updated",
                    "Your changes have been saved successfully.",
                    [{ text: "OK", style: "default" }]
                  );
                }
              }}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </Pressable>
          </View>
          {/* FAQ Q&A Section */}
          <View style={[styles.infoCard, Platform.OS === 'web' && { paddingHorizontal: 40, paddingVertical: 40 }]}>
            <Text style={[styles.header, { fontSize: 20, marginBottom: 12 }]}>Frequently Asked Questions</Text>

            <Text style={styles.infoLabel}>Q: How do I change my password?</Text>
            <Text style={styles.infoValue}>A: Enter a new password in the field above and press "Save Changes."</Text>

            <Text style={styles.infoLabel}>Q: Will I receive notifications?</Text>
            <Text style={styles.infoValue}>A: Only if you enable them using the toggle above.</Text>

            <Text style={styles.infoLabel}>Q: Where can I find the ethics policy?</Text>
            <Text style={styles.infoValue}>A: Click on the "Read Ethics Policy" link above to learn more.</Text>

            <Text style={styles.infoLabel}>Have another question?</Text>
            <TextInput
            style={styles.infoInput}
            placeholder="Type your question here..."
            multiline
            />
            <Pressable
              style={styles.saveButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert("Your question has been sent to our team.");
                } else {
                  Alert.alert(
                    "Thank You!",
                    "Your question has been sent to our team.",
                    [{ text: "OK", style: "default" }]
                  );
                }
              }}
            >
              <Text style={styles.saveButtonText}>Send to Support</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── Styles: layout, typography, and form elements ────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginLeft: 20,
    ...(Platform.OS === 'web' ? { fontSize: 42, textAlign: 'center', marginLeft: 0 } : {}),
  },
  infoCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginTop: 0,
    ...(Platform.OS === 'web' ? { padding: 32, marginHorizontal: 100, marginTop: 20 } : {}),
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    ...(Platform.OS === 'web' ? { fontSize: 18 } : {}),
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
    marginBottom: 16,
  },
  infoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 12,
    ...(Platform.OS === 'web' ? { 
      fontSize: 16, 
      backgroundColor: '#fff', 
      borderWidth: 1, 
      borderColor: '#ccc', 
      borderRadius: 12, 
      padding: 14, 
      marginTop: 8, 
      marginBottom: 16,
    } : {}),
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    ...(Platform.OS === 'web' ? { marginBottom: 16 } : {}),
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { 
      width: '100%', 
      alignSelf: 'center', 
      paddingVertical: 16, 
      marginTop: 24 
    } : {}),
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    fontSize: 11,
    color: '#14AE5C',
    textDecorationLine: 'underline',
  },
});