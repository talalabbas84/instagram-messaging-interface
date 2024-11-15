import logging
import os
import redis
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class RedisHelper:
    """Helper class to manage Redis interactions for session data."""

    # Configuration for Redis based on environment variables
    REDIS_ENABLED = os.getenv("REDIS_ENABLED", "true").lower() == "true"
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))

    def __init__(self):
        self.client = None
        self.connect_redis()  # Attempt connection on initialization

    def connect_redis(self):
        """Establishes a connection to Redis if enabled in the environment settings."""
        try:
            if RedisHelper.REDIS_ENABLED:
                # Create a Redis client instance
                self.client = redis.Redis(
                    host=RedisHelper.REDIS_HOST,
                    port=RedisHelper.REDIS_PORT,
                    decode_responses=True,
                )
                logger.info(f"Connected to Redis at {RedisHelper.REDIS_HOST}:{RedisHelper.REDIS_PORT}")
            else:
                logger.warning("Redis is disabled in environment variables.")
                self.client = None
        except redis.exceptions.ConnectionError as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            raise HTTPException(status_code=503, detail="Could not connect to Redis. Please try again later.")

    def set_session(self, key, value, expiration=None):
        """Stores session data in Redis with an optional expiration time."""
        try:
            if not self.client:
                raise HTTPException(status_code=503, detail="Redis client is not available.")
            self.client.set(key, value, ex=expiration)
            logger.info(f"Session for {key} saved to Redis.")
        except redis.exceptions.ConnectionError as e:
            logger.error(f"Redis connection error: {e}")
            raise HTTPException(status_code=503, detail="Temporary server issue. Please try again later.")
        except Exception as e:
            logger.error(f"Error saving session for {key}: {str(e)}")
            raise HTTPException(status_code=500, detail="Error saving session.")

    def get_session(self, key):
        """Retrieves session data from Redis based on a given key."""
        try:
            if not self.client:
                raise HTTPException(status_code=503, detail="Redis client is not available.")
            return self.client.get(key)
        except redis.RedisError as e:
            logger.error(f"Error retrieving session for {key}: {str(e)}")
            raise HTTPException(status_code=503, detail="Error retrieving session data.")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(status_code=500, detail="Error retrieving session.")

    def delete_session(self, key):
        """Deletes session data from Redis for the specified key."""
        try:
            if not self.client:
                raise HTTPException(status_code=503, detail="Redis client is not available.")
            self.client.delete(key)
            logger.info(f"Session for {key} deleted from Redis.")
        except Exception as e:
            logger.error(f"Error deleting session for {key}: {str(e)}")
            raise HTTPException(status_code=500, detail="Error deleting session.")
