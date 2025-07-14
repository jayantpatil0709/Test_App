import { useEffect, useState } from "react";
import { useTour } from "../context/TourContext";

// React Navigation (for bare React Native projects)
import { navigationRef } from "../utils/Navigation";

/**
 * NavigationListener
 *
 * Automatically tracks navigation changes for:
 * ✅ Expo Router (if available)
 * ✅ Bare React Native (React Navigation)
 *
 * For Bare React Native Projects:
 * -----------------------------------------
 * In your app entry point, attach the library’s navigationRef:
 *
 * import { NavigationContainer } from "@react-navigation/native";
 * import { navigationRef } from "./utils/Navigation";
 *
 * <NavigationContainer ref={navigationRef}>
 *   {your navigators}
 * </NavigationContainer>
 *
 * In tourConfig, use screen names (e.g., "Home", "Profile") for bare React Native.
 */

export default function NavigationListener() {
  const { setCurrentScreen } = useTour();
  const [usingExpoRouter, setUsingExpoRouter] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const expoRouter = await import("expo-router");
        const pathname = expoRouter.usePathname();

        if (pathname) {
          setCurrentScreen(pathname);
          setUsingExpoRouter(true);
        }
      } catch {
        // Not using Expo Router
        setUsingExpoRouter(false);

        if (navigationRef.isReady()) {
          const updateRoute = () => {
            const route = navigationRef.getCurrentRoute();
            if (route?.name) {
              setCurrentScreen(route.name);
            }
          };

          updateRoute();

          unsubscribe = navigationRef.addListener("state", updateRoute);
        }
      }
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setCurrentScreen]);

  return null;
}
