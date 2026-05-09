## 2024-05-09 - Button Temporary State Announcements
**Learning:** To prevent double announcements by screen readers when adding temporary visual feedback to buttons (like swapping an icon to a checkmark), dynamically swapping the button's `aria-label` can cause confusion.
**Action:** Use a distinct, visually hidden `aria-live` element for temporary feedback instead of mutating the interactive element's accessible name.
