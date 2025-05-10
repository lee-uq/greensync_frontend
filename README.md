# Project Title: GreenSync – AI-Optimized Smart Hydroponic System

GreenSync is a cross-platform mobile and web application for managing a smart hydroponic system, built with React Native and Expo. It provides AI-driven growth insights, real-time sensor monitoring, and intuitive slot management for hydroponic setups.

## Overview
GreenSync simplifies hydroponic gardening by offering:
- **AI Insights**: Predict growth trends and optimize environmental parameters.
- **Real-time Monitoring**: Track temperature, pH, EC, light, humidity, and water levels.
- **Cross-Platform**: Available on iOS, Android, and the Web.
- **Slot Management**: Manage multiple plant slots with personalized care guides.

## Prerequisites
- Node.js (>= v14) and npm or Yarn installed.
- Expo CLI globally installed:
  ```bash
  npm install -g expo-cli
  ```
- Git for version control.

## Folder Structure
```plaintext
greensync/
├── App.js
├── AppEntry.js
├── index.js
├── package.json
├── README.md
├── UserContext.js
├── assets/
├── components/
│   ├── TopNavbar.js
│   ├── WebNavbar.js
│   └── WebFooter.js
├── screens/
│   ├── IconScreen.js
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── DashboardTabs.js
│   ├── DashboardScreen.js
│   ├── LettuceDetailScreen.js
│   ├── ProfileScreen.js
│   └── InsightsScreen.js
└── ...
```

## Getting Started

### Running on Mobile
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the project:
   ```bash
   npm start
   ```
3. Scan the QR code with Expo Go (iOS/Android).

### Running on Web
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the project:
   ```bash
   npm start
   ```
3. Press `w` in the terminal to open the web app.

## Libraries / External Software Used
- React Native
- Expo
- React Navigation
- React Native Web
- Victory Native (for charts and graph visualizations)
- Expo Vector Icons (Ionicons)

## Data Dependencies
- Lettuce images stored in `/assets` folder.

## Environment Variables
If you integrate external APIs or need to hide keys, create a `.env` file in the project root:
```dotenv
API_KEY=your_api_key_here
```

## Testing & Linting
- **Tests**: Run `npm test` (if tests are configured).
- **Linting**: Run `npm run lint` to check and fix code style issues.
