# useTour

The `useTour` hook provides programmatic control and access to all tour-related state from anywhere in your application. Use it to start, continue, advance, or end tours, as well as control modals and highlights.

---

### Import

```js
import { useTour } from "react-native-product-tour";
```

---

### 📝 Available Methods & State

#### ✅ Tour flow control

| Function                          | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `startTour(navigate, tourKey)`    | Start a tour from the beginning.                |
| `continueTour(navigate, tourKey)` | Resume a previously started tour.               |
| `nextStep(navigate)`              | Move to the next step in the current tour.      |
| `prevStep(navigate)`              | Move to the previous step in the current tour.  |
| `endTour()`                       | End the current tour immediately.               |

#### ✅ Modal visibility & control

| Property / Function    | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `isIntroModalVisible`  | `boolean` – Whether the intro modal is visible.  |
| `isExtroModalVisible`  | `boolean` – Whether the extro modal is visible.  |
| `hideIntroModal()`     | Hide the intro modal.                            |
| `hideExtroModal()`     | Hide the extro modal.                            |
| `showIntroModal()`     | Show the intro modal.                            |
| `showExtroModal()`     | Show the extro modal.                            |

#### ✅ Tour state information

| Property         | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `currentStep`    | `number` – Current step number in the active tour.       |
| `totalSteps`     | `number` – Total steps in the active tour.               |
| `isTourActive`   | `boolean` – Whether a tour is currently active.          |
| `activeTourKey`  | `string \| null` – The key of the active tour or `null`. |
| `currentScreen`  | `string` – The current screen path.                      |

#### ✅ Tour persistence

| Property / Function              | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| `savedStep`                      | `Record<string, number> \| null` – Saved progress for each tour. |
| `clearSavedStep(tourKey)`        | Clear saved progress for the specified tour.      |

#### ✅ Navigation utilities

| Function                 | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `setCurrentScreen(screen)` | Update the current screen path for tour awareness. |
| `resetToRoot()`          | Navigate back to the root screen.               |

#### ✅ Highlight management

| Property / Function      | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `beaconPosition`         | `object \| null` – Position data for the active beacon. |
| `setBeaconPosition(position)` | Update the beacon position manually.               |
| `currentHighlights`      | `Highlight[]` – List of highlights for the current step and screen. |

---

### 🛠️ Example Usage

```jsx
import { useTour } from "react-native-product-tour";
import { router } from "expo-router";
import { Button, View, Text } from "react-native";

function TourControlPanel() {
  const {
    startTour,
    endTour,
    nextStep,
    prevStep,
    isTourActive,
    activeTourKey,
    currentStep,
    totalSteps,
  } = useTour();

  const handleStartMainTour = () => {
    startTour(router.push, "main");
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Tour Controls
      </Text>

      <Button title="Start Main Tour" onPress={handleStartMainTour} />
      <Button title="Next Step" onPress={() => nextStep(router.push)} />
      <Button title="Previous Step" onPress={() => prevStep(router.push)} />
      <Button title="End Tour" onPress={endTour} />

      {isTourActive && (
        <View style={{ marginTop: 20 }}>
          <Text>Active Tour: {activeTourKey}</Text>
          <Text>Step: {currentStep} of {totalSteps}</Text>
        </View>
      )}
    </View>
  );
}
```

---

### 💡 Notes

- **Navigation dependency:** The navigation functions `startTour`, `continueTour`, `nextStep`, and `prevStep` all require a navigation method like `router.push` to handle screen transitions.
- **Tour progress:** `savedStep` lets you persist user progress, making it easy to resume tours.
- **Highlights:** `currentHighlights` helps you inspect or customize which elements are highlighted at each step.

---

### 🔗 See also

- [TourProvider](./TourProvider.md)
- [HighlightWrapper](./HighlightWrapper.md)
- [Usage Guide](../usage.md)
