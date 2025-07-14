# React Native Product Tour

A powerful, customizable React Native library for creating interactive product tours, onboarding experiences, and feature highlights in your mobile applications.

## Features

- ✨ Interactive step-by-step guided tours
- 🔍 Element highlighting with customizable overlays
- 🎯 Beacon indicators for attracting user attention
- 💬 Customizable tooltips with multiple positioning options
- 🎬 Intro and outro modals for tour context
- 📱 Works with Expo Router for seamless navigation
- 💾 Progress persistence with AsyncStorage
- 🧩 Modular components for flexible implementation
- �️ Handles navigation and back button presses during tours
- ⚙️ Highly configurable tour flows

## Installation

```bash
npm install react-native-product-tour
# OR
yarn add react-native-product-tour
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install @react-native-async-storage/async-storage react-native-reanimated react-native-gesture-handler react-native-safe-area-context
# OR
yarn add @react-native-async-storage/async-storage react-native-reanimated react-native-gesture-handler react-native-safe-area-context
```

For Expo projects, you'll also need:

```bash
npx expo install @react-native-async-storage/async-storage react-native-reanimated react-native-gesture-handler react-native-safe-area-context
```

## Component Architecture

React Native Product Tour consists of several interconnected components that work together to create a seamless tour experience:

1. **TourContext** - Core state management system for all tour-related data
2. **TourProvider** - Context provider that wraps your application
3. **HighlightWrapper** - Component that wraps UI elements to highlight during tours
4. **Tooltip** - Displays informational tooltips on highlighted elements
5. **BeaconLight** - Creates attention-grabbing pulsing effect on elements
6. **HighlightOverlay** - Creates a visual overlay that dims non-highlighted areas
7. **IntroExtroModal** - Displays introduction and conclusion modals
8. **NavigationListener** - Handles navigation events during tours
9. **BackButtonBlocker** - Prevents accidental tour exits with back button

## Quick Start

### 1. Wrap your application with TourProvider

```jsx
import { TourProvider } from "react-native-product-tour";
import { tourConfig } from "./config/tourConfig"; // Your tour configuration

export default function App() {
  return (
    <TourProvider
      toursConfig={tourConfig}
      onTourVisited={(tourKey) => console.log(`Tour ${tourKey} visited`)}
      onTourCompleted={(tourKey) => console.log(`Tour ${tourKey} completed`)}
    >
      {/* Your app components */}
    </TourProvider>
  );
}
```

### 2. Create your tour configuration

The tour configuration object defines all aspects of your product tours, including navigation paths, step sequences, and modal content.

```jsx
// tourConfig.ts
export const tourConfig = {
  main: {
    // Screen path mapping for each step (key: step number, value: screen path)
    // These paths should match your application's routing structure
    screenMap: {
      1: "/", // Step 1 shows on the home screen
      2: "/accounts", // Step 2 navigates to accounts screen
      3: "/settings", // Step 3 navigates to settings screen
      // ...add more steps as needed
    },
    // Introduction modal configuration - shown at the start of a tour
    introModal: {
      screen: "/", // Screen where the intro modal should appear
      tourKey: "main", // Must match the tour key (main in this case)
      title: "Welcome to Your App!",
      content: "Let's take a quick tour to show you the main features.",
      buttonText: "Start Tour", // Text for the CTA button
    },
    // Conclusion modal configuration - shown when tour completes
    extroModal: {
      screen: "/", // Screen where the outro modal should appear
      tourKey: "main", // Must match the tour key (main in this case)
      title: "Tour Completed!",
      content: "You're all set to start using the app.",
      buttonText: "Finish", // Text for the CTA button
    },
  },
  // You can define multiple tours for different features or user segments
  featureTwo: {
    screenMap: {
      1: "/feature",
      2: "/feature/details",
      // Each tour can have its own sequence and screens
    },
    introModal: {
      screen: "/feature",
      tourKey: "featureTwo",
      title: "Feature Tour",
      content: "Learn about this specific feature set.",
      buttonText: "Start",
    },
    extroModal: {
      screen: "/feature",
      tourKey: "featureTwo",
      title: "Feature Tour Complete",
      content: "You've learned all about this feature!",
      buttonText: "Done",
    },
  },
};
```

### 3. Wrap UI elements you want to highlight

The `HighlightWrapper` component is the core building block for creating interactive tour elements. It wraps around any React Native component to make it highlightable during tours.

