from pydantic import BaseModel

class TaskDependencyBase(BaseModel):
    dependent_task_id: int  # Only dependent_task_id is required in the request body

class TaskDependencyCreate(TaskDependencyBase):
    pass

class TaskDependencyRead(TaskDependencyBase):
    id: int
    task_id: int  # Include task_id in the response

    class Config:
        orm_mode = True
