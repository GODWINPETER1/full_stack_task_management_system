# A base class is Base class that all your SQLAlchemy models will inherit from. This Base
# class is usually an instance of declarative_base(), a factory function from SQLAlchemy that return a base
# class for declaration class definitions

from sqlalchemy.ext.declarative import as_declarative, declared_attr

@as_declarative()
class Base:
    id: int
    __name__: str

    # Automatically generate table names in lowercase
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
