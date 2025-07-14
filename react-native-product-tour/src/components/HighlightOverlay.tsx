// Remove expo-router import and use our global navigation function
// import { router } from "expo-router";

// Declare global navigation function
declare global {
  interface Window {
    startTourFromIntroModal?: (tourKey: string) => void;
    continueTourFromIntroModal?: (tourKey: string) => void;
    navigateToScreen?: (screen: string) => void;
  }
}
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Mask, Rect } from "react-native-svg";
import { useTour } from "../context/TourContext";
import BeaconLight from "./BeaconLight";
import Tooltip from "./Tooltip";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export default function HighlightOverlay() {
  const {
    currentHighlights,
    nextStep,
    prevStep,
    endTour,
    isTourActive,
    totalSteps,
    currentStep,
    activeTourKey,
  } = useTour();
  const insets = useSafeAreaInsets();

  if (!isTourActive || currentHighlights.length === 0) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 999,
        },
      ]}
    >
      {/* Highlighted areas using SVG mask */}
      <Svg width={screenWidth} height={screenHeight + insets.top}>
        <Mask
          id="mask"
          x="0"
          y="0"
          width={screenWidth}
          height={screenHeight + insets.top}
        >
          <Rect
            x="0"
            y="0"
            width={screenWidth}
            height={screenHeight + insets.top}
            fill="white"
          />
          {currentHighlights.map((rect, index) => (
            <Rect
              key={index}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              rx={8}
              ry={8}
              fill="black"
            />
          ))}
        </Mask>

        <Rect
          x="0"
          y="0"
          width={screenWidth}
          height={screenHeight + insets.bottom}
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#mask)"
        />
      </Svg>

      {/* Beacons */}
      {activeTourKey &&
        currentHighlights.map((rect, index) => {
          const highlightTourConfig = rect.tours[activeTourKey];
          if (highlightTourConfig?.showBeacon) {
            return (
              <View
                key={`beacon-${index}`}
                style={{
                  position: "absolute",
                  top: rect.y - 6,
                  left: rect.x + rect.width - 6,
                  zIndex: 1000,
                }}
              >
                <BeaconLight size={16} />
              </View>
            );
          }
          return null;
        })}

      {/* Tooltips */}
      {activeTourKey &&
        currentHighlights.map((rect, index) => {
          const highlightTourConfig = rect.tours[activeTourKey];
          if (highlightTourConfig?.tooltip) {
            return (
              <Tooltip
                key={`tooltip-${index}`}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                direction={highlightTourConfig.tooltipDirection || "bottom"}
                heading={highlightTourConfig.tooltipContent?.heading || ""}
                content={highlightTourConfig.tooltipContent?.content || ""}
                stepNumber={currentStep}
                totalSteps={totalSteps}
                onNext={() => {
                  if (activeTourKey) {
                    console.log("Next button clicked, current step:", currentStep);
                    nextStep((screen) => {
                      console.log("Navigating to screen:", screen);
                      // Use the global navigation function
                      if (window.navigateToScreen) {
                        window.navigateToScreen(screen);
                      }
                    }, activeTourKey);
                  }
                }}
                onPrevious={() => {
                  if (activeTourKey) {
                    console.log("Previous button clicked, current step:", currentStep);
                    prevStep((screen) => {
                      console.log("Navigating to screen:", screen);
                      // Use the global navigation function
                      if (window.navigateToScreen) {
                        window.navigateToScreen(screen);
                      }
                    }, activeTourKey);
                  }
                }}
                onClose={() => endTour()}
              />
            );
          }
          return null;
        })}
    </View>
  );
}
