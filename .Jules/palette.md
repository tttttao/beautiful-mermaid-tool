## 2026-05-26 - Accessible Temporary Visual Feedback
**Learning:** When adding temporary visual feedback to buttons (e.g. an icon changing state and reverting after a timeout), screen readers can double-announce or get confused if the primary button's `title` or `aria-label` is dynamically swapped.
**Action:** Separate the accessible feedback message into a distinct, visually hidden `aria-live="polite"` element outside the button, and ensure any existing timeouts are cleared to prevent buggy overlapping state resets from rapid clicks.
