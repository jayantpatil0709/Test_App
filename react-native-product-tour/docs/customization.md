## Styling and Customization

The React Native Product Tour library is designed for maximum flexibility, allowing you to seamlessly integrate onboarding experiences that match your app’s unique look and feel.

---

### Style Files Structure

All core styles are organized under `/src/assets/styles/`:

- **`tooltip.styles.ts`** – Tooltip appearance and layout
- **`intro.modal.styles.ts`** – Intro and extro modal styling

You can override these or use them as a reference for your own custom components.

---

### 🎨 Customizing Colors

Easily update the color palette by editing `/src/constants/colors.ts`. This centralizes all color values for quick theming:

```typescript
import { COLORS } from "react-native-product-tour/src/constants/colors";

// Example: Override default colors
COLORS.PRIMARY = "#6200EE";         // Main accent
COLORS.SECONDARY = "#03DAC5";       // Secondary accent
COLORS.BACKDROP = "rgba(0,0,0,0.7)";// Overlay background
COLORS.TEXT_PRIMARY = "#FFFFFF";    // Main text
COLORS.TEXT_SECONDARY = "#CCCCCC";  // Secondary text
COLORS.BEACON = "#FF4081";          // Beacon highlight
```

> **Tip:** You can also pass custom color objects as props to your own components for even more control.

---

### 🛠️ Custom Tooltip Styling

Build a fully custom tooltip by leveraging the tour context. This lets you control layout, transitions, and interactivity:

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

    if (!currentHighlights?.length) return null;

    const highlight = currentHighlights[0];
    const tourKey = Object.keys(highlight.tours)[0];
    const tourConfig = highlight.tours[tourKey];

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
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 1000,
    },
    tooltip: {
        backgroundColor: "#FFF",
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
        color: "#333",
    },
    content: {
        fontSize: 14,
        marginBottom: 16,
        color: "#666",
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    stepCounter: {
        fontSize: 12,
        color: "#999",
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
        color: "#FFF",
    },
});

export default CustomTooltip;
```

**You can:**  
- Add animations or transitions  
- Change layout for mobile/tablet  
- Inject icons, avatars, or images  
- Use your own color scheme

---

### 🖼️ Custom Modal Styling

Create branded intro and outro modals for a polished onboarding experience:

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
            transparent
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
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#FFF",
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
        color: "#FFF",
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

**Ideas:**  
- Add illustrations or branding  
- Animate modal appearance  
- Offer multiple onboarding flows

---

### 💡 Pro Tips

- **Component Props:** Many tour components accept style and content props for quick tweaks.
- **Dark Mode:** Use dynamic color values to support light/dark themes.
- **Accessibility:** Ensure color contrast and touch targets meet accessibility guidelines.

---

By customizing styles and components, you can deliver a product tour that feels native to your app and delights your users.