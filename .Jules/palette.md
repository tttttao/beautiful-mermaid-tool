
## 2024-06-25 - Copy Code Feedback Announcer
**Learning:** When changing UI states (e.g. from a "Copy" icon to a "Check" icon) for a short timeout duration to provide visual feedback, rely on a separate visually hidden `aria-live="polite"` element for screen reader announcements instead of dynamically updating `title` or `aria-label` attributes on the button. Rapid changes to button labels often result in screen readers dropping the announcement or reading it twice (once for the change to the checkmark, and again when it reverts).
**Action:** Always pair temporary visual feedback toggles on icon buttons with a dedicated, decoupled `aria-live` element for the accessible text.
