from fastapi import Depends, FastAPI

from app.routers import auth, messages

app = FastAPI()
app.include_router(auth.router)
app.include_router(messages.router)