```jsx
import { HighlightWrapper } from "react-native-product-tour";
import { View, Text, ScrollView } from "react-native";
import React, { useRef } from "react";

function MyScreen() {
  // Create a ref for the ScrollView to enable automatic scrolling to elements
  const scrollViewRef = useRef(null);

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={{ padding: 20 }}>
      {/* Other screen content */}

      <HighlightWrapper
        id="feature-1" // Unique identifier for this element (required)
        screen="/my-screen" // Screen path where this element appears (required)
        scroll={0} // Optional vertical scroll offset adjustment
        scrollViewRef={scrollViewRef} // Reference to ScrollView for automatic scrolling
        style={{ marginBottom: 20 }} // Optional styles for the wrapper
        tours={{
          // You can configure this element for multiple tours
          main: {
            // Tour key (must match a key in tourConfig)
            stepNumber: 1, // Step number when this element is highlighted (required)
            tooltip: true, // Whether to show a tooltip (default: false)
            tooltipDirection: "bottom", // Tooltip position (default: "auto")
            tooltipHeading: "Important Feature", // Tooltip title
            tooltipContent: "This feature helps you accomplish X task easily", // Tooltip content
            showBeacon: true, // Whether to show a pulsing beacon (default: false)
          },
          // This same element can be part of another tour at a different step
          secondaryTour: {
            stepNumber: 3,
            tooltip: true,
            tooltipDirection: "right",
            tooltipHeading: "Another Perspective",
            tooltipContent:
              "This feature is also important for other workflows",
          },
        }}
      >
        {/* The actual UI element to highlight */}
        <View
          style={{ padding: 15, backgroundColor: "#f0f0f0", borderRadius: 8 }}
        >
          <Text style={{ fontWeight: "bold" }}>Feature to highlight</Text>
          <Text>This component will be highlighted during the tour</Text>
        </View>
      </HighlightWrapper>

      {/* More screen content */}
    </ScrollView>
  );
}
```

### 4. Use the IntroExtroModal component for tour entry and exit points

The `IntroExtroModal` component provides welcoming and conclusion screens for your tours. These modals offer context about what users will learn and give them clear entry and exit points.

```jsx
import { IntroExtroModal, useTour } from "react-native-product-tour";
import { View, Text } from "react-native";
import { tourConfig } from "../config/tourConfig";

function HomeScreen() {
  // Access tour state and methods from the context
  const {
    isIntroModalVisible, // Whether the intro modal should be visible
    isExtroModalVisible, // Whether the outro modal should be visible
    hideIntroModal, // Function to hide the intro modal
    hideExtroModal, // Function to hide the outro modal
    activeTourKey, // The key of the active tour, if any
  } = useTour();

  // Get modal data for the current screen
  const introModalData = tourConfig.main.introModal;
  const extroModalData = tourConfig.main.extroModal;

  return (
    <View style={{ flex: 1 }}>
      {/* Your main screen content */}
      <Text>Home Screen Content</Text>

      {/* Introduction modal - appears at the beginning of a tour */}
      <IntroExtroModal
        // Only show when intro is visible AND we're on the correct screen
        isVisible={isIntroModalVisible && introModalData.screen === "/"}
        onClose={hideIntroModal}
        mode="intro" // "intro" for start of tour
        showContinueOption={true} // Show option to continue a previously started tour
        modalData={introModalData} // Data from your tourConfig
      />

      {/* Conclusion modal - appears when a tour completes */}
      <IntroExtroModal
        // Only show when extro is visible AND we're on the correct screen
        isVisible={isExtroModalVisible && extroModalData.screen === "/"}
        onClose={hideExtroModal}
        mode="extro" // "extro" for end of tour
        modalData={extroModalData} // Data from your tourConfig
      />
    </View>
  );
}
```

## Core Components

### TourProvider

The `TourProvider` is the central component that manages tour state and provides tour functionality to your entire application through React Context. It should be placed near the root of your application component tree.

#### Props

| Name              | Type                        | Description                                |
| ----------------- | --------------------------- | ------------------------------------------ |
| `toursConfig`     | `object`                    | Configuration for all tours                |
| `onTourVisited`   | `(tourKey: string) => void` | Optional callback when a tour is visited   |
| `onTourCompleted` | `(tourKey: string) => void` | Optional callback when a tour is completed |

#### Implementation Example

```jsx
import React from "react";
import { TourProvider } from "react-native-product-tour";
import { tourConfig } from "./config/tourConfig";

// Analytics tracking example
const trackTourVisit = (tourKey) => {
  console.log(`User visited tour: ${tourKey}`);
  // Analytics.logEvent('tour_visited', { tourKey });
};

const trackTourCompletion = (tourKey) => {
  console.log(`User completed tour: ${tourKey}`);
  // Analytics.logEvent('tour_completed', { tourKey });
};

export default function App() {
  return (
    <TourProvider
      toursConfig={tourConfig}
      onTourVisited={trackTourVisit}
      onTourCompleted={trackTourCompletion}
    >
      {/* Your entire application */}
      <MainNavigator />
    </TourProvider>
  );
}
```

