## 2023-10-27 - Temporary Accessible Button Feedback
**Learning:** Modifying a button's `aria-label` dynamically for temporary feedback (e.g., swapping "Save" with "Saved") can lead to double announcements or confusing context shifts for screen reader users.
**Action:** Instead of changing the `aria-label`, create a separate visually hidden element (`<span class="sr-only">`) with `aria-live="polite"`. Render the feedback text in this element only when the feedback state is active. This cleanly announces the confirmation message while preserving the button's static, identifiable label.
