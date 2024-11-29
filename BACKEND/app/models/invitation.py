from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from app.db.base_class import Base

class Invitation(Base):
    __tablename__ = "invitations"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    role = Column(String, default="Viewer")  # Role assigned on acceptance
    token = Column(String, nullable=False, unique=True)  # Unique invitation token
    accepted = Column(Boolean, default=False)
    expiry_date = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(days=7))

    project = relationship("Project", back_populates="invitations")
    user = relationship("User", back_populates="invitations")
