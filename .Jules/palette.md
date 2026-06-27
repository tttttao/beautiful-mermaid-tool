## 2026-06-27 - Add Copy to Clipboard button to Editor header
**Learning:** Adding a copy to clipboard button on editor components offers a clear, accessible UX improvement, allowing screen readers to inform users of the source copy functionality while giving visual users quick access to their source code.
**Action:** Always make sure the copy action includes an aria-live region to properly announce the copy event to screen readers, preventing the user from missing feedback that isn't visually communicated through toast messages or other alerts.
