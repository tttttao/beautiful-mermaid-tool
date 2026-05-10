
## 2024-05-10 - Screen Reader Friendly Visual Feedback
**Learning:** When adding temporary visual feedback states to buttons (like an icon swapping to a checkmark for 2 seconds), dynamically modifying the button's `aria-label` or `title` can cause screen readers to announce the change confusingly or redundantly.
**Action:** Implement a reusable UX pattern: separate the visual state change (the icon swap) from the accessibility announcement. Use a dedicated, visually hidden `<div aria-live="polite" class="sr-only">` element to announce the success message cleanly, while keeping the button's primary label static.
