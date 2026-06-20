import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            record_video_dir="/home/jules/verification/videos",
            record_video_size={"width": 1280, "height": 720},
            permissions=['clipboard-read', 'clipboard-write']
        )
        page = await context.new_page()

        await page.goto("http://localhost:4173/beautiful-mermaid-tool/")

        # Wait for the button
        await page.wait_for_selector('button[aria-label="Copy source code"]')

        # Click the copy button
        await page.click('button[aria-label="Copy source code"]')

        # Wait for the "Copied!" button to be visible
        await page.wait_for_selector('button[aria-label="Copied!"]')

        # Take an after screenshot
        await page.screenshot(path="/home/jules/verification/screenshots/after_copy.png")

        # Clean up
        await context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
