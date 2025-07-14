import React, { useEffect, useRef } from "react";
import { InteractionManager, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTour } from "../context/TourContext";

type TooltipDirection = "top" | "bottom" | "left" | "right" | "auto";

interface TourHighlightConfig {
  stepNumber: number;
  tooltip?: boolean;
  tooltipDirection?: TooltipDirection;
  tooltipHeading?: string;
  tooltipContent?: string;
  showBeacon?: boolean;
}

interface HighlightWrapperProps {
  children: React.ReactNode;
  id: string;
  screen: string;
  scroll?: number;
  scrollViewRef?: React.RefObject<ScrollView | null>;
  style?: object;
  tours: {
    [tourId: string]: TourHighlightConfig;
  };
}

export default function HighlightWrapper({
  children,
  id,
  screen,
  scroll = 0,
  scrollViewRef,
  style,
  tours,
}: HighlightWrapperProps) {
  const targetRef = useRef<View>(null);
  const {
    registerHighlight,
    currentStep,
    isTourActive,
    currentScreen,
    setBeaconPosition,
    activeTourKey,
  } = useTour();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const currentTourConfig = activeTourKey ? tours[activeTourKey] : null;
      const isActiveStep =
        isTourActive &&
        activeTourKey &&
        currentTourConfig &&
        currentStep === currentTourConfig.stepNumber &&
        currentScreen === screen;

      if (isActiveStep && scrollViewRef?.current) {
        scrollViewRef.current.scrollTo({ y: scroll, animated: true });

        const scrollDelay = 400;
        const timer = setTimeout(() => {
          measureTarget();
        }, scrollDelay);

        return () => clearTimeout(timer);
      } else {
        measureTarget();
      }
    });

    return () => task.cancel();
  }, [currentStep, activeTourKey]);

  const measureTarget = () => {
    if (!targetRef.current) return;

    targetRef.current.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) {
        const tourConfigs = Object.entries(tours).map(([tourKey, config]) => ({
          tourKey,
          stepNumber: config.stepNumber,
          tooltip: config.tooltip,
          tooltipDirection: config.tooltipDirection,
          tooltipContent:
            config.tooltipHeading || config.tooltipContent
              ? {
                  heading: config.tooltipHeading || "",
                  content: config.tooltipContent || "",
                }
              : undefined,
          showBeacon: config.showBeacon || false,
        }));

        registerHighlight(
          {
            id,
            x,
            y: y + insets.top,
            width,
            height,
            screen,
            tours: {},
          },
          tourConfigs
        );

        if (
          activeTourKey &&
          tours[activeTourKey]?.showBeacon &&
          isTourActive &&
          currentStep === tours[activeTourKey].stepNumber &&
          currentScreen === screen
        ) {
          setBeaconPosition({
            x,
            y: y + insets.top,
            width,
            height,
          });
        }
      } else {
        console.warn(`HighlightWrapper: measured zero size for id "${id}"`);
      }
    });
  };

  const handleLayout = () => {
    measureTarget();
  };

  return (
    <View ref={targetRef} onLayout={handleLayout} style={style}>
      {children}
    </View>
  );
}
