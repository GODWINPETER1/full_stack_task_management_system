# user models - represent a user
from sqlalchemy import Column , Integer , String 
from app.db.base_class import Base;

class User(Base):
    # define the name of the table
    __tablename__ = "users"
    
    id = Column(Integer , primary_key = True , index = True)
    name = Column(String , index = True)
    email = Column(String , unique = True , index = True)
    hashed_password = Column(String)
    