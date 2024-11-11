from app.routers import auth, messages
from fastapi import Depends, FastAPI

app = FastAPI()
app.include_router(auth.router)
app.include_router(messages.router)
