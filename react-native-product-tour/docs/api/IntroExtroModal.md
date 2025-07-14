# IntroExtroModal

The `IntroExtroModal` component displays **introduction and conclusion modals** for product tours, giving users context about what they’re about to learn and confirming completion when the tour ends.

These modals are configured via your `tourConfig` and rendered automatically by the tour system, but you can customize their behavior and appearance as needed.


## Import

```js
import { IntroExtroModal, useTour } from "react-native-product-tour";
```

## Props

| Name                 | Type                 | Required | Default   | Description                                      |
| -------------------- | -------------------- | -------- | --------- | ------------------------------------------------ |
| `isVisible`          | `boolean`            | ✅       | `false`   | Whether the modal is visible.                   |
| `onClose`            | `() => void`         | ✅       | –         | Function called when the modal is closed.       |
| `mode`               | `"intro" \| "extro"` | ✅       | `"intro"` | Determines whether the modal is for tour start or end. |
| `showContinueOption` | `boolean`            | ❌      | `false`   | When `true`, displays an option to continue a previously started tour. |
| `modalData`          | `object`             | ✅       | –         | Data object from your `tourConfig` containing modal content. |


## modalData Structure

Each `IntroExtroModal` requires a `modalData` object matching this shape:

| Property     | Type     | Required | Description                                 |
| ------------ | -------- | -------- | ------------------------------------------- |
| `title`      | `string` | ✅       | Title displayed at the top of the modal.    |
| `content`    | `string` | ✅       | Main descriptive text content.              |
| `buttonText` | `string` | ✅       | Text for the primary action button.         |
| `screen`     | `string` | ✅       | Screen path where this modal applies.       |
| `tourKey`    | `string` | ✅       | The tour key this modal belongs to.         |


## Detailed Implementation Example

```jsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { IntroExtroModal, useTour } from "react-native-product-tour";
import { tourConfig } from "../config/tourConfig";

function HomeScreen() {
  const {
    isIntroModalVisible,
    isExtroModalVisible,
    hideIntroModal,
    hideExtroModal,
    savedStep, // Contains info about previously started tours
  } = useTour();

  const introModalData = tourConfig.main.introModal;
  const extroModalData = tourConfig.main.extroModal;

  // Determine if there's a saved step to enable "Continue"
  const hasSavedProgress = savedStep && savedStep.main > 0;

  return (
    <View style={styles.container}>
      {/* Your main screen content */}

      {/* Introduction modal */}
      <IntroExtroModal
        isVisible={isIntroModalVisible && introModalData.screen === "/"}
        onClose={hideIntroModal}
        mode="intro"
        showContinueOption={hasSavedProgress}
        modalData={introModalData}
      />

      {/* Conclusion modal */}
      <IntroExtroModal
        isVisible={isExtroModalVisible && extroModalData.screen === "/"}
        onClose={hideExtroModal}
        mode="extro"
        modalData={extroModalData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```


## 💡 Notes

✅ The intro modal typically appears at the start of a tour to introduce new features.  
✅ The extro modal appears after the final step of a tour, confirming completion.  
🚨 Make sure your `modalData.screen` matches the screen’s routing path where you want the modal to appear.  
🎨 Customize titles, content, and CTA text directly in your `tourConfig`.


## 🔗 See also

- [TourProvider](./TourProvider.md)
- [HighlightWrapper](./HighlightWrapper.md)
- [Usage Guide](../usage.md)
