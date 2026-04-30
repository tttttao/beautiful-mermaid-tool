## 2024-04-30 - Temporary visual feedback for save actions
**Learning:** For transient UI states (like swapping an icon for a checkmark briefly after a save action), adding `aria-live="polite"` and updating the `aria-label` dynamically is a great way to ensure screen reader users receive the same confirmation feedback as visual users.
**Action:** When implementing temporary visual feedback states, ensure an equivalent accessible announcement happens concurrently, e.g., using `aria-live` on the element or a dedicated visually-hidden alert region.
