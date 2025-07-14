## Troubleshooting

### Common Issues

#### Tour Navigation Issues

- **Tour not showing on correct screen**:
  - Ensure screen paths in `tourConfig.screenMap` exactly match your navigation paths
  - Verify that the `NavigationListener` component is included in your application
  - Check that the `screen` prop in `HighlightWrapper` matches the current screen path
- **Tour starts but doesn't progress to the next screen**:
  - Make sure your navigation function is working correctly
  - Verify that the screen path exists in your application's navigation structure
  - Check for any navigation guards or authentication requirements that might block navigation

#### Highlight and Tooltip Issues

- **Tooltips positioned incorrectly**:
  - Make sure to provide accurate dimensions to `HighlightWrapper`
  - If using scrollable containers, ensure the `scrollViewRef` is properly connected
  - Try using different tooltip directions (top, bottom, left, right) if available space is limited
- **Elements not highlighted**:

  - Check that the screen path and step number match your configuration
  - Ensure the highlighted element is rendered and visible on screen
  - Verify that the tour key in `HighlightWrapper` matches your tour configuration

- **Beacon not visible or misplaced**:
  - Check if `showBeacon` is set to `true` in your tour configuration
  - Ensure the element has positive dimensions (width > 0, height > 0)
  - If the element is inside a ScrollView, ensure proper scroll offset handling

#### Persistence Issues

- **Tour progress not being saved**:

  - Check that `@react-native-async-storage/async-storage` is properly installed and linked
  - Verify that your app has storage permissions
  - Look for any AsyncStorage errors in your console logs

- **Cannot resume a previously started tour**:
  - Make sure you're using the same tour key when calling `continueTour`
  - Check if the saved step is valid (within the range of available steps)
  - Verify that the tour wasn't explicitly cleared with `clearSavedStep`

#### Performance Issues

- **Lag or stuttering during tour transitions**:

  - Reduce the complexity of the highlighted UI elements
  - Use `InteractionManager` for heavy operations after transitions
  - Ensure you're not measuring or highlighting too many elements simultaneously

- **High memory usage**:
  - Limit the number of registered highlights
  - Unregister unused highlights when components unmount

#### Integration with Navigation Libraries

- **Issues with React Navigation**:

  - Ensure you're passing the correct navigation function (`navigation.navigate`)
  - Set up listeners to sync screen changes with the tour system

- **Issues with Expo Router**:
  - Make sure you're using the correct path format (`/path` vs `path`)
  - Use `router.push` or `router.replace` consistently

### Debugging Tips

1. **Check highlight measurements** to verify positioning:

   ```jsx
   // Add this to a problematic HighlightWrapper
   useEffect(() => {
     if (targetRef.current) {
       targetRef.current.measure((x, y, width, height, pageX, pageY) => {
         console.log("Highlight measurements:", {
           x,
           y,
           width,
           height,
           pageX,
           pageY,
         });
       });
     }
   }, []);
   ```