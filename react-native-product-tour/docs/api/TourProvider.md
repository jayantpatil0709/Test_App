# TourProvider

The `TourProvider` is the **core context provider** that sets up and manages tour state, highlights, tooltips, and modals across your entire app. It should wrap your application’s main navigator or root component.

## Import

```js
import { TourProvider } from "react-native-product-tour";
```


## Props

| Name              | Type                        | Required | Default | Description                                |
| ----------------- | --------------------------- | -------- | ------- | ------------------------------------------ |
| `toursConfig`     | `object`                    | ✅       | –       | Configuration object defining your tours, screens, and modals. |
| `onTourVisited`   | `(tourKey: string) => void` | ❌      | –       | Callback called the first time a tour is started by the user. |
| `onTourCompleted` | `(tourKey: string) => void` | ❌      | –       | Callback called when the user completes a tour. |


## 💡 Notes

✅ You **must** include a [`HighlightOverlay`](./HighlightOverlay.md) somewhere inside `TourProvider`.  
✅ All screens containing highlights should be wrapped by `TourProvider` to enable proper tour tracking.  
🚨 `toursConfig` is required — without it, no tours will be available.


## Example

```jsx
import React from "react";
import { TourProvider } from "react-native-product-tour";
import { tourConfig } from "./config/tourConfig";
import MainNavigator from "./navigation/MainNavigator";

// Analytics tracking example
const trackTourVisit = (tourKey) => {
  console.log(`User visited tour: ${tourKey}`);
  // e.g., Analytics.logEvent('tour_visited', { tourKey });
};

const trackTourCompletion = (tourKey) => {
  console.log(`User completed tour: ${tourKey}`);
  // e.g., Analytics.logEvent('tour_completed', { tourKey });
};

export default function App() {
  return (
    <TourProvider
      toursConfig={tourConfig}
      onTourVisited={trackTourVisit}
      onTourCompleted={trackTourCompletion}
    >
      {/* Your main app */}
      <MainNavigator />

      {/* Highlight overlay must be inside TourProvider */}
      <HighlightOverlay />
    </TourProvider>
  );
}
```


## 🔗 See also

- [HighlightWrapper](./HighlightWrapper.md)
- [IntroExtroModal](./IntroExtroModal.md)
- [useTour](./useTour.md)
- [Usage Guide](../usage.md)
