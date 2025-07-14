import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { resetToRoot } from "../utils/Navigation";

export type Highlight = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  screen: string;
  tours: {
    [tourKey: string]: {
      stepNumber: number;
      showBeacon?: boolean;
      tooltip?: boolean;
      tooltipDirection?: "top" | "bottom" | "left" | "right" | "auto";
      tooltipContent?: {
        heading: string;
        content: string;
      };
    };
  };
};

type NavigationFunction = (screenName: string) => void;

interface TourContextType {
  highlights: Highlight[];
  currentStep: number;
  totalSteps: number;
  isTourActive: boolean;
  currentHighlights: Highlight[];
  isIntroModalVisible: boolean;
  isExtroModalVisible: boolean;
  currentScreen: string;
  savedStep: Record<string, number> | null;
  activeTourKey: string | null;
  beaconPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  setBeaconPosition: (
    position: { x: number; y: number; width: number; height: number } | null
  ) => void;
  setIsTourActive: (isActive: boolean) => void;
  setCurrentScreen: (screen: string) => void;
  showIntroModal: () => void;
  hideIntroModal: () => void;
  showExtroModal: () => void;
  resetToRoot: () => void;
  hideExtroModal: () => void;
  startTour: (navigate: NavigationFunction, tourKey: string) => void;
  continueTour: (navigate: NavigationFunction, tourKey: string) => void;
  nextStep: (navigate: NavigationFunction, tourKey: string) => void;
  prevStep: (navigate: NavigationFunction, tourKey: string) => void;
  setActiveTourKey: (tourKey: string | null) => void;
  clearSavedStep: (tourKey: string) => Promise<void>;
  endTour: (noInternet?: boolean) => void;
  registerHighlight: (
    highlight: Highlight,
    tours: {
      tourKey: string;
      stepNumber: number;
      tooltipContent?: { heading: string; content: string };
      tooltipDirection?: "top" | "bottom" | "left" | "right" | "auto";
      showBeacon?: boolean;
      tooltip?: boolean;
    }[]
  ) => void;
  getSavedStep: () => Promise<void>;
}

interface TourProviderProps {
  children: ReactNode;
  toursConfig: {
    [tourKey: string]: {
      screenMap: { [stepNumber: number]: string };
      introModal?: {
        title: string;
        content: string;
        buttonText: string;
        screen: string;
      };
      extroModal?: {
        title: string;
        content: string;
        buttonText: string;
        screen: string;
      };
    };
  };
  onTourVisited?: (tourKey: string) => void;
  onTourCompleted?: (tourKey: string) => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error("useTour must be used within a TourProvider");
  return context;
};

