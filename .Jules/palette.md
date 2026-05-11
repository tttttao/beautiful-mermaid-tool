
## 2024-05-11 - Temporary State Announcements
**Learning:** When adding temporary visual feedback states to icon buttons (like showing a checkmark for 2 seconds after a save), dynamically updating the button's \`aria-label\` or \`title\` often leads to confusing double-announcements or missed context by screen readers due to focus shifting and rapid state resets.
**Action:** Instead of mutating the parent button's primary label, keep it static ("Save Chart") and render a separate, visually hidden \`aria-live="polite"\` \`<span>\` that conveys the action result (e.g., "Chart saved to history") only while the temporary state is active.
