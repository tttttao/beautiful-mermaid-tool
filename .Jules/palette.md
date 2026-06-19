## 2026-06-19 - Accessible visual feedback for copy buttons
**Learning:** Adding a temporary visual state (like changing 'Copy' to 'Copied') directly to an interactive element's `aria-label` or `title` can cause screen readers to announce both the old and new states incorrectly or miss the feedback.
**Action:** Use a distinct, visually hidden element with `aria-live="polite"` inside the button to explicitly provide screen reader feedback for temporary visual state changes, avoiding modification of the main button label.
