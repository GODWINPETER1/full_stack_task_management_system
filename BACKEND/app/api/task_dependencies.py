from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.taskDependency import TaskDependency
from app.models.task import Task
from app.schemas.taskDependency import TaskDependencyCreate, TaskDependencyRead
from app.db.session import get_db

router = APIRouter()

@router.post("/tasks/{task_id}/dependencies", response_model=TaskDependencyRead)
def add_dependency(
    task_id: int, 
    dependency: TaskDependencyCreate, 
    db: Session = Depends(get_db)
):
    # Check if both tasks exist
    task = db.query(Task).filter(Task.id == task_id).first()
    dependent_task = db.query(Task).filter(Task.id == dependency.dependent_task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if not dependent_task:
        raise HTTPException(status_code=404, detail="Dependent task not found")

    # Add dependency
    task_dependency = TaskDependency(
        task_id=task_id,  # Use task_id from the path
        dependent_task_id=dependency.dependent_task_id
    )
    db.add(task_dependency)
    db.commit()
    db.refresh(task_dependency)

    return task_dependency

@router.get("/tasks/{task_id}/dependencies", response_model=List[TaskDependencyRead])
def get_dependencies(task_id: int, db: Session = Depends(get_db)):
    return db.query(TaskDependency).filter(TaskDependency.task_id == task_id).all()

@router.delete("/tasks/dependencies/{dependency_id}", response_model=TaskDependencyRead)
def remove_dependency(dependency_id: int, db: Session = Depends(get_db)):
    dependency = db.query(TaskDependency).filter(TaskDependency.id == dependency_id).first()
    if not dependency:
        raise HTTPException(status_code=404, detail="Dependency not found")
    
    db.delete(dependency)
    db.commit()
    return dependency
