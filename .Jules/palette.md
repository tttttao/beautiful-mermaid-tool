## 2024-02-09 - Accessible Temporary Visual Feedback
**Learning:** When implementing temporary visual feedback (like a button icon swapping from 'Copy' to 'Check' briefly), dynamically swapping `title` or `aria-label` causes inconsistent or duplicate screen reader announcements. Using a distinct, visually hidden (`sr-only`) `aria-live="polite"` region is much more reliable for communicating these transient states without breaking the core button label.
**Action:** Use a dedicated `aria-live` region separated from the interactive element to broadcast ephemeral status updates.
