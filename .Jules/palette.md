## 2024-06-06 - Temporary visual feedback prevents double announcements

**Learning:** When adding temporary visual feedback to buttons (like swapping an icon for a set duration), dynamically updating the primary button's `aria-label` or `title` can cause screen readers to announce the change and then immediately announce the reversion.

**Action:** Separate the accessible feedback message into a distinct, visually hidden `aria-live="polite"` element. Leave the main button's `aria-label` unchanged to prevent redundant or confusing announcements.
