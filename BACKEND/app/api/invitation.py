from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session
from app.schemas.invitation import InvitationCreate, InvitationRead
from app.crud.invitation import crud_invitation
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.utils.email_utilis import send_invitation_email
from datetime import datetime

router = APIRouter()

@router.post("/projects/{project_id}/invite")
async def invite_to_project(project_id: int,role: str, invitation: InvitationCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        
        sender_email = current_user["email"]
        sender_id = current_user["id"]
        # Save invitation to the database
        new_invitation = crud_invitation.create_invitation(db=db, project_id=project_id, email=invitation.email,role=role , user_id = sender_id)
        db.commit()

        # Generate email content
        # Generate email content
        subject = "You're Invited to Collaborate on a Project!"

        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }}
                .email-container {{
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }}
                .email-header {{
                    background-color: #0079bf;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                }}
                .email-header h1 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .email-body {{
                    padding: 20px;
                }}
                .email-body h2 {{
                    color: #333333;
                    font-size: 20px;
                }}
                .email-body p {{
                    margin: 10px 0;
                    color: #555555;
                }}
                .email-body a {{
                    display: inline-block;
                    background-color: #0079bf;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 10px;
                    font-weight: bold;
                }}
                .email-body a:hover {{
                    background-color: #005a8f;
                }}
                .email-footer {{
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                    padding: 10px;
                    background-color: #f1f1f1;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Project Invitation</h1>
                </div>
                <div class="email-body">
                    <h2>Hello,</h2>
                    <p>You have been invited to collaborate on the project:</p>
                    <p><strong>{new_invitation.project_id}</strong></p>
                    <p>To join the project, click the button below:</p>
                    <a href="http://B&T.com/accept-invite?email={invitation.email}&token={new_invitation.token}">
                        Accept Invitation
                    </a>
                    <p>If you didn’t expect this invitation, you can safely ignore this email.</p>
                </div>
                <div class="email-footer">
                    <p>&copy; {datetime.now().year} Your Task Management Team</p>
                </div>
            </div>
        </body>
        </html>
        """


        # Send email
        await send_invitation_email(recipient_email=invitation.email , subject=subject , body=body , from_email = sender_email)

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
