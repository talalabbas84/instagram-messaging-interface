import asyncio
import os
import random
from playwright.async_api import async_playwright
from app.core.agentql_wrapper import AgentQLWrapper
from app.core.config import Config

class BrowserHelper:
    """Helper class to manage Playwright browser interactions with stealth techniques for anti-bot detection."""

    _playwright = None
    _browser = None

    @staticmethod
    async def initialize_playwright():
        """Initializes Playwright and launches a Chromium browser instance if not already started."""
        if not BrowserHelper._playwright:
            BrowserHelper._playwright = await async_playwright().start()

        headless_mode = (
            True if os.getenv("RUNNING_IN_DOCKER") == "true"
            else os.getenv("BROWSER_HEADLESS", "true").lower() == "true"
        )

        if not BrowserHelper._browser:
            BrowserHelper._browser = await BrowserHelper._playwright.chromium.launch(
                headless= headless_mode,
                args=Config.BROWSER_ARGS,
                ignore_default_args=Config.BROWSER_IGNORED_ARGS,
            )

    @staticmethod
    async def create_stealth_page(session_data: dict = None):
        """
        Creates a new browser context with random settings for stealth,
        such as user agent, geolocation, and viewport size. It can restore session state if provided.
        """
        await BrowserHelper.initialize_playwright()

        # Configure random context options for stealth
        context_options = {
            "locale": random.choice(Config.ACCEPT_LANGUAGES).split(",")[0],
            "user_agent": random.choice(Config.USER_AGENTS),
            "viewport": {
                "width": 1920 + random.randint(-50, 50),
                "height": 1080 + random.randint(-50, 50),
            },
            "geolocation": random.choice(Config.LOCATIONS)[1],
        }

        # Set session data if provided to restore user session state
        if session_data:
            context_options["storage_state"] = session_data

        # Use proxy if configured in Config
        if Config.PROXIES:
            context_options["proxy"] = random.choice(Config.PROXIES)

        # Create browser context with specified options
        context = await BrowserHelper._browser.new_context(**context_options)
        await context.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
        )

        # Open a new page and apply stealth techniques
        page = await context.new_page()
        await BrowserHelper.random_scroll(page)  # Random scroll to mimic human behavior

        return context, page

    @staticmethod
    async def random_scroll(page, num_scrolls=3):
        """Simulates random scrolling to mimic human activity and reduce bot detection."""
        for _ in range(num_scrolls):
            await page.mouse.wheel(0, random.randint(100, 300))
            await asyncio.sleep(random.uniform(0.5, 1.5))

    @staticmethod
    async def random_delay(min_delay: int = 500, max_delay: int = 1500):
        """Introduces a random delay to make actions appear more human-like."""
        await asyncio.sleep(random.randint(min_delay, max_delay) / 1000)

    @staticmethod
    async def close_browser():
        """Closes the browser and stops Playwright to free up resources."""
        if BrowserHelper._browser:
            await BrowserHelper._browser.close()
            BrowserHelper._browser = None
        if BrowserHelper._playwright:
            await BrowserHelper._playwright.stop()
            BrowserHelper._playwright = None

    @staticmethod
    async def human_type(element, text):
        """Simulates human typing by typing one character at a time with random intervals."""
        for char in text:
            await element.type(char)
            await asyncio.sleep(random.uniform(0.05, 0.15))

    @staticmethod
    async def random_mouse_move(page, num_moves=5):
        """Simulates random mouse movement across the screen to mimic human behavior."""
        for _ in range(num_moves):
            x = random.randint(0, 1920)
            y = random.randint(0, 1080)
            await page.mouse.move(x, y)
            await asyncio.sleep(random.uniform(0.5, 1.5))
