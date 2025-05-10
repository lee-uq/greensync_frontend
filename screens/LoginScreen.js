/**
 * LoginScreen
 *
 * Handles user login process for GreenSync app.
 * - User enters username and password.
 * - Validates input fields.
 * - On successful login, navigates to the Dashboard screen.
 * - Offers "Remember for 30 days" checkbox.
 * - Displays footer for web users.
 */

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import WebFooter from '../components/WebFooter';

// === COMPONENT: CustomCheckBox ===
// Custom-designed checkbox for remembering login.
// Custom checkbox
const CustomCheckBox = ({ value, onValueChange }) => (
  <Pressable
    onPress={() => onValueChange(!value)}
    style={{
      height: 20,
      width: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#999',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {value ? (
      <View
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#2e7d32',
        }}
      />
    ) : null}
  </Pressable>
);

// === SCREEN: LoginScreen ===
// Main login form with username/password input and navigation to Dashboard.
export default function LoginScreen() {
  // Form state: username, password, and “remember me” checkbox
  const [username, setUsernameState] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation();
  const { setUsername } = useContext(UserContext);

  // Unified alert: use browser alert on web; React Native Alert on mobile
  const alert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(message ? `${title}\n${message}` : title);
    } else {
      Alert.alert(title, message);
    }
  };

  /**
   * handleLogin()
   *
   * 1. Validate that username and password are non-empty.
   * 2. On success, set username in context and reset navigation to Dashboard.
   */
  const handleLogin = () => {
    if (!username || !password) {
      alert(
        'Login Error',
        'Please fill out both Username and Password fields before logging in.'
      );
      return;
    }

    setUsername(username);
    console.log('Navigating to Dashboard with username:', username);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard', params: { username } }],
    });
  };

  // === RENDER: Login UI ===
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContent}>
          {/* Title and subtitle */}
          <Text style={styles.heading}>Welcome to GreenSync</Text>
          <Text style={styles.subheading}>Grow smarter, not harder</Text>

          <View style={styles.formWrapper}>
            {/* Username input */}
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter your username"
              style={styles.input}
              value={username}
              onChangeText={setUsernameState}
              autoCapitalize="none"
            />

            {/* Password label and "forgot" password */}
            <View style={styles.passwordRow}>
              <Text style={styles.label}>Password</Text>
              <Text style={styles.link}>forgot password</Text>
            </View>

            {/* Password input */}
            <TextInput
              placeholder="Enter your password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Remember checkbox */}
            <View style={styles.checkboxContainer}>
              <CustomCheckBox value={remember} onValueChange={setRemember} />
              <Text style={styles.terms}> Remember for 30 days</Text>
            </View>

            {/* Login button */}
            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            {/* Sign Up link */}
            <View style={styles.signupFooter}>
              <Text>Don’t have an account? </Text>
              <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
                Sign Up
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Render WebFooter component only for web platform */}
      {Platform.OS === 'web' && <WebFooter />}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  // ── Layout Containers ───────────────────────────
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 100 : 24,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: Platform.OS === 'web' ? 'center' : 'flex-start',
    width: '100%',
  },
  // ── Form Elements ───────────────────────────────
  formWrapper: {
    width: Platform.OS === 'web' ? 400 : '100%',
  },
  heading: {
    fontSize: Platform.OS === 'web' ? 42 : 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  subheading: {
    marginBottom: 24,
    color: '#333',
    fontSize: Platform.OS === 'web' ? 22 : 16,
    textAlign: Platform.OS === 'web' ? 'center' : 'left',
  },
  label: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    width: Platform.OS === 'web' ? 400 : '100%',
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  terms: {
    marginLeft: 8,
  },
  link: {
    color: '#14AE5C',
    textDecorationLine: 'underline',
  },
  // ── Button Styles ───────────────────────────────
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  signupFooter: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
