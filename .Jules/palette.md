## 2024-05-05 - Accessible Visual Feedback on Icon Buttons
**Learning:** When implementing inline visual feedback (like swapping an icon to indicate success) without moving focus, adding `aria-live="polite"` directly to the button element along with dynamic `aria-label`/`title` bindings ensures that screen readers announce the state change immediately without requiring a separate invisible status element.
**Action:** Always combine `aria-live="polite"` with dynamic label changes when implementing temporary UI state feedback on interactive elements.
