from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.routers import auth, messages

app = FastAPI()




app.add_middleware(
    CORSMiddleware,
    # all origins
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],    # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],    # Allow all headers
)
app.include_router(auth.router)
app.include_router(messages.router)
