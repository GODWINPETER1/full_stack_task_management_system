from pydantic import BaseModel

class TaskAnalyticsResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    task_progress: float


class ProjectAnalyticsResponse(BaseModel):
    total_projects: int
    active_projects: int
    completed_projects: int