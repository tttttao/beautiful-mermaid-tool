## 2024-05-15 - Visual Feedback for Copy/Save actions
**Learning:** Users often lack confidence that a "Save" or "Copy" action worked if there is no visual feedback, especially on floating toolbars with icon-only buttons. We can provide feedback by swapping the icon for a checkmark temporarily and adding an accessible aria-live announcement.
**Action:** When saving, swap the `Save` icon with `Check` for 2 seconds and use a visually hidden aria-live region to announce "Chart saved" to screen readers. Always clear timeouts on unmount.
