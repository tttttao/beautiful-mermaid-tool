## 2025-06-02 - Accessible Temporary Feedback
**Learning:** When providing temporary visual feedback (like swapping icons on a button click), mutating the `aria-label` or `title` dynamically can cause double announcements or missed updates in some screen readers.
**Action:** Separate the accessible feedback message into a distinct, visually hidden `aria-live="polite"` element. Update this region when the state changes and clear it when the timeout completes.
