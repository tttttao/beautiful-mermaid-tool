## 2026-04-14 - Added visual feedback to interactive elements
**Learning:** When implementing temporary visual feedback states using `setTimeout`, it's critical to clear existing timeouts using `clearTimeout` to prevent buggy overlapping state resets during rapid successive user interactions.
**Action:** Always use `clearTimeout` when applying temporary UI state transitions in interactive elements.
