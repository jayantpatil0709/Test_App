## Usage Guide

Follow these steps to seamlessly integrate **React Native Product Tour** into your app and create engaging, multi-step onboarding experiences.


##  1. Wrap Your App with `TourProvider`

At the root of your app, wrap your component tree with `TourProvider`. This enables global tour state and ensures all screens can participate in tours.

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

> **Tip:** Place a `HighlightOverlay` inside `TourProvider` (typically near your navigator) to ensure highlights and tooltips render above your UI.


## 2. Define Your Tour Configuration (`tourConfig`)

Your `tourConfig` object specifies:
- Which screens each step appears on,
- The content for intro and extro modals,
- The tours available in your app.

### 📌 If Using **Expo Router**:
Use URL-like route paths as screen identifiers (e.g., `/`, `/accounts`, `/settings`).

### 📌 If Using **Bare React Native**:
Use screen names as registered in your navigators (e.g., `"Home"`, `"Accounts"`, `"Settings"`).

**Example for Expo:**

```js
// tourConfig.ts
export const tourConfig = {
    main: {
        screenMap: {
            1: "/",              // Step 1: Home screen
            2: "/accounts",      // Step 2: Accounts screen
            3: "/settings",      // Step 3: Settings screen
        },
        introModal: {
            screen: "/",
            tourKey: "main",
            title: "Welcome to Your App!",
            content: "Let's take a quick tour to show you the main features.",
            buttonText: "Start Tour",
        },
        extroModal: {
            screen: "/",
            tourKey: "main",
            title: "Tour Completed!",
            content: "You're all set to start using the app.",
            buttonText: "Finish",
        },
    },
    featureTwo: {
        screenMap: {
            1: "/feature",
            2: "/feature/details",
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

> **Best Practice:** Ensure `tourKey` in your modals matches the key in `tourConfig` exactly.


## 3. Highlight UI Elements with `HighlightWrapper`

Wrap any React Native element with `HighlightWrapper` to make it a tour step. Provide:
- A unique `id`,
- The `screen` where it appears,
- A `tours` object for step configuration.

**Example:**

```jsx
import { HighlightWrapper } from "react-native-product-tour";
import { View, Text, ScrollView } from "react-native";
import React, { useRef } from "react";

function MyScreen() {
    const scrollViewRef = useRef(null);

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={{ padding: 20 }}>
            {/* Other content */}

            <HighlightWrapper
                id="feature-1"
                screen="/my-screen"
                scroll={0}
                scrollViewRef={scrollViewRef}
                style={{ marginBottom: 20 }}
                tours={{
                    main: {
                        stepNumber: 1,
                        tooltip: true,
                        tooltipDirection: "bottom",
                        tooltipHeading: "Important Feature",
                        tooltipContent: "This feature helps you accomplish X task easily.",
                        showBeacon: true,
                    },
                    secondaryTour: {
                        stepNumber: 3,
                        tooltip: true,
                        tooltipDirection: "right",
                        tooltipHeading: "Another Perspective",
                        tooltipContent: "This feature is also important for other workflows.",
                    },
                }}
            >
                <View style={{ padding: 15, backgroundColor: "#f0f0f0", borderRadius: 8 }}>
                    <Text style={{ fontWeight: "bold" }}>Feature to highlight</Text>
                    <Text>This component will be highlighted during the tour</Text>
                </View>
            </HighlightWrapper>

            {/* More content */}
        </ScrollView>
    );
}
```

> `HighlightWrapper` supports multiple tours and step numbers for the same element.


## 4. Display Intro/Extro Modals with `IntroExtroModal`

Use `IntroExtroModal` to show intro and extro modals as defined in your `tourConfig`. These modals introduce or conclude a tour and help users navigate the experience.

```jsx
import { IntroExtroModal, useTour } from "react-native-product-tour";
import { View, Text } from "react-native";
import { tourConfig } from "../config/tourConfig";

function HomeScreen() {
    const {
        isIntroModalVisible,
        isExtroModalVisible,
        hideIntroModal,
        hideExtroModal,
        activeTourKey,
    } = useTour();

    const introModalData = tourConfig[activeTourKey]?.introModal;
    const extroModalData = tourConfig[activeTourKey]?.extroModal;

    return (
        <View style={{ flex: 1 }}>
            <Text>Home Screen Content</Text>

            <IntroExtroModal
                isVisible={isIntroModalVisible && introModalData?.screen === "/"}
                onClose={hideIntroModal}
                mode="intro"
                showContinueOption={true}
                modalData={introModalData}
            />

            <IntroExtroModal
                isVisible={isExtroModalVisible && extroModalData?.screen === "/"}
                onClose={hideExtroModal}
                mode="extro"
                modalData={extroModalData}
            />
        </View>
    );
}
```

> `showContinueOption` lets users resume incomplete tours.


## 5. Add Navigation Support Components

To ensure smooth navigation during tours, include these **inside `TourProvider`**:
- **NavigationListener**: Syncs tour steps with navigation changes.
- **BackButtonBlocker**: Prevents accidental exits during tours.
- **HighlightOverlay**: Renders highlights and dims the background.


## 6. Configure Navigation Reset with `configureLibraryNavigationRoot()`

If your app uses nested navigation, call `configureLibraryNavigationRoot()` in your root component. This ensures the library can reset navigation stacks correctly after a tour.

```jsx
import { configureLibraryNavigationRoot, navigationRef } from "react-native-product-tour";
import { useNavigationContainerRef } from "expo-router";

const navRef = useNavigationContainerRef();

useEffect(() => {
    navigationRef.current = navRef.current;
    configureLibraryNavigationRoot({
        index: 0,
        routes: [
            {
                name: "(drawer)",
                state: {
                    index: 0,
                    routes: [
                        {
                            name: "(tabs)",
                            state: {
                                index: 0,
                                routes: [{ name: "index" }],
                            },
                        },
                    ],
                },
            },
        ],
    });
}, [navRef]);
```

> **Why?** This guarantees users land on a valid screen after a tour, preventing broken navigation.


## Summary

You’re ready to build immersive product tours:
- Global context with `TourProvider`
- Highlighted steps via `HighlightWrapper`
- Seamless modals with `IntroExtroModal`
- Automatic overlays and navigation support
- Robust navigation reset for nested navigators

---

**Next:** Explore the [Component API](./api/index.md) for detailed usage of each component.