### HighlightWrapper

The `HighlightWrapper` component is used to identify and highlight UI elements during product tours. It measures the position and dimensions of its children and registers them with the tour system for highlighting at the appropriate tour step.

#### Props

| Name            | Type                          | Description                                   |
| --------------- | ----------------------------- | --------------------------------------------- |
| `id`            | `string`                      | Unique identifier for the highlighted element |
| `screen`        | `string`                      | Screen path where the element appears         |
| `scroll`        | `number`                      | Optional offset for scrolling                 |
| `scrollViewRef` | `React.RefObject<ScrollView>` | Reference to ScrollView for auto-scrolling    |
| `style`         | `object`                      | Optional styles for the wrapper               |
| `tours`         | `object`                      | Tour configurations for this element          |

#### Tour Configuration Object

Each key in the `tours` object corresponds to a tour ID defined in your `tourConfig`. The value is an object with these properties:

| Property           | Type                                               | Default    | Description                                      |
| ------------------ | -------------------------------------------------- | ---------- | ------------------------------------------------ |
| `stepNumber`       | `number`                                           | (required) | The step number when this element is highlighted |
| `tooltip`          | `boolean`                                          | `false`    | Whether to show a tooltip on this element        |
| `tooltipDirection` | `"top" \| "bottom" \| "left" \| "right" \| "auto"` | `"auto"`   | Direction where tooltip should appear            |
| `tooltipHeading`   | `string`                                           | `""`       | Title of the tooltip                             |
| `tooltipContent`   | `string`                                           | `""`       | Main content of the tooltip                      |
| `showBeacon`       | `boolean`                                          | `false`    | Whether to show a pulsing beacon on the element  |

#### Detailed Implementation Example

```jsx
import React, { useRef } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { HighlightWrapper } from "react-native-product-tour";

function SettingsScreen() {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      {/* Regular screen content */}
      <Text style={styles.heading}>Settings</Text>

      {/* A highlighted element for step 5 of the main tour */}
      <HighlightWrapper
        id="settings-notifications"
        screen="/settings"
        scrollViewRef={scrollViewRef}
        tours={{
          main: {
            stepNumber: 5,
            tooltip: true,
            tooltipDirection: "bottom",
            tooltipHeading: "Notification Settings",
            tooltipContent:
              "Customize how and when you receive notifications from the app.",
            showBeacon: true,
          },
        }}
      >
        <View style={styles.settingCard}>
          <Text style={styles.settingTitle}>Notifications</Text>
          <Text style={styles.settingDescription}>
            Configure your notification preferences
          </Text>
        </View>
      </HighlightWrapper>

      {/* More settings items... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  settingCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  settingTitle: { fontSize: 18, fontWeight: "500" },
  settingDescription: { fontSize: 14, color: "#666", marginTop: 4 },
});
```

### Tooltip

Displays information about highlighted elements.

#### Props

| Name         | Type                                               | Description           |
| ------------ | -------------------------------------------------- | --------------------- |
| `x`          | `number`                                           | X coordinate          |
| `y`          | `number`                                           | Y coordinate          |
| `width`      | `number`                                           | Width                 |
| `height`     | `number`                                           | Height                |
| `direction`  | `"top" \| "bottom" \| "left" \| "right" \| "auto"` | Tooltip direction     |
| `heading`    | `string`                                           | Tooltip title         |
| `content`    | `string`                                           | Tooltip content       |
| `stepNumber` | `number`                                           | Current step number   |
| `totalSteps` | `number`                                           | Total steps in tour   |
| `onClose`    | `() => void`                                       | Close handler         |
| `onNext`     | `() => void`                                       | Next step handler     |
| `onPrevious` | `() => void`                                       | Previous step handler |

### BeaconLight

The `BeaconLight` component creates a pulsing beacon effect to draw attention to UI elements. It is typically used internally by the tour system, but can also be used directly for custom implementations.

```jsx
import { BeaconLight } from "react-native-product-tour";

function CustomBeaconExample() {
  return (
    <View
      style={{
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BeaconLight
        visible={true}
        size={30}
        color="#FF6B6B"
        pulseColor="rgba(255, 107, 107, 0.2)"
      />
      <Text>New Feature!</Text>
    </View>
  );
}
```

#### Props

