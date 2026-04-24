## 2024-05-14 - Inline Feedback Without Focus Loss
**Learning:** For transient feedback (like a "Copy" button that temporarily shows a checkmark), appending an `aria-live="polite"` to the container ensures screen readers announce the dynamic `aria-label` or `title` updates without shifting user focus, preventing a disruptive experience.
**Action:** When creating state-toggling buttons, apply `aria-live="polite"` to their wrapper and dynamically change their accessibility descriptions alongside their visual icons.
