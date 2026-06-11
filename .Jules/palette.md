## 2026-06-11 - Accessible Temporary Button Feedback
**Learning:** Swapping `aria-label` or `title` on a button dynamically to announce a temporary feedback state (like 'Copied!') often causes screen readers to announce the change twice or inconsistently.
**Action:** Instead of mutating the button's attributes, provide a distinct, visually hidden element with `aria-live="polite"` to handle the status announcement, keeping the primary button's `aria-label` static.
