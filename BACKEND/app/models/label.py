from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

# Association table for many-to-many relationship
task_labels = Table(
    'task_labels',
    Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id', ondelete='CASCADE')),
    Column('label_id', Integer, ForeignKey('labels.id', ondelete='CASCADE'))
)

class Label(Base):
    __tablename__ = 'labels'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)

    tasks = relationship("Task", secondary=task_labels, back_populates="labels")
