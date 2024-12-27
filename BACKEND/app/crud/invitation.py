from sqlalchemy.orm import Session
from datetime import datetime
from app.models.invitation import Invitation
from uuid import uuid4

class CRUDInvitation:
    def create_invitation(self, db: Session, email: str, project_id: int, role: str , user_id: int) -> Invitation:
        token = str(uuid4())  # Generate a unique token
        invitation = Invitation(
            email=email,
            project_id=project_id,
            role=role,
            token=token,
            user_id=user_id
        )
        db.add(invitation)
        db.commit()
        db.refresh(invitation)
        return invitation

    def get_invitation_by_token(self, db: Session, token: str) -> Invitation | None:
        return db.query(Invitation).filter(Invitation.token == token).first()

    def accept_invitation(self, db: Session, token: str) -> Invitation | None:
        invitation = self.get_invitation_by_token(db, token)
        if invitation and not invitation.accepted and invitation.expiry_date > datetime.utcnow():
            invitation.accepted = True
            db.commit()
            db.refresh(invitation)
        return invitation

crud_invitation = CRUDInvitation()
