from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importing routers for authentication and messaging routes
from app.routers import auth, messages

app = FastAPI()

# Configuring CORS settings to allow unrestricted access for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow all origins
    allow_credentials=True,     
    allow_methods=["*"],        # Allow all HTTP methods
    allow_headers=["*"]         # Allow all headers
)

# Including routers for authentication and messaging functionality
app.include_router(auth.router)
app.include_router(messages.router)
