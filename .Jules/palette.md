## 2023-10-25 - [Inline Visual Feedback for Hidden State]
**Learning:** Actions that modify hidden state (like saving to a closed sidebar or local storage) often feel unresponsive to users. Without visual feedback, users may click multiple times or feel uncertain if the action succeeded.
**Action:** Always provide brief, inline visual feedback (like temporarily swapping an icon to a checkmark) and ensure the container has `aria-live="polite"` so screen readers announce the state change dynamically.
