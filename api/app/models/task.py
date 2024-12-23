from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    completed: bool = Field(default=False)
    user_id: str
    priority: Optional[str] = Field(default=None)
    deadline: Optional[date] = None