| Name         | Type      | Default     | Description                    |
| ------------ | --------- | ----------- | ------------------------------ |
| `visible`    | `boolean` | `false`     | Whether the beacon is visible  |
| `size`       | `number`  | `20`        | Size of the beacon in pixels   |
| `color`      | `string`  | `'#2089dc'` | Color of the beacon center     |
| `pulseColor` | `string`  | (derived)   | Color of the pulsing animation |

### HighlightOverlay

The `HighlightOverlay` component creates a visual overlay that dims the non-highlighted areas of the screen. This component is used internally by the tour system but can be customized through styling.

### IntroExtroModal

The `IntroExtroModal` component displays introduction and conclusion modals for tours, providing users with context about what they're about to learn and confirmation when they've completed a tour.

#### Props

| Name                 | Type                 | Default    | Description                     |
| -------------------- | -------------------- | ---------- | ------------------------------- |
| `isVisible`          | `boolean`            | `false`    | Whether the modal is visible    |
| `onClose`            | `() => void`         | (required) | Close handler                   |
| `mode`               | `"intro" \| "extro"` | `"intro"`  | Modal type                      |
| `showContinueOption` | `boolean`            | `false`    | Whether to show continue option |
| `modalData`          | `object`             | (required) | Modal content data              |

#### modalData Structure

| Property     | Type     | Description                             |
| ------------ | -------- | --------------------------------------- |
| `title`      | `string` | Title displayed at the top of the modal |
| `content`    | `string` | Main descriptive text content           |
| `buttonText` | `string` | Text for the primary action button      |
| `screen`     | `string` | Screen path where this modal applies    |
| `tourKey`    | `string` | The tour key this modal belongs to      |

#### Detailed Implementation Example

```jsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { IntroExtroModal, useTour } from "react-native-product-tour";
import { tourConfig } from "../config/tourConfig";

function HomeScreen() {
  const {
    isIntroModalVisible,
    isExtroModalVisible,
    hideIntroModal,
    hideExtroModal,
    savedStep, // Contains info about previously started tours
  } = useTour();

  // Get the modal data for this screen
  const introModalData = tourConfig.main.introModal;
  const extroModalData = tourConfig.main.extroModal;

  // Check if user has a saved progress in this tour
  const hasSavedProgress = savedStep && savedStep.main > 0;

  return (
    <View style={styles.container}>
      {/* Your regular screen content */}

      {/* Introduction modal */}
      <IntroExtroModal
        isVisible={isIntroModalVisible && introModalData.screen === "/"}
        onClose={hideIntroModal}
        mode="intro"
        showContinueOption={hasSavedProgress} // Only show continue if there's progress
        modalData={introModalData}
      />

      {/* Conclusion modal */}
      <IntroExtroModal
        isVisible={isExtroModalVisible && extroModalData.screen === "/"}
        onClose={hideExtroModal}
        mode="extro"
        modalData={extroModalData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

## Hooks

### useTour

The `useTour` hook provides access to all tour-related functionality and state from anywhere in your application. It's the primary way to interact with the tour system programmatically.

```jsx
import { useTour } from "react-native-product-tour";
import { router } from "expo-router";
import { Button, View, Text } from "react-native";

function TourControlPanel() {
  const {
    // Tour flow control
    startTour, // (navigate, tourKey) => void - Start a tour from the beginning
    continueTour, // (navigate, tourKey) => void - Continue a previously started tour
    nextStep, // (navigate) => void - Go to the next step in the current tour
    prevStep, // (navigate) => void - Go to the previous step in the current tour
    endTour, // () => void - End the current tour

    // Modal visibility and control
    isIntroModalVisible, // boolean - Whether the intro modal is visible
    isExtroModalVisible, // boolean - Whether the extro modal is visible
    hideIntroModal, // () => void - Hide the intro modal
    hideExtroModal, // () => void - Hide the extro modal
    showIntroModal, // () => void - Show the intro modal
    showExtroModal, // () => void - Show the extro modal

    // Tour state information
    currentStep, // number - The current step number in the active tour
    totalSteps, // number - Total number of steps in the active tour
    isTourActive, // boolean - Whether a tour is currently active
    activeTourKey, // string | null - The key of the active tour, or null if no tour is active
    currentScreen, // string - The current screen path

    // Tour persistence
    savedStep, // Record<string, number> | null - Saved progress for each tour
    clearSavedStep, // (tourKey: string) => Promise<void> - Clear saved progress for a tour

    // Navigation utilities
    setCurrentScreen, // (screen: string) => void - Update the current screen path
    resetToRoot, // () => void - Navigate back to the root screen

    // Highlight management
    beaconPosition, // object | null - Position data for the active beacon
    setBeaconPosition, // (position: object | null) => void - Set the beacon position
    currentHighlights, // Highlight[] - Array of highlights for the current step and screen
  } = useTour();

  const handleStartMainTour = () => {
    startTour(router.push, "main");
  };

  const handleStartFeatureTour = () => {
    startTour(router.push, "featureTwo");
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Tour Controls
      </Text>

      <Button title="Start Main Tour" onPress={handleStartMainTour} />
      <Button title="Start Feature Tour" onPress={handleStartFeatureTour} />

      {isTourActive && (
        <View style={{ marginTop: 20 }}>
          <Text>Active Tour: {activeTourKey}</Text>
          <Text>
            Step: {currentStep} of {totalSteps}
          </Text>
          <Button title="End Current Tour" onPress={endTour} />
        </View>
      )}
    </View>
  );
}
```

## Advanced Usage

### Navigation Integration

#### NavigationListener

The `NavigationListener` component helps the tour system keep track of screen changes in your application. It should be included near your navigation components to properly synchronize tour steps with screen navigation.

```jsx
import React from "react";
import { Stack } from "expo-router";
import { NavigationListener } from "react-native-product-tour";

