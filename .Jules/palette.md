## 2024-04-29 - Inline Visual and Assistive Feedback for Save Actions
**Learning:** For silent local-state actions (like saving diagram history locally), users lack confidence without a clear success indicator. Swapping icons temporarily combined with `aria-live="polite"` handles this elegantly for both sighted and screen reader users without needing heavy UI additions like toast notifications.
**Action:** Use short-lived icon swaps and live regions for frequent, low-stakes success states to keep the UI minimalist but informative.
