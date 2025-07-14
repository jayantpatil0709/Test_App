### Multiple Tours and User Segmentation

This library supports creating multiple, targeted product tours for different user segments, features, or workflows. You can configure and trigger tours based on user roles, app state, or specific actions, providing a personalized onboarding or feature discovery experience.

---

#### Defining Multiple Tours

Organize your tours in a single configuration file. Each tour can have its own screens, intro, and completion modals:

```tsx
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

---

### Conditional Tour Triggering

You can trigger tours automatically or manually, depending on user actions or app state.

#### 1. First-Time User Experience

Automatically start a tour for new users:

```tsx
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
                    startTour(router.push, "mainTour");
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

#### 2. Manual Tour Triggers

Let users start tours from help menus or settings:

```tsx
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
