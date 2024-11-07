from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.task import TaskCreate, TaskUpdate, Task as TaskSchema
from app.models.task import Task
from app.models.label import Label
from app.models.project import Project
from app.models.task_tag import TaskTag
from app.models.user import User
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.api.dependencies import has_permission  # Import the permission check

router = APIRouter()

# Create a task (Only Admins and Editors should be able to create tasks)
# Updated create_task_for_project

@router.post("/{project_id}/tasks", response_model=TaskSchema)
def create_task_for_project(
    project_id: int, 
    task: TaskCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user),
    permission_check: bool = Depends(has_permission("create_task"))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_task = Task(**task.dict(exclude={"dependencies"}), project_id=project_id, assigned_to_id=current_user.id)
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    
    # add dependencies if any
    if task.dependencies:
        dependency_ids = task.dependencies
        dependencies = db.query(Task).filter(Task.id.in_(dependency_ids)).all()
        if len(dependencies) != len(dependency_ids):
            raise HTTPException(status_code=404 , detail="One or more dependencies not found")
        
        new_task.dependencies.extend(dependencies)
        db.commit()
    return new_task


# Read all tasks for a project (Viewers, Editors, and Admins can view tasks)
@router.get("/{project_id}/tasks", response_model=List[TaskSchema])
def read_tasks_for_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    permission_check: bool = Depends(has_permission("view_task"))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only return tasks assigned to or tagged for the current user within this project
    tasks = (
        db.query(Task)
        .join(TaskTag, Task.id == TaskTag.task_id, isouter=True)  # Join TaskTag for tagged tasks
        .filter(Task.project_id == project_id)
        .filter(
            (Task.assigned_to_id == current_user.id) |  # Assigned tasks
            (TaskTag.user_id == current_user.id)         # Tagged tasks
        )
        .all()
    )
    return tasks




# Update a task (Only Editors and Admins should be able to update tasks)


@router.put("/tasks/{task_id}", response_model=TaskSchema)
def update_task(
    task_id: int, 
    task_update: TaskUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user),
    permission_check: bool = Depends(has_permission("edit_task"))
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.assigned_to_id != current_user.id and not permission_check:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(task, key, value)
    
    db.commit()
    db.refresh(task)
    return task


# Delete a task (Only Admins should be able to delete tasks)
@router.delete("/tasks/{task_id}", response_model=dict)
def delete_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    permission_check: bool = Depends(has_permission("delete_task"))  # Restrict deletion by permission
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

@router.post("/tasks/{task_id}/labels/{label_id}")
def assign_label_to_task(task_id: int, label_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    label = db.query(Label).filter(Label.id == label_id).first()
    if not task or not label:
        raise HTTPException(status_code=404, detail="Task or Label not found")
    task.labels.append(label)
    db.commit()
    return {"detail": "Label assigned to task"}

@router.delete("/tasks/{task_id}/labels/{label_id}")
def remove_label_from_task(task_id: int, label_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    label = db.query(Label).filter(Label.id == label_id).first()
    if not task or not label:
        raise HTTPException(status_code=404, detail="Task or Label not found")
    task.labels.remove(label)
    db.commit()
    return {"detail": "Label removed from task"}
