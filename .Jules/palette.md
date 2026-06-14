## 2024-05-20 - Visual Feedback for Save Action
**Learning:** Adding temporary visual feedback (like swapping icons) for quick actions on icon-only buttons improves UX, but screen readers may miss it if we only swap the icon or title dynamically. Swapping titles/labels can cause double announcements or confusion.
**Action:** Always include a dedicated, visually hidden `aria-live` region to announce the success state independently from the button's visual state changes.
