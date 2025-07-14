import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";
import React from "react";
import { TourProvider } from "react-native-product-tour";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HighlightOverlay from "./react-native-product-tour/src/components/HighlightOverlay";
import AppNavigator from "./src/navigation/AppNavigator";

import { tourConfig } from "./src/utils/tourInfo";

// Main app component
function App() {
  return (
    <SafeAreaProvider>
      <TourProvider
        toursConfig={tourConfig}
        onTourVisited={async (tourKey) => {
          console.log(`Tour visited: ${tourKey}`);
          await AsyncStorage.setItem(`${tourKey}_tour`, "true");
        }}
        onTourCompleted={async (tourKey) => {
          console.log(`Tour completed: ${tourKey}`);
          await AsyncStorage.setItem(`${tourKey}_completed`, "true");
        }}
      >
        <AppNavigator />
        <HighlightOverlay />
      </TourProvider>
    </SafeAreaProvider>
  );
}

// Register the root component
registerRootComponent(App);

export default App;
