
## 2024-05-15 - Decouple visual state from ARIA labels for temporary feedback
**Learning:** When adding temporary visual feedback to an interactive element (e.g., swapping a save icon for a checkmark for a few seconds), changing the primary `aria-label` or `title` dynamically can cause screen readers to announce confusing or redundant updates (or double announce).
**Action:** Always maintain the primary `aria-label` (e.g., "Save Chart") on the interactive element, and use a separate, visually hidden `<span aria-live="polite">` to announce the result state (e.g., "Chart saved to history"). This provides a smooth experience for sighted users while giving clear, distinct feedback to assistive technologies.
