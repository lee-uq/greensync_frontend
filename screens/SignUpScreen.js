/**
 * SignUpScreen
 *
 * Entry screen for GreenSync registration.
 * - User enters username, email, and password.
 * - Validates:
 *    1) non-empty fields,
 *    2) email format,
 *    3) terms agreement.
 * - On success:
 *    • Web: window.alert ➔ navigate to Dashboard,
 *    • Native: update UserContext, Alert.alert ➔ navigate.
 * - Renders WebFooter on web platform.
 */

import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WebFooter from '../components/WebFooter';

// === COMPONENT: CustomCheckBox ===
// Custom-designed checkbox for agreeing to terms and policy.
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

// === SCREEN: SignUpScreen ===
// Main sign-up form with validation and navigation to Dashboard.
export default function SignUpScreen() {
  // ── Form state: username, email, password, and terms agreement toggle
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const navigation = useNavigation();
  const { setUsername: setContextUsername } = useContext(UserContext);

  /**
   * handleSignUp()
   *
   * 1. Ensure username, email, and password are provided.
   * 2. Check email matches regex.
   * 3. Confirm terms checkbox is checked.
   * 4. If valid:
   *    - On web: show window.alert then navigate.
   *    - On native: set UserContext, show Alert.alert then navigate.
   */
  const handleSignUp = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || !email || !password) { // 1) Empty-fields check — prevent accidental blank sign-ups
      if (Platform.OS === 'web') {
        window.alert('Missing Info: Please fill out all fields.');
      } else {
        Alert.alert('Missing Info', 'Please fill out all fields.');
      }
      return;
    }
    if (!emailRegex.test(email)) { // 2) Email format check — catch typos before submission
      if (Platform.OS === 'web') {
        window.alert('Invalid Email: Please enter a valid email address.');
      } else {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      }
      return;
    }
    if (!agree) { // 3) Terms agreement — legal requirement
      if (Platform.OS === 'web') {
        window.alert('Terms Required: You must agree to the terms & policy.');
      } else {
        Alert.alert('Terms Required', 'You must agree to the terms & policy.');
      }
      return;
    }

    // Platform-specific alerts: browser vs. native
    if (Platform.OS === 'web') {
      window.alert('You have successfully signed up!');
      navigation.navigate('Dashboard', { username });
    } else {
      setContextUsername(username);
      Alert.alert('Signed Up', 'You have successfully signed up!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Dashboard', { username }),
        },
      ]);
    }
  };

  // === RENDER: Sign-Up UI ===
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {Platform.OS === 'web' ? (
          <View style={styles.scrollContent}>
            <View style={styles.mainContent}>
              <Text style={styles.heading}>Create Your Account</Text>
              <Text style={styles.subheading}>Grow smarter, not harder</Text>

              <View style={styles.formWrapper}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  placeholder="Choose a username"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Email address</Text>
                <TextInput
                  placeholder="Enter your email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <View style={styles.checkboxContainer}>
                  <CustomCheckBox value={agree} onValueChange={setAgree} />
                  <Text style={styles.terms}> I agree to the terms & policy</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp} activeOpacity={0.8}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>

                <View style={styles.signupFooter}>
                  <Text>Already have an account? </Text>
                  <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                    Sign In
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.mainContent}>
              <Text style={styles.heading}>Create Your Account</Text>
              <Text style={styles.subheading}>Grow smarter, not harder</Text>

              <View style={styles.formWrapper}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  placeholder="Choose a username"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Email address</Text>
                <TextInput
                  placeholder="Enter your email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                <View style={styles.checkboxContainer}>
                  <CustomCheckBox value={agree} onValueChange={setAgree} />
                  <Text style={styles.terms}> I agree to the terms & policy</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignUp} activeOpacity={0.8}>
                  <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>

                <View style={styles.signupFooter}>
                  <Text>Already have an account? </Text>
                  <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                    Sign In
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        {/* Render WebFooter component only for web platform */}
        {Platform.OS === 'web' && <WebFooter />}
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles: SignUpScreen layout and UI elements ─────────────────
const styles = StyleSheet.create({
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
