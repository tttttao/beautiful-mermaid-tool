import { test, expect } from '@playwright/test'

test.describe('Mermaid Tool – Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.monaco-editor', { timeout: 15_000 })
    await page.waitForTimeout(1500)
  })

  // -----------------------------------------------------------------------
  // Core Flow 1: Rendering
  // -----------------------------------------------------------------------
  test('should render a Mermaid diagram when valid syntax is entered', async ({ page }) => {
    const editor = page.locator('.monaco-editor textarea').first()
    await editor.focus()

    await page.keyboard.press('Meta+a')
    await page.keyboard.type('flowchart TD\n  A[Hello] --> B[World]', { delay: 30 })

    await page.waitForTimeout(1500)

    const svg = page.locator('svg').first()
    await expect(svg).toBeVisible({ timeout: 10_000 })

    const svgHtml = await svg.innerHTML()
    expect(svgHtml.length).toBeGreaterThan(0)
  })

  test('should show existing diagram when invalid syntax is entered', async ({ page }) => {
    const svgBefore = page.locator('svg').first()
    await expect(svgBefore).toBeVisible({ timeout: 10_000 })

    const editor = page.locator('.monaco-editor textarea').first()
    await editor.focus()
    await page.keyboard.press('Meta+a')
    await page.keyboard.type('this is not valid mermaid', { delay: 20 })

    await page.waitForTimeout(1500)

    const svgAfter = page.locator('svg').first()
    await expect(svgAfter).toBeVisible()
  })

  // -----------------------------------------------------------------------
  // Core Flow 2: Zoom & Pan Interaction
  // -----------------------------------------------------------------------
  test('should zoom via mouse wheel and reflect in transform', async ({ page }) => {
    const svg = page.locator('svg').first()
    await expect(svg).toBeVisible({ timeout: 10_000 })

    const viewport = page.locator('.canvas-grid').first()
    const box = await viewport.boundingBox()
    if (!box) throw new Error('viewport not found')

    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2

    const stage = page.locator('.will-change-transform').first()
    const transformBefore = await stage.evaluate((el) => el.style.transform)

    await page.mouse.move(centerX, centerY)
    await page.mouse.wheel(0, -300)
    await page.waitForTimeout(500)

    const transformAfter = await stage.evaluate((el) => el.style.transform)

    expect(transformAfter).not.toBe(transformBefore)
    expect(transformAfter).toContain('scale')
  })

  test('should pan via mouse drag and reflect in transform', async ({ page }) => {
    const svg = page.locator('svg').first()
    await expect(svg).toBeVisible({ timeout: 10_000 })

    const viewport = page.locator('.canvas-grid').first()
    const box = await viewport.boundingBox()
    if (!box) throw new Error('viewport not found')

    const startX = box.x + box.width / 2
    const startY = box.y + box.height / 2

    const stage = page.locator('.will-change-transform').first()
    const transformBefore = await stage.evaluate((el) => el.style.transform)

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX + 120, startY + 80, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(300)

    const transformAfter = await stage.evaluate((el) => el.style.transform)

    expect(transformAfter).not.toBe(transformBefore)
    expect(transformAfter).toContain('translate')
  })

  // -----------------------------------------------------------------------
  // Core Flow 3: PNG Export
  // -----------------------------------------------------------------------
  test('should trigger a PNG download when export button is clicked', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()))
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err))

    const svg = page.locator('svg').first()
    await expect(svg).toBeVisible({ timeout: 10_000 })

    const exportButton = page.locator('button[aria-label="Export PNG"]')
    await expect(exportButton).toBeEnabled({ timeout: 10_000 })

    const downloadPromise = page.waitForEvent('download', { timeout: 15_000 })

    await exportButton.click()

    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/beautiful-mermaid-.*\.png$/)
  })

  // -----------------------------------------------------------------------
  // Core Flow 4: Fullscreen Preview
  // -----------------------------------------------------------------------
  test('should open fullscreen preview and close with ESC', async ({ page }) => {
    const svg = page.locator('svg').first()
    await expect(svg).toBeVisible({ timeout: 10_000 })

    const fullscreenBtn = page.locator('button[aria-label="Fullscreen preview"]')
    await expect(fullscreenBtn).toBeVisible()
    await fullscreenBtn.click()

    const overlay = page.locator('.fixed.inset-0.z-50')
    await expect(overlay).toBeVisible({ timeout: 3_000 })

    const closeBtn = page.locator('button[aria-label="Close fullscreen"]')
    await expect(closeBtn).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(overlay).not.toBeVisible({ timeout: 3_000 })
  })

  test('should open fullscreen preview and close with close button', async ({ page }) => {
    const svg = page.locator('svg').first()
    await expect(svg).toBeVisible({ timeout: 10_000 })

    const fullscreenBtn = page.locator('button[aria-label="Fullscreen preview"]')
    await fullscreenBtn.click()

    const overlay = page.locator('.fixed.inset-0.z-50')
    await expect(overlay).toBeVisible({ timeout: 3_000 })

    const closeBtn = page.locator('button[aria-label="Close fullscreen"]')
    await closeBtn.click()

    await expect(overlay).not.toBeVisible({ timeout: 3_000 })
  })
})
