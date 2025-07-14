import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HighlightWrapper, useTour } from "react-native-product-tour";
import {
  Component4,
  Component5,
  Component6,
} from "../components/SecondScreenComponents";
import TourModals from "../components/TourModals";

type RootStackParamList = {
  FirstScreen: undefined;
  SecondScreen: undefined;
};

type SecondScreenProps = {
  navigation: NavigationProp<RootStackParamList>;
};

const SecondScreen = ({ navigation }: SecondScreenProps) => {
  const { startTour, currentHighlights, highlights } = useTour();

  // Debug logs
  console.log(
    "SecondScreen - Current highlights:",
    JSON.stringify(currentHighlights)
  );
  console.log("SecondScreen - All highlights:", highlights?.length || 0);

  // Set up global functions for tour navigation
  React.useEffect(() => {
    // @ts-ignore
    window.startTourFromIntroModal = (tourKey: string) => {
      console.log("SecondScreen - Global startTour called with key:", tourKey);
      startTour(navigation.navigate, tourKey);
    };

    // @ts-ignore
    window.continueTourFromIntroModal = (tourKey: string) => {
      console.log(
        "SecondScreen - Global continueTour called with key:",
        tourKey
      );
      startTour(navigation.navigate, tourKey);
    };

    // For navigation between screens during the tour
    // @ts-ignore
    window.navigateToScreen = (screen: string) => {
      console.log("SecondScreen - Navigating to screen:", screen);
      if (screen === "FirstScreen" || screen === "SecondScreen") {
        navigation.navigate(screen as any);
      } else {
        console.error("Unknown screen:", screen);
      }
    };

    return () => {
      // @ts-ignore
      window.startTourFromIntroModal = undefined;
      // @ts-ignore
      window.continueTourFromIntroModal = undefined;
      // @ts-ignore
      window.navigateToScreen = undefined;
    };
  }, [navigation, startTour]);

  return (
    <>
      <TourModals />
      <View style={styles.container}>
        <Text style={styles.title}>Second Screen</Text>
        <HighlightWrapper
          id="comp4"
          screen="SecondScreen"
          tours={{
            main: {
              stepNumber: 4,
              tooltip: true,
              tooltipDirection: "bottom",
              tooltipHeading: "Component 4",
              tooltipContent:
                "Welcome to the second screen! This is the fourth component with a teal background.",
            },
          }}
        >
          <Component4 />
        </HighlightWrapper>
        <HighlightWrapper
          id="comp5"
          screen="SecondScreen"
          tours={{
            main: {
              stepNumber: 5,
              tooltip: true,
              tooltipDirection: "bottom",
              tooltipHeading: "Component 5",
              tooltipContent:
                "This is the fifth component with a purple background. Notice how each component has a different style.",
            },
          }}
        >
          <Component5 />
        </HighlightWrapper>
        <HighlightWrapper
          id="comp6"
          screen="SecondScreen"
          tours={{
            main: {
              stepNumber: 6,
              tooltip: true,
              tooltipDirection: "bottom",
              tooltipHeading: "Component 6",
              tooltipContent:
                "This is the final component with an orange background. You've now completed the tour of all six components!",
            },
          }}
        >
          <Component6 />
        </HighlightWrapper>
        <Button
          title="Back to First Screen"
          onPress={() => navigation.navigate("FirstScreen")}
          color="#ff9800"
        />
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

export default SecondScreen;
