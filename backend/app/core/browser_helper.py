import random
import asyncio
from playwright.async_api import async_playwright, Geolocation, ProxySettings
from app.core.config import Config
from app.core.agentql_wrapper import AgentQLWrapper 

import os

class BrowserHelper:

    _playwright = None
    _browser = None

    @staticmethod
    async def initialize_playwright():
        if not BrowserHelper._playwright:
            BrowserHelper._playwright = await async_playwright().start()
        if not BrowserHelper._browser:
            BrowserHelper._browser = await BrowserHelper._playwright.chromium.launch(
                headless=False,
                args=Config.BROWSER_ARGS,
                ignore_default_args=Config.BROWSER_IGNORED_ARGS,
            )

    @staticmethod
    async def create_stealth_page(session_data: dict = None):
        await BrowserHelper.initialize_playwright()

        # Configure context options
        context_options = {
            "locale": random.choice(Config.ACCEPT_LANGUAGES).split(",")[0],
            "user_agent": random.choice(Config.USER_AGENTS),
            "viewport": {
                "width": 1920 + random.randint(-50, 50),
                "height": 1080 + random.randint(-50, 50),
            },
            "geolocation": random.choice(Config.LOCATIONS)[1],
        }

        # Use `storage_state` directly if `session_data` is provided as a dictionary
        if session_data:
            context_options["storage_state"] = session_data

        # Optionally, use proxy settings if defined in Config
        if Config.PROXIES:
            context_options["proxy"] = random.choice(Config.PROXIES)

        # Create browser context with options
        context = await BrowserHelper._browser.new_context(**context_options)
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        # Open a new page in the context
        page = await context.new_page()
        
        # Perform random scroll on the page for stealth
        await BrowserHelper.random_scroll(page)
        
        return context, page

    @staticmethod
    async def random_scroll(page, num_scrolls=3):
        for _ in range(num_scrolls):
            await page.mouse.wheel(0, random.randint(100, 300))
            await asyncio.sleep(random.uniform(0.5, 1.5))

    @staticmethod
    async def random_delay(min_delay: int = 500, max_delay: int = 1500):
        await asyncio.sleep(random.randint(min_delay, max_delay) / 1000)

    @staticmethod
    async def close_browser():
        if BrowserHelper._browser:
            await BrowserHelper._browser.close()
            BrowserHelper._browser = None
        if BrowserHelper._playwright:
            await BrowserHelper._playwright.stop()
            BrowserHelper._playwright = None

    @staticmethod
    async def human_type(element, text):
        for char in text:
            await element.type(char)
            await asyncio.sleep(random.uniform(0.05, 0.15))

    @staticmethod
    async def random_mouse_move(page, num_moves=5):
        for _ in range(num_moves):
            x = random.randint(0, 1920)
            y = random.randint(0, 1080)
            await page.mouse.move(x, y)
            await asyncio.sleep(random.uniform(0.5, 1.5))
