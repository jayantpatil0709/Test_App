import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";
import type { PartialState, NavigationState } from "@react-navigation/routers";

export const navigationRef = createNavigationContainerRef();

let rootResetConfig: PartialState<NavigationState> | NavigationState | null = null;

export function configureLibraryNavigationRoot(
  resetConfig: PartialState<NavigationState> | NavigationState,
) {
  rootResetConfig = resetConfig;
}

export function resetToRoot() {
  if (!rootResetConfig) {
    throw new Error(
      "resetToRoot(): rootResetConfig is not set. " +
      "Call configureLibraryNavigationRoot() in your app startup."
    );
  }

  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.reset(rootResetConfig));
  }
}
