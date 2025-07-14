# React Native Two-Screen App

A simple React Native app with two screens, each containing three dummy components. The app uses React Navigation for code-based navigation between screens.

## Features

- Two screens with distinct UI components
- Code-based navigation using React Navigation
- Navigation buttons to move between screens
- Six dummy components with different styles and colors

## Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm start
   ```

## Navigation Structure

The app uses a simple stack navigator with two screens:

- FirstScreen: Contains Component1, Component2, and Component3
- SecondScreen: Contains Component4, Component5, and Component6

Navigation between screens is handled by buttons on each screen.

## Project Structure

```
src/
  ├── components/
  │   ├── FirstScreenComponents.tsx
  │   └── SecondScreenComponents.tsx
  ├── navigation/
  │   └── AppNavigator.tsx
  └── screens/
      ├── FirstScreen.tsx
      └── SecondScreen.tsx
```

## Technologies Used

- React Native
- React Navigation
- TypeScript

## How to Use

1. Launch the app to see the First Screen with its three components
2. Tap the "Go to Second Screen" button to navigate to the Second Screen
3. On the Second Screen, tap the "Back to First Screen" button to return

This app demonstrates simple code-based navigation using React Navigation's Stack Navigator.
