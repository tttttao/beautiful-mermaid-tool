## 2024-06-17 - Add copy source code button
**Learning:** Adding a copy button next to the Mermaid source code editor is a clear UX win because users frequently need to copy their rendered mermaid code out of the tool. Making this a single click with visual feedback (icon change and "Copied" text) reduces friction.
**Action:** Use \`@vueuse/core\` \`useClipboard\` for seamless integration and implement accessible notification using \`aria-live\` region.
