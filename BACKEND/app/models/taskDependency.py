from sqlalchemy import Column , Integer , ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class TaskDependency(Base):
    __tablename__ = "task_dependencies"
    id = Column(Integer , primary_key=True , index=True)
    task_id = Column(Integer , ForeignKey("tasks.id" , ondelete="CASCADE"))
    dependent_task_id = Column(Integer , ForeignKey("tasks.id" , ondelete="CASCADE"))
    
    # Relationships 
    task = relationship("Task" , foreign_keys=[task_id])
    dependent_task = relationship("Task" , foreign_keys=[dependent_task_id])