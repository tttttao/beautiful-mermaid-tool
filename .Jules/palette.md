## 2024-04-27 - Inline Visual Feedback for Icon-Only Buttons
**Learning:** When swapping icons to provide visual feedback (e.g., Save -> Check) on a button that doesn't move focus, visual changes alone are insufficient for screen readers.
**Action:** Combine dynamic `aria-label` / `title` bindings with `aria-live="polite"` on the button to ensure the updated state is reliably announced by screen readers without losing focus context.
