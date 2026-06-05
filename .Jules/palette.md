## 2024-06-05 - Copy Button Accessible Feedback
**Learning:** When adding temporary visual feedback (like icon swapping) to an interactive button, dynamically changing the primary `aria-label` or `title` can cause screen readers to announce both the old and new state, resulting in double announcements.
**Action:** Separate the accessible feedback message into a distinct, visually hidden (`sr-only`) `aria-live="polite"` element rather than modifying the button's `aria-label` directly.
