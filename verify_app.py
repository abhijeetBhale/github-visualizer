from playwright.sync_api import sync_playwright
import time

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        # Listen for console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"Browser Error: {exc}"))

        try:
            page.goto("http://localhost:5173", timeout=10000)
            # Wait for content to load
            page.wait_for_selector("text=Repo Visualizer", timeout=5000)

            # Check for the input field using the correct ID
            page.wait_for_selector("input#repoPath")

            time.sleep(2)
            page.screenshot(path="final_state.png")
            print("Verification successful: App loads and renders initial UI.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="error_state.png")

        browser.close()

if __name__ == "__main__":
    verify()