function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="accounts" options={{ title: "Accounts" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>

      {/* Add NavigationListener to sync screen changes with the tour system */}
      <NavigationListener />
    </>
  );
}

export default RootLayout;
```

#### Back Button Handling

The `BackButtonBlocker` component prevents users from accidentally exiting tours by pressing the device back button. This is essential for maintaining a smooth tour experience, especially on Android devices.

```jsx
import React from "react";
import { View } from "react-native";
import { TourProvider } from "react-native-product-tour";
import { BackButtonBlocker } from "react-native-product-tour";
import { tourConfig } from "./config/tourConfig";
import MainNavigator from "./navigation/MainNavigator";

function App() {
  return (
    <TourProvider toursConfig={tourConfig}>
      <View style={{ flex: 1 }}>
        <MainNavigator />

        {/* Prevent accidental tour exits with back button */}
        <BackButtonBlocker />
      </View>
    </TourProvider>
  );
}

export default App;
```

#### Custom Navigation Implementation

For more complex navigation scenarios, you can directly access the navigation utilities provided by the tour context:

```jsx
import React from "react";
import { Button } from "react-native";
import { useTour } from "react-native-product-tour";
import { useNavigation } from "@react-navigation/native";

function CustomTourButton() {
  const { startTour, activeTourKey } = useTour();
  const navigation = useNavigation();

  const handleStartTour = () => {
    // Use your own navigation method instead of router.push
    startTour((screenName) => {
      navigation.navigate(screenName);
    }, "main");
  };

  return (
    <Button
      title="Start Guided Tour"
      onPress={handleStartTour}
      disabled={!!activeTourKey} // Disable if a tour is already active
    />
  );
}
```

### Multiple Tours and User Segmentation

One of the powerful features of this library is the ability to create multiple distinct tours for different purposes. This allows you to create specialized guided experiences for different user segments, features, or workflows.

#### Tour Configuration for Multiple User Journeys

```jsx
// tourConfig.ts
export const tourConfig = {
  // Main onboarding tour for new users
  mainTour: {
    screenMap: {
      1: "/",
      2: "/dashboard",
      3: "/accounts",
      4: "/settings",
    },
    introModal: {
      screen: "/",
      tourKey: "mainTour",
      title: "Welcome to the App!",
      content: "Let's take a quick tour to show you the key features.",
      buttonText: "Start Tour",
    },
    extroModal: {
      screen: "/settings",
      tourKey: "mainTour",
      title: "You're All Set!",
      content: "You now know the basics. Enjoy using the app!",
      buttonText: "Finish",
    },
  },

  // Advanced feature tour for power users
  advancedFeatures: {
    screenMap: {
      1: "/advanced/dashboard",
      2: "/advanced/analytics",
      3: "/advanced/settings",
    },
    introModal: {
      screen: "/advanced/dashboard",
      tourKey: "advancedFeatures",
      title: "Advanced Features Tour",
      content: "Discover powerful tools for data analysis and automation.",
      buttonText: "Explore",
    },
    extroModal: {
      screen: "/advanced/settings",
      tourKey: "advancedFeatures",
      title: "Advanced Tour Complete",
      content: "You've mastered the advanced features!",
      buttonText: "Done",
    },
  },

  // Feature-specific mini-tour
  reportingFeature: {
    screenMap: {
      1: "/reports",
      2: "/reports/create",
    },
    introModal: {
      screen: "/reports",
      tourKey: "reportingFeature",
      title: "Reporting Tools",
      content: "Learn how to create and share customized reports.",
      buttonText: "Learn More",
    },
    extroModal: {
      screen: "/reports/create",
      tourKey: "reportingFeature",
      title: "Reporting Basics Complete",
      content: "You now know how to create basic reports!",
      buttonText: "Got It",
    },
  },
};
```

### Conditional Tour Triggering

The library provides flexible ways to trigger tours based on various conditions. Below are several examples of common patterns for starting tours in response to different user scenarios.

#### First-Time User Experience

Automatically show a tour to new users on their first visit:

```jsx
import React, { useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTour } from "react-native-product-tour";
import { router } from "expo-router";

