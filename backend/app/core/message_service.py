from fastapi import HTTPException
import logging
from app.core.browser_helper import BrowserHelper
from app.core.agentql_wrapper import AgentQLWrapper
from app.core.custom_exceptions import InvalidSessionError
import asyncio

logger = logging.getLogger(__name__)

class MessageService:
    def __init__(self, redis_helper, session_service):
        self.redis_helper = redis_helper
        self.session_service = session_service

    PROFILE_QUERY = """
    {
        not_found_indicator (text='Sorry, this page isn\'t available')
        private_indicator (text='This account is private')
        follow_btn (text='Follow')
        three_dot_menu_btn (text='Options')
        posts_tab (text='Posts')
    }
    """

    MESSAGE_QUERY = """
    {
        message_box (aria-label='Message...')
    }
    """

    SEND_BUTTON_QUERY = """
    {
        send_button (aria-label='Send')
    }
    """

    SEND_MESSAGE_MENU_QUERY = """
    {
        send_message_option (text='Send message option in the menu after clicking three dots')
    }
    """

    NOTIFICATION_POPUP_QUERY = """
    {
        notification_prompt {
            not_now_btn (text='Not Now')
        }
    }
    """

    INVITE_MESSAGE_QUERY = """
    {
        invite_sent_message (text='Invite sent')
    }
    """

    async def send_message(self, recipient: str, message: str, username: str):
        logger.info(f"Starting message send to {recipient} from {username}")

        try:
            session_data = await self._get_session_data(username)

            context, page = await BrowserHelper.create_stealth_page(session_data=session_data)
            wrapped_page = await AgentQLWrapper.wrap_async(page)

            await self._navigate_to_inbox(wrapped_page)

            await self._dismiss_notification_popup(wrapped_page)

            if not await self._send_message(wrapped_page, recipient, message):
                raise HTTPException(status_code=500, detail="Message sending failed at unknown point.")
            
            return "success"

        except InvalidSessionError as session_exc:
            logger.error(f"Invalid session for {username}: {session_exc.detail}")
            raise session_exc
        except Exception as e:
            logger.exception(f"Error during message sending for {username} to {recipient}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Message sending failed: {str(e)}")
        finally:
            await context.close()
            logger.info(f"Context for {username} closed after message attempt")

    async def _get_session_data(self, username: str):
        encrypted_session = self.redis_helper.get_session(f"{username}_session")
        if not encrypted_session:
            logger.error(f"No session found for user {username}")
            raise InvalidSessionError("Session not found. Please log in again.")
        return self.session_service.decrypt_session_data(encrypted_session)

    async def _navigate_to_inbox(self, wrapped_page):
        profile_url = "https://www.instagram.com/direct/inbox/"
        await AgentQLWrapper.goto(wrapped_page, profile_url)
        logger.info(f"Navigated to {profile_url}")

        await BrowserHelper.random_delay(4000, 6000)

    async def _dismiss_notification_popup(self, wrapped_page):
        notification_response = await AgentQLWrapper.query_elements(wrapped_page, self.NOTIFICATION_POPUP_QUERY)
        if notification_response.notification_prompt and notification_response.notification_prompt.not_now_btn:
            await notification_response.notification_prompt.not_now_btn.click()
            logger.info("Dismissed notification popup")
            await BrowserHelper.random_delay(1000, 1500)

    async def _send_message(self, wrapped_page, recipient: str, message: str):
        # Open send message dialog
        send_message_button = await AgentQLWrapper.query_elements(wrapped_page, self.SEND_BUTTON_QUERY)
        if not send_message_button.send_button:
            logger.error("Send message button not found.")
            return False

        await send_message_button.send_button.click()
        logger.info("Send message button clicked")
        await BrowserHelper.random_delay(1000, 1500)

        # Type recipient's username
        recipient_input_response = await wrapped_page.query_elements("""
        {
            recipient_input (placeholder='Search...')
        }
        """)
        if not recipient_input_response.recipient_input:
            logger.error("Recipient input field not found.")
            return False
        
        await BrowserHelper.human_type(recipient_input_response.recipient_input, recipient)
        logger.info(f"Typed recipient username: {recipient}")
        await BrowserHelper.random_delay(1000, 1500)

        # Select the recipient from suggestions
        chat_suggestion_response = await wrapped_page.query_elements("""
    {
        chat_suggestion (role='button')
    }
""")
        if not chat_suggestion_response.chat_suggestion:
            logger.error(f"No chat suggestion found for {recipient}")
            return False
        print(chat_suggestion_response)
        await chat_suggestion_response.chat_suggestion.click()
        logger.info(f"Clicked on chat suggestion for {recipient}")

        chat_button_query = """
                          {
                              chat_button (text='Chat')
                          }
                          """
        chat_button_response = await wrapped_page.query_elements(chat_button_query)
        if chat_button_response.chat_button:
            await chat_button_response.chat_button.click()
            logger.info("Chat button clicked")

        # Check if invite is sent
        invite_message_response = await wrapped_page.query_elements(self.INVITE_MESSAGE_QUERY)
        if invite_message_response.invite_sent_message:
            logger.error("Invite sent. Cannot send more messages until the invite is accepted.")
            raise HTTPException(status_code=403, detail="Invite sent. Cannot send more messages until the invite is accepted.")

        # Locate message box and send the message
        message_response = await wrapped_page.query_elements(self.MESSAGE_QUERY)
        if not message_response.message_box:
            await BrowserHelper.random_delay(2000, 3000)
            await BrowserHelper.random_scroll(wrapped_page)
            message_response = await wrapped_page.query_elements(self.MESSAGE_QUERY)

        if message_response.message_box:
            await BrowserHelper.human_type(message_response.message_box, message)
            await BrowserHelper.random_delay(1000, 1500)

            # Send the message
            send_button_response = await AgentQLWrapper.query_elements(wrapped_page, self.SEND_BUTTON_QUERY)
            for _ in range(3):
                if send_button_response.send_button:
                    await send_button_response.send_button.click()
                    await BrowserHelper.random_delay(3000, 5000)
                    logger.info("Message sent successfully")
                    return True
                await BrowserHelper.random_delay(1000, 2000)
                send_button_response = await AgentQLWrapper.query_elements(wrapped_page, self.SEND_BUTTON_QUERY)

        return False