export const TourProvider = ({
  children,
  toursConfig,
  onTourVisited,
  onTourCompleted,
}: TourProviderProps) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("/");
  const [isIntroModalVisible, setIsIntroModalVisible] = useState(true);
  const [isExtroModalVisible, setIsExtroModalVisible] = useState(false);
  const [savedSteps, setSavedStep] = useState<Record<string, number> | null>(
    null
  );
  const [activeTourKey, setActiveTourKey] = useState<string | null>(null);
  const [beaconPosition, setBeaconPosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    getSavedStep();
  }, []);

  const getSavedStep = async () => {
    try {
      const keys = Object.keys(toursConfig);
      const steps: Record<string, number> = {};
      for (const key of keys) {
        const val = await AsyncStorage.getItem(`tour_${key}_step`);
        if (val !== null) steps[key] = parseInt(val, 10);
      }
      setSavedStep(steps);
    } catch (error) {
      console.error("Error loading saved step:", error);
    }
  };

  const saveTourStep = async (tourKey: string, step: number) => {
    try {
      await AsyncStorage.setItem(`tour_${tourKey}_step`, step.toString());
      setSavedStep((prev) => ({ ...prev, [tourKey]: step }));
    } catch (error) {
      console.error("Error saving tour step:", error);
    }
  };

  const clearSavedStep = async (tourKey: string) => {
    try {
      await AsyncStorage.removeItem(`tour_${tourKey}_step`);
      setSavedStep((prev) => ({ ...prev, [tourKey]: 0 }));
    } catch (error) {
      console.error("Error clearing saved step:", error);
    }
  };

  const showIntroModal = () => setIsIntroModalVisible(true);
  const hideIntroModal = () => setIsIntroModalVisible(false);

  const showExtroModal = () => setIsExtroModalVisible(true);
  const hideExtroModal = () => setIsExtroModalVisible(false);

  const totalSteps = useMemo(() => {
    if (!activeTourKey) return 0;
    return Object.keys(toursConfig[activeTourKey]?.screenMap || {}).length;
  }, [activeTourKey, toursConfig]);

  const currentHighlights = useMemo(() => {
    if (!activeTourKey) return [];
    return highlights.filter(
      (h) =>
        h.tours[activeTourKey] &&
        h.tours[activeTourKey].stepNumber === currentStep &&
        h.screen === currentScreen
    );
  }, [highlights, currentStep, currentScreen, activeTourKey]);

  const startTour = async (navigate: NavigationFunction, tourKey: string) => {
    console.log("TourContext - startTour called with tourKey:", tourKey);
    console.log("TourContext - current isTourActive:", isTourActive);
    console.log("TourContext - current activeTourKey:", activeTourKey);

    hideIntroModal();
    await clearSavedStep(tourKey);
    setActiveTourKey(tourKey);
    setIsTourActive(true);
    onTourVisited?.(tourKey);
    setCurrentStep(1);

    console.log("TourContext - isTourActive set to:", true);
    console.log("TourContext - currentStep set to:", 1);

    const targetScreen = toursConfig[tourKey]?.screenMap[1];
    console.log("TourContext - targetScreen for step 1:", targetScreen);

    if (targetScreen) {
      console.log("TourContext - Navigating to:", targetScreen);
      navigate(targetScreen as any);
      setCurrentScreen(targetScreen);
    } else {
      console.log("TourContext - No target screen found for step 1");
    }
    await saveTourStep(tourKey, 1);
  };

  const continueTour = (navigate: NavigationFunction, tourKey: string) => {
    if (!savedSteps) return;
    const saved = savedSteps[tourKey];
    const stepsInTour = Object.keys(
      toursConfig[tourKey]?.screenMap || {}
    ).length;
    if (saved && saved <= stepsInTour) {
      hideIntroModal();
      onTourVisited?.(tourKey);
      setActiveTourKey(tourKey);
      setIsTourActive(true);
      const targetScreen = toursConfig[tourKey]?.screenMap[saved];
      if (targetScreen) {
        navigate(targetScreen as any);
        setCurrentScreen(targetScreen);
      }
      setCurrentStep(saved);
    }
  };

  const nextStep = async (navigate: NavigationFunction) => {
    if (!activeTourKey) return;
    const next = currentStep + 1;
    const targetScreen = toursConfig[activeTourKey]?.screenMap[next];
    if (targetScreen) {
      if (targetScreen !== currentScreen) navigate(targetScreen as any);
      setCurrentScreen(targetScreen);
      setCurrentStep(next);
      await saveTourStep(activeTourKey, next);
    } else {
      endTour();
    }
  };

  const prevStep = async (navigate: NavigationFunction) => {
    if (!activeTourKey) return;
    const prev = currentStep - 1;
    const targetScreen = toursConfig[activeTourKey]?.screenMap[prev];
    if (targetScreen) {
      if (targetScreen !== currentScreen) navigate(targetScreen as any);
      setCurrentStep(prev);
      setCurrentScreen(targetScreen);
      await saveTourStep(activeTourKey, prev);
    }
  };

  const endTour = async () => {
    if (!activeTourKey) return;
    if (currentStep > 0 && currentStep < totalSteps)
      await saveTourStep(activeTourKey, currentStep);
    if (currentStep === totalSteps) {
      showExtroModal();
      await clearSavedStep(activeTourKey);
      onTourCompleted?.(activeTourKey);
    } else {
      resetToRoot();
    }
    onTourVisited?.(activeTourKey);
    setCurrentStep(-1);
    setCurrentScreen(
      activeTourKey ? toursConfig[activeTourKey].screenMap[1] : "/"
    );
  };

  const registerHighlight = (
    highlight: Omit<Highlight, "tours">,
    tours: {
      tourKey: string;
      stepNumber: number;
      tooltipContent?: { heading: string; content: string };
      tooltipDirection?: "top" | "bottom" | "left" | "right" | "auto";
      showBeacon?: boolean;
      tooltip?: boolean;
    }[]
  ) => {
    setHighlights((prev) => {
      const existingIndex = prev.findIndex((h) => h.id === highlight.id);
      const newTours: Highlight["tours"] = {};
      tours.forEach((t) => {
        newTours[t.tourKey] = {
          stepNumber: t.stepNumber,
          tooltipContent: t.tooltipContent,
          tooltipDirection: t.tooltipDirection,
          showBeacon: t.showBeacon,
          tooltip: t.tooltip,
        };
      });
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...highlight,
          tours: { ...updated[existingIndex].tours, ...newTours },
        };
        return updated;
      } else {
        return [...prev, { ...highlight, tours: newTours }];
      }
    });
  };

  return (
    <TourContext.Provider
      value={{
        highlights,
        currentStep,
        totalSteps,
        isTourActive,
        currentHighlights,
        currentScreen,
        isIntroModalVisible,
        isExtroModalVisible,
        savedStep: savedSteps,
        activeTourKey,
        beaconPosition,
        setBeaconPosition,
        clearSavedStep,
        resetToRoot,
        setActiveTourKey,
        setIsTourActive,
        setCurrentScreen,
        showIntroModal,
        hideIntroModal,
        showExtroModal,
        hideExtroModal,
        startTour,
        continueTour,
        nextStep,
        prevStep,
        endTour,
        registerHighlight,
        getSavedStep,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