function HomeScreen() {
  const { startTour } = useTour();

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const isFirstVisit = await AsyncStorage.getItem("firstVisit");

        if (isFirstVisit === null) {
          // User has never visited before
          // Start the main onboarding tour
          startTour(router.push, "mainTour");

          // Record that the user has visited
          await AsyncStorage.setItem("firstVisit", "false");
        }
      } catch (error) {
        console.error("Error checking first visit status:", error);
      }
    };

    checkFirstVisit();
  }, []);

  return <View>{/* Screen content */}</View>;
}
```

#### Manual Tour Triggers

Provide buttons or menu items that allow users to start tours on demand:

```jsx
function SettingsScreen() {
  const { startTour } = useTour();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <TouchableOpacity
        style={styles.helpItem}
        onPress={() => startTour(navigation.navigate, "mainTour")}
      >
        <Text style={styles.helpItemTitle}>App Overview Tour</Text>
        <Text style={styles.helpItemDesc}>
          Take a quick tour of the main app features
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.helpItem}
        onPress={() => startTour(navigation.navigate, "advancedFeatures")}
      >
        <Text style={styles.helpItemTitle}>Advanced Features</Text>
        <Text style={styles.helpItemDesc}>
          Learn about our power-user tools
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.helpItem}
        onPress={() => startTour(navigation.navigate, "reportingFeature")}
      >
        <Text style={styles.helpItemTitle}>Reporting Tutorial</Text>
        <Text style={styles.helpItemDesc}>Create and customize reports</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## API Reference

### TourContext Methods

These methods are available through the `useTour()` hook.

| Method              | Signature                                                 | Description                                                      |
| ------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `startTour`         | `(navigate: NavigationFunction, tourKey: string) => void` | Starts a new tour from step 1, navigating to the first screen    |
| `continueTour`      | `(navigate: NavigationFunction, tourKey: string) => void` | Continues a previously started tour from where the user left off |
| `nextStep`          | `(navigate: NavigationFunction) => void`                  | Advances to the next step in the active tour                     |
| `prevStep`          | `(navigate: NavigationFunction) => void`                  | Returns to the previous step in the active tour                  |
| `endTour`           | `() => void`                                              | Ends the current tour, showing the extro modal if appropriate    |
| `clearSavedStep`    | `(tourKey: string) => Promise<void>`                      | Clears saved progress for a specific tour                        |
| `registerHighlight` | `(highlight: Highlight, tours: TourConfig[]) => void`     | Registers a UI element to be highlighted during tours            |
| `setBeaconPosition` | `(position: BeaconPosition \| null) => void`              | Sets the position for the beacon effect                          |
| `setCurrentScreen`  | `(screen: string) => void`                                | Sets the current screen path for tour synchronization            |
| `showIntroModal`    | `() => void`                                              | Shows the intro modal for the active tour                        |
| `hideIntroModal`    | `() => void`                                              | Hides the intro modal for the active tour                        |
| `showExtroModal`    | `() => void`                                              | Shows the extro modal for the active tour                        |
| `hideExtroModal`    | `() => void`                                              | Hides the extro modal for the active tour                        |
| `setIsTourActive`   | `(isActive: boolean) => void`                             | Sets whether a tour is currently active                          |
| `setActiveTourKey`  | `(tourKey: string \| null) => void`                       | Sets the active tour key or null to deactivate                   |
| `getSavedStep`      | `() => Promise<void>`                                     | Retrieves saved tour progress from AsyncStorage                  |
| `resetToRoot`       | `() => void`                                              | Navigates back to the application's root screen                  |

### TourContext Properties

These properties are available through the `useTour()` hook.

