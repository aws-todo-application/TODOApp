from fastapi import APIRouter

router = APIRouter()

# Define your routes here, e.g.,
@router.get("/auth")
async def auth_example():
    return {"message": "This is an example endpoint"}
