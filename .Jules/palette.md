## 2024-06-01 - Add Copy Button to Mermaid Editor
**Learning:** Adding a small "Copy source code" button with a visual and screen-reader accessible confirmation makes the tool much more useful, especially since the diagram rendering itself is not text-selectable.
**Action:** Use an `aria-live="polite"` region for temporary state changes (like "Copied!") and swap an icon (Check/Copy) while disabling/clearing a timeout so rapid clicks don't result in glitchy feedback.
