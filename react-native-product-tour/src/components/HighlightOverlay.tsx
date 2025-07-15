import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Mask, Rect } from "react-native-svg";
import { useTour } from "../context/TourContext";
import { navigationRef } from "../utils/Navigation"; // 👈 Use the navigationRef

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

  const handleNavigate = (screen: string) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(screen as never);
    }
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 999,
        },
      ]}
    >
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

      {activeTourKey && currentHighlights.map((rect, index) => {
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

      {activeTourKey && currentHighlights.map((rect, index) => {
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
              onNext={() => activeTourKey && nextStep(handleNavigate, activeTourKey)}
              onPrevious={() => activeTourKey && prevStep(handleNavigate, activeTourKey)}
              onClose={() => endTour()}
            />
          );
        }
        return null;
      })}
    </View>
  );
}
