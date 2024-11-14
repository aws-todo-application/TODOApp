from sqlmodel import create_engine, SQLModel, Session
from sqlalchemy.ext.asyncio import AsyncSession

DATABASE_URL = "postgresql://postgres:password@db:5432/todoApp_db"

engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
