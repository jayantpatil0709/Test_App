import { useEffect, useRef } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useTour } from "../context/TourContext";

export default function BackButtonBlocker() {
  const { isTourActive, endTour } = useTour();
  const lastBackPress = useRef<number>(0);

  useEffect(() => {
    if (isTourActive) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          const now = Date.now();
          if (lastBackPress.current && now - lastBackPress.current < 4000) {
            endTour();
            return true;
          }
          lastBackPress.current = now;
          ToastAndroid.show(
            "Press back again to exit the tour",
            ToastAndroid.SHORT
          );
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, [isTourActive, endTour]);

  return null;
}
