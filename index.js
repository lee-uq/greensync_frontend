/**
 * index.js
 *
 * Entry point for the Expo app.
 * - Registers the root component with the Expo runtime.
 * - Bootstraps the application by linking App component.
 */

// Expo helper: registers a React component as the app entry point
import { registerRootComponent } from 'expo';

// Main application component
import App from './App';

// Register the App component to run as the root component
registerRootComponent(App);
