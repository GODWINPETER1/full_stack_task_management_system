from sqlalchemy import Column , Integer , String , ForeignKey , DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer , primary_key=True , index=True)
    task_id = Column(Integer , ForeignKey("tasks.id"))
    reminder_time = Column(DateTime , nullable=False)
    
    task = relationship("Task" , back_populates="reminders")
    