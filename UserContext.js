/**
 * UserContext.js
 *
 * Defines a React context for sharing user data across the app.
 * - Provides `username` state and a `setUsername` function.
 * - Wraps app components with `UserProvider` to supply context values.
 */

// Core React import and hooks for context and state management
import React, { createContext, useState } from 'react';

// Create UserContext for holding and sharing user information
export const UserContext = createContext();

/**
 * UserProvider component
 *
 * Wraps child components and supplies user context values:
 * - `username`: current user's name
 * - `setUsername`: function to update the username
 *
 * Props:
 * - children: nested components that can consume this context
 */
export const UserProvider = ({ children }) => {
  // Initialize `username` state; default is null until user signs in
  const [username, setUsername] = useState(null);

  // Provide `username` and `setUsername` to the context consumers
  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {/* Render nested components with access to UserContext */}
      {children}
    </UserContext.Provider>
  );
};