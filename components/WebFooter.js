/**
 * WebFooter
 *
 * Footer component for the web platform.
 * - Only displayed on web (hidden on native).
 * - Shows copyright notice.
 */

// Core React import
import React from 'react';
// React Native UI components and platform utility
import { View, Text, StyleSheet, Platform } from 'react-native';

/**
 * WebFooter component
 *
 * Renders a simple footer with copyright information.
 * Only visible when running on web platforms.
 */
export default function WebFooter() {
  // Prevent rendering on non-web platforms
  if (Platform.OS !== 'web') return null; // Only show on web

  return (
    <>
      {/* Footer container: full width, centered text */}
      <View style={styles.footer}>
        {/* Copyright text */}
        <Text style={styles.footerText}>© 2025 GreenSync</Text>
      </View>
    </>
  );
}

// ── Styles: footer layout and typography ──
const styles = StyleSheet.create({
  footer: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});