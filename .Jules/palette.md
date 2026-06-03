## 2024-05-19 - Temporary UI Feedback State using `aria-live`
**Learning:** To prevent double announcements by screen readers when adding temporary visual feedback to buttons (like swapping an icon for a timeout duration), separate the accessible feedback message into a distinct, visually hidden `aria-live` element rather than dynamically swapping the primary button's `title` or `aria-label`.
**Action:** Always pair temporary visual states with a dedicated `aria-live="polite"` visually hidden `span` for clear screen reader feedback without breaking the core interactive label.
