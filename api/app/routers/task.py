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

@router.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, updated_task: Task, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.title = updated_task.title
    task.description = updated_task.description
    session.add(task)
    session.commit()
    session.refresh(task)
    return task