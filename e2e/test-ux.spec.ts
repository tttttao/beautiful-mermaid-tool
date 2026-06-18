import { test, expect } from '@playwright/test';

test('Copy button works and shows feedback', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('http://localhost:5173/beautiful-mermaid-tool/');

  const copyBtn = page.locator('button[aria-label="Copy Mermaid source"]');
  await expect(copyBtn).toBeVisible({ timeout: 10000 });

  await copyBtn.click();

  // Wait for the icon to switch to Check
  await expect(page.locator('svg.text-emerald-500')).toBeVisible();

  // Check the aria-live text
  const liveRegion = page.locator('div[aria-live="polite"].sr-only');
  await expect(liveRegion).toHaveText('Copied to clipboard');
});
