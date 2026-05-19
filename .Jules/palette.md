## 2023-11-15 - Ambiguous Screen Reader Text in Tests
**Learning:** When adding visually hidden text for screen readers (e.g., within `aria-live` regions), ensure the phrasing does not inadvertently conflict with generic text selectors used in existing E2E or unit tests (e.g., Playwright's `getByText`), which may result in 'strict mode violation' or 'multiple elements found' errors.
**Action:** Always review existing test assertions for text overlaps before adding new screen reader announcements, and prefer more specific locators or unique text if conflicts arise.

## 2023-11-15 - Unmounted Component Timeout Leaks
**Learning:** When utilizing `setTimeout` in UI components (such as Vue) to implement visual feedback, ensure existing timeouts are appropriately cleared within the component lifecycle (e.g., inside an `onBeforeUnmount` hook) to prevent memory leaks and unintended state updates on unmounted instances.
**Action:** Always add lifecycle teardown for all timeouts created inside the component setup.
