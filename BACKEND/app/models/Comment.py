from sqlalchemy import Column , Integer , String , ForeignKey , DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(Integer , primary_key=True , index=True)
    content = Column(String , nullable=False)
    task_id = Column(Integer , ForeignKey('tasks.id'))
    user_id = Column(Integer , ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    task = relationship("Task" , back_populates="comments")
    user = relationship("User" , back_populates="comments")