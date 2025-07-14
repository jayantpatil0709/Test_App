# HighlightOverlay

The `HighlightOverlay` component creates a **visual dimming effect** over the entire screen during a tour, leaving only the active highlighted element visible and interactive. It helps focus user attention on one element at a time.

This component is rendered **automatically** by the tour system but can be customized if you want to override its behavior or appearance.


## Import

```js
import { HighlightOverlay } from "react-native-product-tour";
```


## Props

The default `HighlightOverlay` **does not accept props** directly.  
It subscribes to the tour context and manages:

✅ Mask rendering around the highlighted element.  
✅ Tooltip positioning.  
✅ Beacon placement.  
✅ Next/Previous navigation controls.


## Customization

If you want to **customize the overlay appearance** (e.g., changing the dimming color, opacity, or adding animations), you need to clone the library’s `HighlightOverlay` component and apply your own styles.

For example:

```jsx
import React from "react";
import { View, StyleSheet } from "react-native";

function CustomHighlightOverlay() {
  return (
    <View style={styles.overlay}>
      {/* Add your custom highlight mask and animations */}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Darker overlay
  },
});
```

> ⚠️ **Important:**  
> Overriding `HighlightOverlay` requires replacing the internal component in the library’s source or forking the library. Out-of-the-box customization through props is **not currently supported**.


## 💡 Notes

✅ The overlay automatically follows the currently active highlight, updating on every tour step.  
🚨 Interactions with elements outside the highlighted area are blocked by the overlay to ensure user focus.  
🎨 The default overlay color is `rgba(0, 0, 0, 0.7)` but can be changed with a custom implementation.


## 🔗 See also

- [HighlightWrapper](./HighlightWrapper.md)
- [Tooltip](./Tooltip.md)
- [Usage Guide](../usage.md)
