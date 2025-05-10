/**
 * AppEntry
 *
 * Entry point for the Expo application.
 * - Registers the main App component as the root component.
 * - Integrates the app with the Expo runtime.
 */

// Expo helper: registers a React component as the root of the app
import { registerRootComponent } from 'expo';

// Main App component of the application
import App from './App';

// Register the App component as the root component for Expo runtime
registerRootComponent(App);
