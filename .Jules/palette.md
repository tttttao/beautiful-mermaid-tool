## 2024-04-19 - Visual Feedback on Save Actions

**Learning:** When users click a generic "Save" icon (like a floppy disk), they often lack immediate confirmation that the action succeeded if there isn't a toast notification or global state change. Dynamically switching the icon (e.g., from Save to Check) and updating the aria-label with `aria-live="polite"` provides an inline, non-intrusive, yet highly effective way to confirm the action visually and via screen readers without disrupting the workflow or layout.

**Action:** For standalone action buttons (like save, copy, or refresh) that don't trigger global UI shifts or toasts, always implement an inline feedback state (icon swap + aria update) that resolves after a short timeout (e.g., 2000ms), making sure to clear any existing timeouts on rapid successive clicks.
