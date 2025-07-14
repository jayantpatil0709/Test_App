## Frequently Asked Questions (FAQ)

### Why does my tour not start even though I call `startTour()`?

- Ensure the following:
    - The correct navigation function (`navigation.navigate` or `router.push`) is passed to `startTour()`.
    - The `tourKey` matches one defined in your `tourConfig`.
    - The intro modal is either displayed or intentionally skipped before starting the tour.
    - All required screens and steps are properly registered in your configuration.

---

### Can I start a tour without showing the intro modal?

- Yes! You can skip calling `showIntroModal()`, or simply omit the `introModal` entry in your tour configuration. The tour will start directly from the first step.

---

### How do I handle changes to my app’s navigation structure?

- Update your `tourConfig.screenMap` so that all screen paths match your current navigation routes.
- Verify that the `NavigationListener` is still placed near your navigation container to track route changes.
- Test each tour step after navigation updates to ensure correct highlighting and transitions.

---

### What if I want a tour to resume automatically when the user returns to the app?

- Listen for app state changes (e.g., using React Native’s `AppState`).
- When the app becomes active, check if a `savedStep` exists and no tour is currently running. If so, call `continueTour()` to resume from where the user left off.

---

### How can I reset a tour’s progress so a user can start over?

- Use the `clearSavedStep(tourKey)` method before starting the tour again:
    ```tsx
    await clearSavedStep("mainTour");
    startTour(navigation.navigate, "mainTour");
    ```
- This will clear any saved progress and restart the tour from the beginning.

---

### Why is the beacon not animating on some steps?

- Confirm that `showBeacon: true` is set for the relevant step in your `tourConfig`.
- Ensure the highlighted element is rendered on screen and has valid dimensions.
- If the element is conditionally rendered, make sure it is present when the step is active.

---

### Can I use multiple highlights in a single step of a tour?

- Yes, you can highlight multiple components in a single step. Wrap each component you want to highlight and assign them the same step number.
- **Note:** Provide unique IDs to each highlight. Without unique IDs, multiple highlights in the same step may not register correctly.
- This allows you to draw attention to several UI elements simultaneously within a single tour step.
