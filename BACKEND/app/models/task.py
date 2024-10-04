from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base;




# Task Model
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String , nullable=True)
    status = Column(String)
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey("projects.id"))
    assigned_to_id = Column(Integer , ForeignKey("users.id"))
    
    assigned_to = relationship("User" , back_populates= "tasks_assigned")
    project = relationship("Project", back_populates="tasks")
