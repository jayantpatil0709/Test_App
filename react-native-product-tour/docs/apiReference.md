## API Reference

The `useTour()` hook exposes a set of **methods** and **properties** to fully control your guided tours. Use these in your components to start, navigate, or customize your product tours.

### Methods

| Method                | Signature                                                 | Description                                                                |
| --------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------- |
| **startTour**         | `(navigate: NavigationFunction, tourKey: string) => void` | Starts a tour from the first step of the given tour key.                   |
| **continueTour**      | `(navigate: NavigationFunction, tourKey: string) => void` | Resumes a tour from the saved step, if it exists.                          |
| **nextStep**          | `(navigate: NavigationFunction) => void`                  | Advances the active tour to the next step.                                 |
| **prevStep**          | `(navigate: NavigationFunction) => void`                  | Goes back to the previous step in the active tour.                         |
| **endTour**           | `() => void`                                              | Ends the active tour, optionally showing the extro modal.                  |
| **clearSavedStep**    | `(tourKey: string) => Promise<void>`                      | Clears saved progress for a specific tour (in AsyncStorage).               |
| **registerHighlight** | `(highlight: Highlight, tours: TourConfig[]) => void`     | Registers a UI element to highlight during tours.                          |
| **setBeaconPosition** | `(position: BeaconPosition \| null) => void`              | Sets the active beacon’s position on the screen.                           |
| **setCurrentScreen**  | `(screen: string) => void`                                | Updates the current screen path for tour synchronization.                  |
| **showIntroModal**    | `() => void`                                              | Displays the intro modal for the active tour.                              |
| **hideIntroModal**    | `() => void`                                              | Hides the intro modal for the active tour.                                 |
| **showExtroModal**    | `() => void`                                              | Displays the extro modal for the active tour.                              |
| **hideExtroModal**    | `() => void`                                              | Hides the extro modal for the active tour.                                 |
| **setIsTourActive**   | `(isActive: boolean) => void`                             | Manually set tour active state (advanced use).                             |
| **setActiveTourKey**  | `(tourKey: string \| null) => void`                       | Sets or clears the active tour key.                                        |
| **getSavedStep**      | `() => Promise<void>`                                     | Fetches saved progress from AsyncStorage.                                  |
| **resetToRoot**       | `() => void`                                              | Navigates to the application’s root screen (e.g., after finishing a tour). |

---

### Properties

| Property                | Type                             | Description                                              |
| ----------------------- | -------------------------------- | -------------------------------------------------------- |
| **highlights**          | `Highlight[]`                    | List of all registered highlight elements.               |
| **currentStep**         | `number`                         | Current step number of the active tour.                  |
| **totalSteps**          | `number`                         | Total number of steps defined for the active tour.       |
| **isTourActive**        | `boolean`                        | Whether a tour is currently in progress.                 |
| **currentHighlights**   | `Highlight[]`                    | Highlights relevant to the current step and screen.      |
| **isIntroModalVisible** | `boolean`                        | Whether the intro modal is currently visible.            |
| **isExtroModalVisible** | `boolean`                        | Whether the extro modal is currently visible.            |
| **currentScreen**       | `string`                         | The path of the current screen in your app.              |
| **savedStep**           | `Record<string, number> \| null` | Map of saved progress per tour key (from AsyncStorage).  |
| **activeTourKey**       | `string \| null`                 | The key of the active tour, or `null` if none is active. |
| **beaconPosition**      | `BeaconPosition \| null`         | Position data for the active beacon animation.           |

---

### Type Definitions

#### Highlight

```typescript
type Highlight = {
  id: string; // Unique identifier for this highlight
  x: number; // X coordinate of the element
  y: number; // Y coordinate of the element
  width: number; // Width of the highlighted element
  height: number; // Height of the highlighted element
  screen: string; // Path of the screen where this highlight appears
  tours: {
    [tourKey: string]: {
      stepNumber: number; // Step in the tour where this highlight is shown
      showBeacon?: boolean; // Whether to display a beacon animation
      tooltip?: boolean; // Whether to show a tooltip alongside the highlight
      tooltipDirection?: "top" | "bottom" | "left" | "right" | "auto"; // Tooltip placement
      tooltipContent?: {
        heading: string;
        content: string;
      };
    };
  };
};
```

#### NavigationFunction

A function type compatible with routers like `router.push()` or `navigation.navigate()`:

```typescript
type NavigationFunction = (screen: string) => void;
```

#### TourConfig

Represents a complete tour configuration with optional intro and extro modals:

```typescript
interface TourConfig {
  screenMap: { [stepNumber: number]: string }; // Maps step numbers to screen paths
  introModal?: {
    title: string;
    content: string;
    buttonText: string;
    screen: string;
    tourKey: string;
  };
  extroModal?: {
    title: string;
    content: string;
    buttonText: string;
    screen: string;
    tourKey: string;
  };
}
```

#### BeaconPosition

Specifies the active position for the beacon highlight animation:

```typescript
type BeaconPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

## Notes
- **Highlights**: Registered highlights must include a `screen` value; they appear only when the user is on the specified screen.
- **Navigation**: Always pass your own navigation function (e.g., `navigation.navigate` or `router.push`) to `startTour()`, `continueTour()`, `nextStep()`, and similar methods to keep navigation in sync with your app.
- **Modals**: Intro and extro modals give your tours a polished beginning and end, and they’re optional — you can omit them for simpler, step-only tours.
- **Multiple Tours**: You can manage multiple independent tours by configuring different `tourKey`s in your tour config. Each tour tracks its own progress.


With these definitions and guidelines, you can fully leverage `useTour()` to create tailored, interactive guided tours for your app.
