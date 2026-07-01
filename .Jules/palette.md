## 2024-07-02 - Accessible Copy to Clipboard Feedback
**Learning:** Using `aria-live="polite"` combined with `.sr-only` is an extremely effective pattern for announcing temporary button states (like "Copied source to clipboard"). It ensures screen readers announce the success state without causing visual disruption or relying solely on title/aria-label changes which might not be announced predictably depending on the AT.
**Action:** Use this pattern whenever we implement quick-action buttons with temporary visual feedback (like icon swaps).
