from fastapi import FastAPI
from .routers import auth

app = FastAPI()

# Include authentication router
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}