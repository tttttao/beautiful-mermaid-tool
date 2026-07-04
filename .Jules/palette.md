## 2024-10-24 - Accessible Copy Button States
**Learning:** When implementing temporary visual feedback for a copy button (like swapping a copy icon for a checkmark), screen readers miss the visual update if we only change the icon or the button's \`title\`/\`aria-label\`.
**Action:** Always provide an \`aria-live="polite"\` sr-only region near the button that explicitly announces "Source code copied to clipboard" when the action is triggered, separating the visual state change from the accessible announcement.
