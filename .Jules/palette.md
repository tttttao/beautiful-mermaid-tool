## 2023-10-27 - Accessible feedback for temporary UI states
**Learning:** When implementing temporary visual feedback in UI components (like a save button temporarily changing to a checkmark), dynamically swapping the primary button's \`title\` or \`aria-label\` can cause confusing double announcements or interrupt the screen reader flow.
**Action:** Always separate the accessible feedback message into a distinct, visually hidden \`aria-live="polite"\` element, rather than modifying the attributes of the interactive control itself.
