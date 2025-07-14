import React from "react";
import { IntroExtroModal, useTour } from "react-native-product-tour";
import { tourConfig } from "../utils/tourInfo";

type TourKey = keyof typeof tourConfig;

export default function TourModals() {
  const {
    isIntroModalVisible,
    isExtroModalVisible,
    activeTourKey,
    savedStep,
    totalSteps,
    hideIntroModal,
    hideExtroModal,
    setIsTourActive,
    isTourActive,
    highlights,
    currentHighlights,
  } = useTour();

  // Add debugging logs
  console.log("TourModals: isIntroModalVisible =", isIntroModalVisible);
  console.log("TourModals: activeTourKey =", activeTourKey);
  console.log("TourModals: isTourActive =", isTourActive);
  console.log("TourModals: highlights count =", highlights?.length || 0);
  console.log(
    "TourModals: current highlights count =",
    currentHighlights?.length || 0
  );

  const tourKey: TourKey = (
    activeTourKey && Object.keys(tourConfig).includes(activeTourKey)
      ? activeTourKey
      : "main"
  ) as TourKey;

  const savedStepNumber =
    activeTourKey != null ? savedStep?.[activeTourKey] : 0;

  const shouldShowContinueOption =
    (savedStepNumber ?? 0) > 0 && (savedStepNumber ?? 0) < totalSteps;

  return (
    <>
      <IntroExtroModal
        isVisible={isIntroModalVisible && activeTourKey === tourKey}
        onClose={() => {
          // Don't set tour active to false here
          hideIntroModal();
        }}
        mode="intro"
        showContinueOption={
          shouldShowContinueOption && activeTourKey === tourKey
        }
        modalData={{
          title: tourConfig[tourKey].introModal.title,
          content: tourConfig[tourKey].introModal.content,
          buttonText: tourConfig[tourKey].introModal.buttonText,
          screen: tourConfig[tourKey].introModal.screen,
          tourKey,
        }}
      />
      <IntroExtroModal
        isVisible={isExtroModalVisible && activeTourKey === tourKey}
        onClose={() => {
          setIsTourActive(false);
          hideExtroModal();
        }}
        mode="extro"
        modalData={{
          title: tourConfig[tourKey].extroModal.title,
          content: tourConfig[tourKey].extroModal.content,
          buttonText: tourConfig[tourKey].extroModal.buttonText,
          screen: tourConfig[tourKey].extroModal.screen,
          tourKey,
        }}
      />
    </>
  );
}
