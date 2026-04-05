
## 2025-04-05 - Dynamic ARIA Feedback on Icon Buttons
**Learning:** When changing icon states to provide feedback (like a Save icon turning into a Check), screen readers will not announce the change unless the `title` and `aria-label` are dynamically updated. Additionally, applying `aria-live="polite"` helps announce the state change seamlessly without interrupting the user.
**Action:** When implementing visual state feedback on icon-only buttons, ensure the accessible label changes in tandem with the visual icon and use `aria-live` attributes to announce the new state.
