## 2024-05-24 - Screen Reader Double Announcements on Temporary Visual Feedback

**Learning:** When adding temporary visual feedback to a button (like swapping an icon to a checkmark for 2 seconds on save), dynamically updating the `aria-label` or `title` on the button itself can cause screen readers to announce the change twice (or read both the previous and current state consecutively in an unhelpful manner), and can easily break E2E test selectors that target generic `getByText` or `aria-label`s.

**Action:** Separate accessible textual feedback from visual icon swaps by keeping the primary button static (e.g. keeping its `aria-label="Save Chart"`) and introducing a visually hidden, adjacent `aria-live="polite"` container that strictly handles screen reader announcements for temporary state changes.
