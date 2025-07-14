# HighlightWrapper

The `HighlightWrapper` component identifies and measures UI elements so they can be **highlighted during product tours**. It tracks the position and size of its children, registers them with the active tour, and optionally displays tooltips or beacon effects when the corresponding tour step is reached.


## Import

```js
import { HighlightWrapper } from "react-native-product-tour";
```


## Props

| Name            | Type                          | Required | Default | Description                                    |
| --------------- | ----------------------------- | -------- | ------- | ---------------------------------------------- |
| `id`            | `string`                      | ✅       | –       | Unique identifier for the highlighted element. |
| `screen`        | `string`                      | ✅       | –       | Screen path where the element appears.         |
| `scroll`        | `number`                      | ❌      | `0`     | Optional vertical scroll offset for precise positioning. |
| `scrollViewRef` | `React.RefObject<ScrollView>` | ❌      | –       | Reference to a ScrollView for automatic scrolling. |
| `style`         | `object`                      | ❌      | –       | Optional style applied to the wrapper.         |
| `tours`         | `object`                      | ✅       | –       | Tour configuration object mapping tour IDs to step details. |


## Tour Configuration Object

Each key inside the `tours` prop must match a tour key defined in your `tourConfig`. The value is a step configuration object with these properties:

| Property           | Type                                               | Default    | Description                                      |
| ------------------ | -------------------------------------------------- | ---------- | ------------------------------------------------ |
| `stepNumber`       | `number`                                           | (required) | Step at which this element is highlighted.       |
| `tooltip`          | `boolean`                                          | `false`    | Whether to show a tooltip when highlighted.      |
| `tooltipDirection` | `"top" \| "bottom" \| "left" \| "right" \| "auto"` | `"auto"`   | Direction of the tooltip relative to the element.|
| `tooltipHeading`   | `string`                                           | `""`       | Title of the tooltip.                            |
| `tooltipContent`   | `string`                                           | `""`       | Body text of the tooltip.                        |
| `showBeacon`       | `boolean`                                          | `false`    | Whether to show a pulsing beacon on the element. |


## Example

```jsx
import React, { useRef } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { HighlightWrapper } from "react-native-product-tour";

function SettingsScreen() {
  const scrollViewRef = useRef(null);

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <HighlightWrapper
        id="settings-notifications"
        screen="/settings"
        scrollViewRef={scrollViewRef}
        tours={{
          main: {
            stepNumber: 5,
            tooltip: true,
            tooltipDirection: "bottom",
            tooltipHeading: "Notification Settings",
            tooltipContent:
              "Customize how and when you receive notifications from the app.",
            showBeacon: true,
          },
        }}
      >
        <View style={styles.settingCard}>
          <Text style={styles.settingTitle}>Notifications</Text>
          <Text style={styles.settingDescription}>
            Configure your notification preferences
          </Text>
        </View>
      </HighlightWrapper>

      {/* More settings items... */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  settingCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  settingTitle: { fontSize: 18, fontWeight: "500" },
  settingDescription: { fontSize: 14, color: "#666", marginTop: 4 },
});
```


## 💡 Notes

✅ Use the `scrollViewRef` prop to automatically scroll to highlighted elements during a tour step.  
✅ Multiple tours can reference the same `HighlightWrapper` by adding multiple keys in the `tours` object.  
🚨 The `id` must be **unique across your entire app**; duplicate IDs will cause unexpected behavior.


## 🔗 See also

- [TourProvider](./TourProvider.md)
- [IntroExtroModal](./IntroExtroModal.md)
- [useTour](./useTour.md)
- [Usage Guide](../usage.md)
