# app/core/agentql_wrapper.py

import agentql
from playwright.async_api import Page


class AgentQLWrapper:
    @staticmethod
    async def wrap_async(page: Page):
        """
        Wraps a Playwright page object with AgentQL for querying.

        Args:
            page (Page): The Playwright page object to be wrapped.

        Returns:
            wrapped_page: The page wrapped with AgentQL for asynchronous use.
        """
        return await agentql.wrap_async(page)

    @staticmethod
    async def query_elements(wrapped_page, query: str):
        """
        Queries elements on the page using AgentQL.

        Args:
            wrapped_page: The page object wrapped with AgentQL.
            query (str): The AgentQL query string to locate elements.

        Returns:
            response: The result of the AgentQL query, containing the requested elements.
        """
        return await wrapped_page.query_elements(query)

    @staticmethod
    async def goto(wrapped_page, url: str):
        """
        Navigates the wrapped page to a specified URL.

        Args:
            wrapped_page: The page object wrapped with AgentQL.
            url (str): The URL to navigate to.
        """
        await wrapped_page.goto(url)

    @staticmethod
    async def wait_for_page_ready_state(wrapped_page):
        """
        Waits until the page reaches a ready state (fully loaded).

        Args:
            wrapped_page: The page object wrapped with AgentQL.
        """
        await wrapped_page.wait_for_load_state("networkidle")
