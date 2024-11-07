from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base  # Assuming this is your base class for models

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # Role name (Admin, Editor, Viewer)
    
    users = relationship("UserRole" , back_populates="role")
    

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # Permission name (e.g., create_task, edit_project)

class UserRole(Base):
    __tablename__ = "user_roles"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)  # Reference to User table
    role_id = Column(Integer, ForeignKey("roles.id"), primary_key=True)  # Reference to Role table
    
    user = relationship("User" , back_populates="roles")
    role = relationship("Role" , back_populates="users")
    
class RolePermission(Base):
    __tablename__ = "role_permissions"
    role_id = Column(Integer, ForeignKey("roles.id"), primary_key=True)  # Reference to Role table
    permission_id = Column(Integer, ForeignKey("permissions.id"), primary_key=True)  # Reference to Permission table
