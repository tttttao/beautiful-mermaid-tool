## 2024-04-22 - Inline Button Feedback
**Learning:** For transient feedback (e.g. Save/Export confirmations), replacing the icon combined with dynamic `aria-label` bindings and `aria-live="polite"` ensures screen readers announce the state reliably without moving focus.
**Action:** Use `setTimeout` to temporarily swap visual icons and ARIA states for icon-only action buttons. Ensure timeouts are cleared if clicked rapidly to avoid overlapping state resets.
