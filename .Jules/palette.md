## 2024-05-28 - Accessible Copy Feedback
**Learning:** To prevent double announcements by screen readers when adding temporary visual feedback to buttons (like swapping a copy icon for a checkmark), separate the accessible feedback message into a distinct, visually hidden `aria-live` element rather than dynamically swapping the primary button's `title` or `aria-label`.
**Action:** Use an `aria-live="polite"` span block instead of mutating ARIA properties directly on the button when implementing temporary visual states.
