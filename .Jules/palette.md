
## 2026-06-28 - Adding accessibility to visual icon states
**Learning:** When temporarily swapping an icon to provide visual feedback for a user action (like a checkmark after clicking copy), screen readers will not announce the state change if the button's title or aria-label doesn't change. Moreover, simply swapping the aria-label dynamically might lead to double announcements or confusing readouts. The best approach is to keep the button's main aria-label static ('Copy Source') and use a dedicated, visually hidden `aria-live="polite"` element to announce the success message ('Copied to clipboard').
**Action:** Always include a visually hidden aria-live region when building visual-only transient feedback states on icon buttons.
