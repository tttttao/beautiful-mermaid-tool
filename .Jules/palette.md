## 2024-05-07 - Screen Reader Double Announcements on Temporary Visual State

**Learning:** When implementing temporary visual feedback on a button (like replacing an icon with a checkmark for 2 seconds), dynamically changing the button's `aria-label` or `title` causes some screen readers to announce the change twice or behave unpredictably when the state reverts automatically.
**Action:** Instead of modifying the primary interactive element's accessible name, append a separate, visually hidden `aria-live="polite"` element that announces the temporary state (e.g., "Chart saved locally"), keeping the primary button's `aria-label` stable.