| Property              | Type                             | Description                                              |
| --------------------- | -------------------------------- | -------------------------------------------------------- |
| `highlights`          | `Highlight[]`                    | All registered highlight elements                        |
| `currentStep`         | `number`                         | The current step number in the active tour               |
| `totalSteps`          | `number`                         | Total number of steps in the active tour                 |
| `isTourActive`        | `boolean`                        | Whether a tour is currently active                       |
| `currentHighlights`   | `Highlight[]`                    | Highlights for the current step and screen               |
| `isIntroModalVisible` | `boolean`                        | Whether the intro modal is visible                       |
| `isExtroModalVisible` | `boolean`                        | Whether the extro modal is visible                       |
| `currentScreen`       | `string`                         | The current screen path                                  |
| `savedStep`           | `Record<string, number> \| null` | Saved progress for each tour                             |
| `activeTourKey`       | `string \| null`                 | The key of the active tour, or null if no tour is active |
| `beaconPosition`      | `BeaconPosition \| null`         | Position data for the active beacon                      |

### Type Definitions

```typescript
// Core types used throughout the library

// Highlight definition
type Highlight = {
  id: string; // Unique identifier for this highlight
  x: number; // X coordinate
  y: number; // Y coordinate
  width: number; // Width of highlighted element
  height: number; // Height of highlighted element
  screen: string; // Screen path where this element appears
  tours: {
    // Tour configurations for this highlight
    [tourKey: string]: {
      stepNumber: number;
      showBeacon?: boolean;
      tooltip?: boolean;
      tooltipDirection?: "top" | "bottom" | "left" | "right" | "auto";
      tooltipContent?: {
        heading: string;
        content: string;
      };
    };
  };
};

// Navigation function type (compatible with router.push, router.replace, etc.)
type NavigationFunction = (screen: string) => void;

// Tour configuration structure
interface TourConfig {
  screenMap: { [stepNumber: number]: string };
  introModal?: {
    title: string;
    content: string;
    buttonText: string;
    screen: string;
    tourKey: string;
  };
  extroModal?: {
    title: string;
    content: string;
    buttonText: string;
    screen: string;
    tourKey: string;
  };
}

// Beacon position type
type BeaconPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

## Styling and Customization

The React Native Product Tour library offers extensive styling customization options to match your application's design language.

### Style Files Structure

The library's styles are organized in the `/src/assets/styles/` directory:

- `tooltip.styles.ts` - Styles for tooltips
- `intro.modal.styles.ts` - Styles for intro and extro modals

### Customizing Colors

You can modify the colors used throughout the tour system by updating the constants in `/src/constants/colors.ts`:

```typescript
// Example of customizing colors
import { COLORS } from "react-native-product-tour/src/constants/colors";

// Override default colors
COLORS.PRIMARY = "#6200EE"; // Main accent color
COLORS.SECONDARY = "#03DAC5"; // Secondary accent color
COLORS.BACKDROP = "rgba(0, 0, 0, 0.7)"; // Overlay background
COLORS.TEXT_PRIMARY = "#FFFFFF"; // Primary text color
COLORS.TEXT_SECONDARY = "#CCCCCC"; // Secondary text color
COLORS.BEACON = "#FF4081"; // Beacon highlight color
```

### Custom Tooltip Styling

You can create your own tooltip styling by creating a custom component that leverages the tour context:

```jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTour } from "react-native-product-tour";
import { router } from "expo-router";

