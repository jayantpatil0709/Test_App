### Navigation Integration

Integrating the product tour system with your app’s navigation ensures a seamless user experience. This section covers how to synchronize tour steps with navigation events and handle back button behavior.

---

#### 1. Synchronizing with Navigation

Use the `NavigationListener` component to keep the tour system in sync with your navigation state. Place it near your main navigation component (such as a stack or tab navigator).

**Example: Expo Router Integration**

```jsx
import React from "react";
import { Stack } from "expo-router";
import { NavigationListener } from "react-native-product-tour";

export default function RootLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="accounts" options={{ title: "Accounts" }} />
                <Stack.Screen name="settings" options={{ title: "Settings" }} />
            </Stack>
            {/* Synchronize tour steps with navigation */}
            <NavigationListener />
        </>
    );
}
```

> **Tip:**  
> For React Navigation or other navigation libraries, place `NavigationListener` at the root of your navigator tree.

---

#### 2. Handling the Back Button

To prevent users from accidentally exiting a tour by pressing the device back button (especially on Android), use the `BackButtonBlocker` component. This ensures the tour flow remains uninterrupted.

**Example:**

```jsx
import React from "react";
import { View } from "react-native";
import { TourProvider, BackButtonBlocker } from "react-native-product-tour";
import { tourConfig } from "./config/tourConfig";
import MainNavigator from "./navigation/MainNavigator";

export default function App() {
    return (
        <TourProvider toursConfig={tourConfig}>
            <View style={{ flex: 1 }}>
                <MainNavigator />
                {/* Block back button during tours */}
                <BackButtonBlocker />
            </View>
        </TourProvider>
    );
}
```

---

#### 3. Custom Navigation Logic

For advanced scenarios, you can control navigation during tours by providing a custom navigation handler to `startTour`. This is useful if you need to integrate with custom navigation flows or third-party navigation libraries.

**Example: Using React Navigation**

```jsx
import React from "react";
import { Button } from "react-native";
import { useTour } from "react-native-product-tour";
import { useNavigation } from "@react-navigation/native";

export default function CustomTourButton() {
    const { startTour, activeTourKey } = useTour();
    const navigation = useNavigation();

    const handleStartTour = () => {
        startTour(
            (screenName) => {
                navigation.navigate(screenName);
            },
            "main" // Tour key
        );
    };

    return (
        <Button
            title="Start Guided Tour"
            onPress={handleStartTour}
            disabled={!!activeTourKey}
        />
    );
}
```

> **Note:**  
> The navigation handler receives the target screen name as an argument. Implement your own logic to navigate as needed.

---