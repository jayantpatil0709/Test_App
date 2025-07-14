# Tooltip

The `Tooltip` component displays **informational popovers** during a tour, positioned relative to a highlighted element. Tooltips guide users by providing contextual information, helping them understand the purpose of each UI element in the tour.

---

## Import

```js
import { Tooltip } from "react-native-product-tour";
```


## Props

| Name         | Type                                               | Required | Default  | Description                                 |
| ------------ | -------------------------------------------------- | -------- | -------- | ------------------------------------------- |
| `x`          | `number`                                           | ✅       | –        | X coordinate (absolute) of the highlighted element. |
| `y`          | `number`                                           | ✅       | –        | Y coordinate (absolute) of the highlighted element. |
| `width`      | `number`                                           | ✅       | –        | Width of the highlighted element.          |
| `height`     | `number`                                           | ✅       | –        | Height of the highlighted element.         |
| `direction`  | `"top" \| "bottom" \| "left" \| "right" \| "auto"` | ❌      | `"auto"` | Direction where the tooltip should appear relative to the element. |
| `heading`    | `string`                                           | ❌      | `""`     | Title text displayed at the top of the tooltip. |
| `content`    | `string`                                           | ❌      | `""`     | Main descriptive text of the tooltip.      |
| `stepNumber` | `number`                                           | ✅       | –        | Current step number within the active tour.|
| `totalSteps` | `number`                                           | ✅       | –        | Total number of steps in the active tour.  |
| `onClose`    | `() => void`                                       | ✅       | –        | Callback triggered when the tooltip is closed. |
| `onNext`     | `() => void`                                       | ✅       | –        | Callback triggered when the next button is pressed. |
| `onPrevious` | `() => void`                                       | ✅       | –        | Callback triggered when the previous button is pressed. |

---

## Example

> **Note:** Tooltips are typically rendered internally by `HighlightOverlay`.  
> You **don’t need to render `Tooltip` manually** — the tour system handles it for you based on your `HighlightWrapper` configuration.  
>  
> This example shows usage in case you want to customize or override the tooltip component:

```jsx
import React from "react";
import { Tooltip } from "react-native-product-tour";

function CustomTooltip(props) {
  return (
    <Tooltip
      {...props}
      heading="Customized Tooltip Heading"
      content="You can customize tooltips by passing your own props."
    />
  );
}
```

---

## 💡 Notes

✅ By default, `Tooltip` handles step navigation with next/previous buttons and shows the current progress (e.g., “Step 3 of 6”).  
🎨 To fully customize tooltips, pass a custom component via `TourProvider`’s `tooltipComponent` prop (if supported in your version).  
🚨 The `Tooltip` component must receive **accurate position and size data** to render correctly — ensure `HighlightWrapper` is correctly measuring elements.

---

## 🔗 See also

- [TourProvider](./TourProvider.md)
- [HighlightWrapper](./HighlightWrapper.md)
- [Usage Guide](../usage.md)
