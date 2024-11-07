from fastapi import FastAPI;
from app.api.v1.endpoints import router as api_router
from app.api.routes import router as project_router
from app.api.taskRoutes import router as task_router
from app.api.usersRoutes import router as user_router
from app.api.analyticsTask import router as analytics_task_router
from app.api.analyticsProject import router as analytics_project_router
from fastapi.middleware.cors import CORSMiddleware
from app.auth.oauth import router as oauth_router
from app.api.tagging import router as tagging_outer
from app.api.reminders import router as reminder_router
from app.api.comments import router as comment_router
from app.api.notifications import router as notifications_router
from app.api.time_tracking import router as time_tracking_router
from app.api.label_routes import router as label_router
from app.api.watcherRouter import router as task_watcher
from app.auth.azure_auth import  azure_router
from starlette.middleware.sessions import SessionMiddleware






app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this based on your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key="fea8687e-70cc-49fb-bdff-1d4e4747d126")



app.include_router(api_router , prefix = "/api/v1")
app.include_router(oauth_router, prefix="/api/v1")
app.include_router(comment_router , prefix="/api/v1")
app.include_router(project_router , prefix = "/api/v1/projects")
app.include_router(task_router , prefix = "/api/v1/projects")
app.include_router(user_router , prefix="/api/v1")
app.include_router(analytics_task_router , prefix = "/api/v1/analytics")
app.include_router(analytics_project_router , prefix = "/api/v1/analytics")
app.include_router(reminder_router , prefix="/api/v1/reminders")
app.include_router(tagging_outer , prefix="/api/v1")
app.include_router(notifications_router , prefix="/api/v1")
app.include_router(time_tracking_router , prefix="/api/v1")
app.include_router(azure_router , prefix="/api/v1")
app.include_router(label_router , prefix="/api/v1")
app.include_router(task_watcher , prefix="/api/v1")