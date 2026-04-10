## 2024-05-14 - Temporary Check Icon for Save Status
**Learning:** Adding a temporary success state (e.g. swap Save icon to Check mark) provides immediate visual feedback to the user without interrupting their workflow with toast notifications or alerts. When dynamically updating title/aria-label attributes in Vue, they successfully announce changes to screen readers upon component interaction.
**Action:** Use a short `setTimeout` (clearing existing ones) to temporarily swap icons and update `aria-label`s on buttons to reflect state changes without requiring extra UI elements.
