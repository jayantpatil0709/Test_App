import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  Component1,
  Component2,
  Component3,
} from "../components/FirstScreenComponents";

import { HighlightWrapper, useTour } from "react-native-product-tour";
import TourModals from "../components/TourModals";

type RootStackParamList = {
  FirstScreen: undefined;
  SecondScreen: undefined;
};

type FirstScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const FirstScreen = ({ navigation }: FirstScreenProps) => {
  const {
    startTour,
    setActiveTourKey,
    showIntroModal,
    setIsTourActive,
    highlights,
    currentHighlights,
    registerHighlight,
    currentStep,
  } = useTour();

  // Debug log for registered highlights
  console.log(
    "FirstScreen - All registered highlights:",
    JSON.stringify(highlights)
  );
  console.log(
    "FirstScreen - Current highlights:",
    JSON.stringify(currentHighlights)
  );
  console.log("FirstScreen - Current step:", currentStep);
  // Set up global functions that can be called from other components
  React.useEffect(() => {
    // For starting or continuing the tour
    window.startTourFromIntroModal = (tourKey: string) => {
      console.log("FirstScreen - Global startTour called with key:", tourKey);
      startTour(navigation.navigate, tourKey);
    };
    
    window.continueTourFromIntroModal = (tourKey: string) => {
      console.log("FirstScreen - Global continueTour called with key:", tourKey);
      startTour(navigation.navigate, tourKey);
    };
    
    // For navigation between screens during the tour
    window.navigateToScreen = (screen: string) => {
      console.log("FirstScreen - Navigating to screen:", screen);
      if (screen === 'FirstScreen' || screen === 'SecondScreen') {
        navigation.navigate(screen as any);
      } else {
        console.error("Unknown screen:", screen);
      }
    };
    
    return () => {
      window.startTourFromIntroModal = undefined;
      window.continueTourFromIntroModal = undefined;
      window.navigateToScreen = undefined;
    };
  }, [navigation, startTour]);

  const handleStartTour = () => {
    console.log("Starting tour with key: main");
    setActiveTourKey("main");
    setIsTourActive(true); // Explicitly set tour active
    console.log("Showing intro modal");
    showIntroModal(); // First show the intro modal

    // Log more details for debugging
    console.log("Number of highlights registered:", highlights?.length || 0);
    console.log("Current screen:", "FirstScreen");

    // The actual tour will start when user clicks the button in the intro modal
    console.log("Tour setup complete");

    // For direct testing, bypass the intro modal
    // Uncomment to test directly
    /*
    setTimeout(() => {
      console.log("Direct tour start");
      startTour(navigation.navigate, "main");
    }, 1000);
    */
  };

  return (
    <>
      <TourModals />
      <View style={styles.container}>
        <Text style={styles.title}>First Screen</Text>
        <HighlightWrapper
          id="comp1"
          screen="FirstScreen"
          tours={{
            main: {
              stepNumber: 1,
              tooltip: true,
              tooltipDirection: "bottom",
              tooltipHeading: "Component 1",
              tooltipContent:
                "This is the first component with a blue background. It demonstrates basic styling in React Native.",
            },
          }}
        >
          <Component1 />
        </HighlightWrapper>
        <HighlightWrapper
          id="comp2"
          screen="FirstScreen"
          tours={{
            main: {
              stepNumber: 2,
              tooltip: true,
              tooltipDirection: "bottom",
              tooltipHeading: "Component 2",
              tooltipContent:
                "This is the second component with a red background. It shows how to override default styles.",
            },
          }}
        >
          <Component2 />
        </HighlightWrapper>
        <HighlightWrapper
          id="comp3"
          screen="FirstScreen"
          tours={{
            main: {
              stepNumber: 3,
              tooltip: true,
              tooltipDirection: "bottom",
              tooltipHeading: "Component 3",
              tooltipContent:
                "This is the third component with a green background. After this, we'll go to the second screen to see more components.",
            },
          }}
        >
          <Component3 />
        </HighlightWrapper>
        <View style={{ marginBottom: 10 }}>
          <Button
            title="Go to Second Screen"
            onPress={() => navigation.navigate("SecondScreen")}
            color="#2196f3"
          />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button
            title="Start Tour"
            onPress={handleStartTour}
            color="#4CAF50"
          />
        </View>
        <View>
          <Button
            title="Direct Start Tour (Skip Intro)"
            onPress={() => {
              console.log("Directly starting tour without intro");
              setActiveTourKey("main");
              setIsTourActive(true);
              startTour(navigation.navigate, "main");
            }}
            color="#FF9800"
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default FirstScreen;
