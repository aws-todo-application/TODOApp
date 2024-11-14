# api/app/routers/task.py
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from ..models.task import Task
from ..database import get_session

router = APIRouter()

@router.post("/tasks", response_model=Task)
async def create_task(task: Task, session: Session = Depends(get_session)):
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/tasks", response_model=list[Task])
async def read_tasks(session: Session = Depends(get_session)):
    tasks = session.exec(select(Task)).all()
    return tasks