function CustomTooltip() {
  const {
    currentHighlights,
    nextStep,
    prevStep,
    endTour,
    currentStep,
    totalSteps,
  } = useTour();

  // If no highlights on this step, don't render anything
  if (!currentHighlights || currentHighlights.length === 0) return null;

  // Get the first highlight for this step
  const highlight = currentHighlights[0];
  const tourKey = Object.keys(highlight.tours)[0];
  const tourConfig = highlight.tours[tourKey];

  // Get tooltip content
  const heading = tourConfig.tooltipContent?.heading || "";
  const content = tourConfig.tooltipContent?.content || "";

  return (
    <View style={styles.tooltipContainer}>
      <View style={styles.tooltip}>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.content}>{content}</Text>

        <View style={styles.controls}>
          <Text style={styles.stepCounter}>
            Step {currentStep} of {totalSteps}
          </Text>

          <View style={styles.buttons}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => prevStep(router.push)}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => {
                if (currentStep < totalSteps) {
                  nextStep(router.push);
                } else {
                  endTour();
                }
              }}
            >
              <Text style={styles.buttonTextPrimary}>
                {currentStep < totalSteps ? "Next" : "Finish"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 1000,
  },
  tooltip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    pointerEvents: "auto",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
  },
  content: {
    fontSize: 14,
    marginBottom: 16,
    color: "#666666",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepCounter: {
    fontSize: 12,
    color: "#999999",
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonPrimary: {
    backgroundColor: "#6200EE",
  },
  buttonText: {
    fontSize: 14,
    color: "#6200EE",
  },
  buttonTextPrimary: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default CustomTooltip;
```

### Custom Modal Styling

Similarly, you can create custom introduction and conclusion modals:

```jsx
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTour } from "react-native-product-tour";
import { router } from "expo-router";

function CustomIntroModal() {
  const { isIntroModalVisible, hideIntroModal, startTour, activeTourKey } =
    useTour();

  if (!isIntroModalVisible || !activeTourKey) return null;

  return (
    <Modal
      transparent={true}
      visible={isIntroModalVisible}
      animationType="fade"
      onRequestClose={hideIntroModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={require("./assets/welcome.png")}
            style={styles.welcomeImage}
          />

          <Text style={styles.title}>Welcome to Our App!</Text>
          <Text style={styles.description}>
            Let's take a quick tour to help you discover all the amazing
            features we offer. You'll be up and running in no time!
          </Text>

          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              hideIntroModal();
              startTour(router.push, activeTourKey);
            }}
          >
            <Text style={styles.startButtonText}>Start Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={hideIntroModal}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  welcomeImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    color: "#6200EE",
    fontSize: 14,
  },
});
```

## Troubleshooting

### Common Issues

#### Tour Navigation Issues

- **Tour not showing on correct screen**:
  - Ensure screen paths in `tourConfig.screenMap` exactly match your navigation paths
  - Verify that the `NavigationListener` component is included in your application
  - Check that the `screen` prop in `HighlightWrapper` matches the current screen path
- **Tour starts but doesn't progress to the next screen**:
  - Make sure your navigation function is working correctly
  - Verify that the screen path exists in your application's navigation structure
  - Check for any navigation guards or authentication requirements that might block navigation

#### Highlight and Tooltip Issues

- **Tooltips positioned incorrectly**:
  - Make sure to provide accurate dimensions to `HighlightWrapper`
  - If using scrollable containers, ensure the `scrollViewRef` is properly connected
  - Try using different tooltip directions (top, bottom, left, right) if available space is limited
- **Elements not highlighted**:

  - Check that the screen path and step number match your configuration
  - Ensure the highlighted element is rendered and visible on screen
  - Verify that the tour key in `HighlightWrapper` matches your tour configuration

- **Beacon not visible or misplaced**:
  - Check if `showBeacon` is set to `true` in your tour configuration
  - Ensure the element has positive dimensions (width > 0, height > 0)
  - If the element is inside a ScrollView, ensure proper scroll offset handling

#### Persistence Issues

- **Tour progress not being saved**:

  - Check that `@react-native-async-storage/async-storage` is properly installed and linked
  - Verify that your app has storage permissions
  - Look for any AsyncStorage errors in your console logs

- **Cannot resume a previously started tour**:
  - Make sure you're using the same tour key when calling `continueTour`
  - Check if the saved step is valid (within the range of available steps)
  - Verify that the tour wasn't explicitly cleared with `clearSavedStep`

#### Performance Issues

- **Lag or stuttering during tour transitions**:

  - Reduce the complexity of the highlighted UI elements
  - Use `InteractionManager` for heavy operations after transitions
  - Ensure you're not measuring or highlighting too many elements simultaneously

- **High memory usage**:
  - Limit the number of registered highlights
  - Unregister unused highlights when components unmount

#### Integration with Navigation Libraries

- **Issues with React Navigation**:

  - Ensure you're passing the correct navigation function (`navigation.navigate`)
  - Set up listeners to sync screen changes with the tour system

- **Issues with Expo Router**:
  - Make sure you're using the correct path format (`/path` vs `path`)
  - Use `router.push` or `router.replace` consistently

### Debugging Tips

1. **Enable console logging** to track tour progression:

   ```jsx
   // Add this to your App.js
   if (__DEV__) {
     const originalUseTour = useTour;
     useTour = () => {
       const tour = originalUseTour();
       console.log("Tour state:", {
         active: tour.isTourActive,
         tourKey: tour.activeTourKey,
         step: tour.currentStep,
         screen: tour.currentScreen,
       });
       return tour;
     };
   }
   ```

2. **Visualize highlight boundaries** during development:

   ```jsx
   // Modify HighlightWrapper to show boundaries
   <HighlightWrapper
     {...props}
     style={
       __DEV__
         ? { borderWidth: 2, borderColor: "red", ...props.style }
         : props.style
     }
   >
     {props.children}
   </HighlightWrapper>
   ```

3. **Check highlight measurements** to verify positioning:
   ```jsx
   // Add this to a problematic HighlightWrapper
   useEffect(() => {
     if (targetRef.current) {
       targetRef.current.measure((x, y, width, height, pageX, pageY) => {
         console.log("Highlight measurements:", {
           x,
           y,
           width,
           height,
           pageX,
           pageY,
         });
       });
     }
   }, []);
   ```

## License

ISC
