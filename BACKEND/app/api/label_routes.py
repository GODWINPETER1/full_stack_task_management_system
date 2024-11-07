from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.label import LabelCreate, Label
from app.crud.crud_label import create_label, get_labels, delete_label
from app.db.session import get_db
from typing import List

router = APIRouter()

@router.post("/labels", response_model=Label)
def create_label_endpoint(label: LabelCreate, db: Session = Depends(get_db)):
    return create_label(db=db, label=label)

@router.get("/labels", response_model=List[Label])
def get_labels_endpoint(db: Session = Depends(get_db)):
    return get_labels(db=db)

@router.delete("/labels/{label_id}")
def delete_label_endpoint(label_id: int, db: Session = Depends(get_db)):
    success = delete_label(db=db, label_id=label_id)
    if not success:
        raise HTTPException(status_code=404, detail="Label not found")
    return {"detail": "Label deleted"}
