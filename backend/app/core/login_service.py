# app/core/login_service.py

from fastapi import HTTPException
from app.core.browser_helper import BrowserHelper
from app.core.agentql_wrapper import AgentQLWrapper
from app.core.custom_exceptions import (
    InvalidSessionError,
    TokenExpiredError,
    InvalidTokenError,
    LoginFailedError,
)
from app.core.config import Config
from app.core.token_service import TokenService
import logging

logger = logging.getLogger(__name__)


class LoginService:
    LOGIN_URL = "https://www.instagram.com/"
    SESSION_TTL = Config.ACCESS_TOKEN_EXPIRATION_MINUTES * 60

    def __init__(self, session_service, token_service):
        self.session_service = session_service
        self.token_service = token_service

    # Define AgentQL queries as class attributes
    LOGIN_QUERY = """
    {
        login_indicator (text='Log In')
        signup_indicator (text='Sign Up')
        login_form {
            username_input
            password_input
            login_button
        }
        error_message (class='eiCW-')
    }
    """

    POST_LOGIN_QUERY = """
    {
        home_button (aria-label='Home' or text='Home')
        messages_button (aria-label='Messages' or text='Messages')
    }
    """

    SAVE_INFO_PROMPT_QUERY = """
    {
        save_info_button (text='Save Info' or text='Save information' or text='Save')
        not_now_button (text='Not now' or text='Not Now')
    }
    """

    async def login(self, username: str, password: str):
        try:
            logger.info(f"Starting login for user {username}")
            self.session_service.delete_session(
                username
            )  # Clear existing session if any

            # Create a stealth browser page and wrap it with AgentQL
            context, page = await BrowserHelper.create_stealth_page()
            wrapped_page = await AgentQLWrapper.wrap_async(page)

            # Navigate to the login URL
            await AgentQLWrapper.goto(wrapped_page, self.LOGIN_URL)
            await BrowserHelper.random_scroll(page)
            await AgentQLWrapper.wait_for_page_ready_state(wrapped_page)
            logger.info(f"Login page loaded for {username}")

            # Query login elements
            response = await AgentQLWrapper.query_elements(
                wrapped_page, self.LOGIN_QUERY
            )
            if not response.login_indicator:
                logger.warning(f"Login indicator not found for user {username}")
                raise LoginFailedError("Login form not detected on page load")

            # Perform login actions
            await BrowserHelper.human_type(response.login_form.username_input, username)
            await BrowserHelper.random_delay()
            await BrowserHelper.human_type(response.login_form.password_input, password)
            await BrowserHelper.random_delay()
            await response.login_form.login_button.click()
            await AgentQLWrapper.wait_for_page_ready_state(wrapped_page)
            logger.info(f"Login form submitted for user {username}")

            # Check for successful login and handle prompts
            save_info_response = await AgentQLWrapper.query_elements(
                wrapped_page, self.SAVE_INFO_PROMPT_QUERY
            )
            post_login_response = await AgentQLWrapper.query_elements(
                wrapped_page, self.POST_LOGIN_QUERY
            )
            if (
                not post_login_response.home_button
                and not post_login_response.messages_button
                and not save_info_response.save_info_button
            ):
                logger.error(f"Login failed for {username}: home button not found")
                raise LoginFailedError("Unable to confirm successful login.")

            # Save session and tokens
            session_state = await context.storage_state()
            self.session_service.save_session(
                username, session_state, ttl=self.SESSION_TTL
            )
            access_token, refresh_token = self.generate_jwt_tokens(username)
            self.session_service.save_session(
                f"{username}_refresh_token",
                refresh_token,
                ttl=Config.REFRESH_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60,
            )
            logger.info(f"Login successful for user {username}")

            return {
                "status": "Login successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
            }

        except LoginFailedError as login_exc:
            logger.error(f"Login failed for {username}: {login_exc.detail}")
            raise login_exc
        except Exception as e:
            logger.exception(f"Unexpected error during login for {username}: {str(e)}")
            raise HTTPException(
                status_code=500, detail="An unexpected error occurred during login"
            )
        finally:
            await context.close()
            logger.info(f"Browser context for {username} closed after login attempt")
