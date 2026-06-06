from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:4173/beautiful-mermaid-tool/")
    page.wait_for_timeout(500)

    # Wait for the save button to be ready
    save_btn = page.locator('button[aria-label="Save Chart"]')
    save_btn.wait_for(state="visible")

    # Click the save button to trigger the visual feedback
    save_btn.click()
    page.wait_for_timeout(500) # Wait for checkmark icon to appear

    # Take a screenshot while the checkmark is visible
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")

    # Wait for the checkmark to revert back to the save icon (2000ms timeout + buffer)
    page.wait_for_timeout(2000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
