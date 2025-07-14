# BeaconLight

The `BeaconLight` component creates a **pulsing beacon effect** to draw user attention to specific UI elements. It is typically used internally by `HighlightWrapper` when `showBeacon` is enabled, but you can also use it manually to highlight new features or important UI areas outside a tour.


## Import

```js
import { BeaconLight } from "react-native-product-tour";
```


## Props

| Name         | Type      | Required | Default     | Description                             |
| ------------ | --------- | -------- | ----------- | --------------------------------------- |
| `visible`    | `boolean` | ✅       | `false`     | Whether the beacon is visible.          |
| `size`       | `number`  | ❌      | `20`        | Diameter of the beacon in pixels.       |
| `color`      | `string`  | ❌      | `'#2089dc'` | Color of the beacon's center dot.       |
| `pulseColor` | `string`  | ❌      | Derived from `color` | Color of the pulsing animation (rgba recommended for transparency). |


## Example

```jsx
import React from "react";
import { View, Text } from "react-native";
import { BeaconLight } from "react-native-product-tour";

function CustomBeaconExample() {
  return (
    <View
      style={{
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BeaconLight
        visible={true}
        size={30}
        color="#FF6B6B"
        pulseColor="rgba(255, 107, 107, 0.2)"
      />
      <Text>New Feature!</Text>
    </View>
  );
}
```

## 💡 Notes

✅ `BeaconLight` animates a **smooth pulsing effect** using React Native’s Animated API.  
🎨 For best results, use a semi-transparent `pulseColor` (e.g., `rgba(...)`) to achieve a subtle beacon glow.  
🚨 Beacons can be overlaid on **any component**, but consider accessibility — avoid overusing beacons as they can distract users.


## 🔗 See also

- [HighlightWrapper](./HighlightWrapper.md)
- [Tooltip](./Tooltip.md)
- [Usage Guide](../usage.md)
