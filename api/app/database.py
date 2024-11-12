from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.ext.asyncio import AsyncSession

DATABASE_URL = "postgresql+asyncpg://username:password@localhost/todo_app"

engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session
