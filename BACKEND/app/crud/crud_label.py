from sqlalchemy.orm import Session
from app.models.label import Label
from app.schemas.label import LabelCreate

def create_label(db: Session, label: LabelCreate):
    db_label = Label(**label.dict())
    db.add(db_label)
    db.commit()
    db.refresh(db_label)
    return db_label

def get_labels(db: Session):
    return db.query(Label).all()

def delete_label(db: Session, label_id: int):
    db_label = db.query(Label).filter(Label.id == label_id).first()
    if db_label:
        db.delete(db_label)
        db.commit()
        return True
    return False
