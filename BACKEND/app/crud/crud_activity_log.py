from sqlalchemy.orm import Session
from app.models.activity_log import ActivityLog

class CRUDActivityLog:
    def create_log(self, db: Session, user_id: int, action: str, details: str = None):
        log_entry = ActivityLog(user_id=user_id, action=action, details=details)
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

crud_activity_log = CRUDActivityLog()
