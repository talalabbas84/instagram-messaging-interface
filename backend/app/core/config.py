# app/utils/config.py
from playwright.async_api import Geolocation, ProxySettings
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # AgentQL API Key
    AGENTQL_API_KEY = os.getenv("AGENTQL_API_KEY")

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")
    JWT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRATION_MINUTES = 15
    REFRESH_TOKEN_EXPIRATION_DAYS = 7

    # Redis Configuration
    REDIS_ENABLED = os.getenv("REDIS_ENABLED", "true").lower() == "true"
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))

    # Encryption Configuration
    ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")

    # Browser and Playwright Configuration
    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0",
    ]
    ACCEPT_LANGUAGES = ["en-US,en;q=0.9", "en-GB,en;q=0.8", "fr-FR,fr;q=0.9"]
    REFERERS = ["https://www.google.com", "https://www.bing.com", "https://duckduckgo.com"]
    BROWSER_IGNORED_ARGS = ["--enable-automation", "--disable-extensions"]
    BROWSER_ARGS = [
        "--disable-xss-auditor",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-infobars",
    ]
    
    LOCATIONS = [
        ("America/New_York", Geolocation(longitude=-74.006, latitude=40.7128)),
        ("America/Chicago", Geolocation(longitude=-87.6298, latitude=41.8781)),
        ("America/Los_Angeles", Geolocation(longitude=-118.2437, latitude=34.0522)),
        ("America/Denver", Geolocation(longitude=-104.9903, latitude=39.7392)),
        ("America/Phoenix", Geolocation(longitude=-112.0740, latitude=33.4484)),
        ("America/Anchorage", Geolocation(longitude=-149.9003, latitude=61.2181)),
        ("America/Detroit", Geolocation(longitude=-83.0458, latitude=42.3314)),
        ("America/Indianapolis", Geolocation(longitude=-86.1581, latitude=39.7684)),
        ("America/Boise", Geolocation(longitude=-116.2023, latitude=43.6150)),
        ("America/Juneau", Geolocation(longitude=-134.4197, latitude=58.3019)),
    ]
    
    PROXIES: list[ProxySettings] = [
        # Example proxy configuration, replace with actual proxies if needed
        # {
        #     "server": "http://ip_server:port",
        #     "username": "proxy_username",
        #     "password": "proxy_password",
        # },
    ]
