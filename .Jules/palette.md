## 2024-06-05 - Accessible transient button feedback
**Learning:** When adding temporary visual feedback to buttons (like swapping an icon for 2 seconds on success), screen readers can sometimes double-announce or miss the announcement if the primary label/title changes dynamically.
**Action:** Use a distinct, visually hidden `aria-live="polite"` region with a `sr-only` class to handle the accessible feedback message independently of the button's ARIA label.
