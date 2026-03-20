import { expect, test } from '@playwright/test'

test.describe('Sidebar History Flow', () => {
  test('should save chart, view in history, and reload', async ({ page }) => {
    await page.goto('/')

    // Wait for the Monaco Editor to load completely
    const editor = page.locator('.monaco-editor')
    await expect(editor).toBeVisible()

    // Check initial preview visibility
    await expect(page.getByText('Infinite Canvas')).toBeVisible()

    // Clear and type new Mermaid code
    const textarea = page.locator('.monaco-editor textarea')
    // Select all and delete (cmd+a / ctrl+a then backspace)
    await textarea.first().click({ force: true })
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.press('Backspace')

    // Type new diagram source
    const newSource = 'graph TD\n  NewApp --> NewDb'
    await page.keyboard.type(newSource)

    // Wait a bit for debounce to update the canvas
    await page.waitForTimeout(500)

    // Click Save
    const saveButton = page.getByRole('button', { name: 'Save Chart' })
    await saveButton.click()

    // Open Sidebar
    const historyButton = page.getByRole('button', { name: 'History', exact: true })
    await historyButton.click()

    // Verify Sidebar is open and shows the history item
    const sidebar = page.locator('.fixed.inset-y-0.right-0')
    await expect(sidebar).toBeVisible()
    await expect(page.getByText('Local History')).toBeVisible()

    // Expect the truncated text of what we just typed to be visible in the sidebar
    const historyItemText = sidebar.getByText('graph TD NewApp --> NewDb')
    await expect(historyItemText).toBeVisible()

    // Close Sidebar
    const closeButton = page.getByRole('button', { name: 'Close history' })
    await closeButton.click()
    // It slides out by translating to x-full, it might still technically be in the DOM but out of view
    await expect(sidebar).toHaveClass(/translate-x-full/)

    // Clear the editor again to test loading
    await textarea.first().click({ force: true })
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.press('Backspace')
    await page.keyboard.type('graph LR\n  A --> B')
    await page.waitForTimeout(500)

    // Open Sidebar again
    await historyButton.click()

    // Click the history item to load it
    await historyItemText.click()

    // Wait a bit for the editor model to update and debounce to fire
    await page.waitForTimeout(500)

    // Close the sidebar to look at the editor
    await closeButton.click()

    // Validate that the code was loaded back into the Monaco editor
    // Note: Playwright can't easily read Monaco contents line-by-line via text content reliably due to dom virtualization,
    // so we can use a script evaluation to read the monaco model, or just check if the text exists in the dom view
    const viewLines = page.locator('.view-lines')
    await expect(viewLines).toContainText('NewApp')
    await expect(viewLines).toContainText('NewDb')

    // Open Sidebar again to delete the item
    await historyButton.click()

    // Click the delete button on the item
    const deleteButton = page.getByRole('button', { name: 'Delete item' }).first()
    // It is visible on hover, but we can force click
    await deleteButton.click({ force: true })

    // Verify it is removed
    await expect(page.getByText('No history yet.')).toBeVisible()
  })
})
