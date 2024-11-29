from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.invitation import InvitationCreate, InvitationRead
from app.crud.invitation import crud_invitation
from app.db.session import get_db
from app.utils.email_utilis import send_invitation_email

router = APIRouter()

@router.post("/projects/{project_id}/invite")
async def invite_to_project(project_id: int,role: str, invitation: InvitationCreate, db: Session = Depends(get_db)):
    try:
        # Save invitation to the database
        new_invitation = crud_invitation.create_invitation(db=db, project_id=project_id, email=invitation.email,role=role)
        db.commit()

        # Generate email content
        subject = "You have been invited to a project!"
        body = f"""
        Hi,

        You have been invited to join the project: {new_invitation.project_id}.
        
        Click the link below to accept the invitation:
        http://frontend-url.com/accept-invite?email={invitation.email}

        Best regards,
        Your Task Management Team
        """

        # Send email
        await send_invitation_email(invitation.email, subject, body)

        return {"message": "Invitation sent successfully!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to send invitation: {str(e)}")

@router.get("/invitations/{token}", response_model=InvitationRead)
def get_invitation(token: str, db: Session = Depends(get_db)):
    invitation = crud_invitation.get_invitation_by_token(db, token=token)
    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")
    return invitation

@router.post("/invitations/{token}/accept", response_model=InvitationRead)
def accept_invitation(token: str, db: Session = Depends(get_db)):
    invitation = crud_invitation.accept_invitation(db, token=token)
    if not invitation:
        raise HTTPException(status_code=400, detail="Invalid or expired invitation token")
    return invitation
