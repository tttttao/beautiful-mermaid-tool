## 2024-05-18 - Avoid Screen Reader Double Announcements
**Learning:** When adding temporary visual feedback to buttons (like swapping an icon for a few seconds), changing the `aria-label` or `title` dynamically can cause screen readers to announce the change and then abruptly announce the revert. This creates a confusing experience.
**Action:** Use a separate, visually hidden `aria-live="polite"` element to announce the success message once. Leave the original button`s `aria-label` unchanged.
