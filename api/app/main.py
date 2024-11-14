from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, task
from .database import create_db_and_tables

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include authentication router
app.include_router(auth.router)
app.include_router(task.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}