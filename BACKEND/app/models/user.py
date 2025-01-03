# user models - represent a user
from sqlalchemy import Column , Integer , String 
from app.db.base_class import Base;
from sqlalchemy.orm import relationship


from sqlalchemy import Column, Integer, String

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    projects = relationship("Project" , back_populates = "owner")
    tasks_assigned = relationship("Task" , back_populates="assigned_to")
    comments = relationship("Comment" , back_populates="user")
    roles = relationship("UserRole" , back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    watching_tasks = relationship("TaskWatcher" , back_populates="user")
    
    invitations = relationship("Invitation", back_populates="user")  # Example
