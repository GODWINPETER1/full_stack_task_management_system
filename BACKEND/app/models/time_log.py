# app/models/time_log.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Interval
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime

class TimeLog(Base):
    __tablename__ = "time_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration = Column(Interval, nullable=True)  # Optional; can be calculated

    task = relationship("Task", back_populates="time_logs")
    user = relationship("User")
