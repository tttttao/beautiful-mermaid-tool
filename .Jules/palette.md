## 2025-02-14 - Prevent double screen reader announcements for timed icon changes
**Learning:** When temporarily swapping icons to show copy success (e.g. Copy to Check icon), swapping aria labels on the button causes double announcements or conflicts. Separating accessible feedback messages into distinct `aria-live` elements prevents this.
**Action:** Always add an `aria-live="polite"` element with a `.sr-only` class to handle temporary status message announcements, distinct from the button's title or aria-label.
