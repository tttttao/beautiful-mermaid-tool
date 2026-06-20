import { test, expect } from '@playwright/test'

test('should copy mermaid source code to clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')

  const copyBtn = page.getByRole('button', { name: 'Copy source code' })
  await expect(copyBtn).toBeVisible()

  await copyBtn.click()

  // Should change label to Copied!
  const copiedBtn = page.getByRole('button', { name: 'Copied!' })
  await expect(copiedBtn).toBeVisible()

  // Verify clipboard text
  const handle = await page.evaluateHandle(() => navigator.clipboard.readText())
  const text = await handle.jsonValue()
  expect(text).toContain('flowchart TD')
})
