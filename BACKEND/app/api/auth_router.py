# from fastapi import APIRouter, Depends, Request, HTTPException
# from starlette.responses import RedirectResponse
# from app.azure_auth.azure import AzureAuthProvider
# from app.models.user import User  # Import your User model
# from app.db.session import get_db  # Database session
# from sqlalchemy.orm import Session

# router = APIRouter()
# azure_auth = AzureAuthProvider()

# @router.get("/auth/microsoft/login")
# async def microsoft_login():
#     """Redirect user to Microsoft login page"""
#     auth_url = await azure_auth.get_auth_url()
#     return RedirectResponse(auth_url)

# @router.get("/auth/microsoft/callback")
# async def microsoft_callback(request: Request, db: Session = Depends(get_db)):
#     """Handle callback from Microsoft after user login"""
#     # Log all query parameters for debugging
#     query_params = request.query_params
#     print("Query parameters received:", query_params)

#     code = query_params.get("code")
#     if not code:
#         raise HTTPException(status_code=400, detail="Authorization code missing")

#     try:
#         # Exchange code for token and fetch user info
#         user_info = await azure_auth.get_user_info(auth_token=code)
#     except HTTPException as e:
#         print("Error during token exchange:", e.detail)
#         raise

#     # Check if user exists in the database
#     user = db.query(User).filter(User.email == user_info["email"]).first()
#     if not user:
#         # Register a new user if they don't exist
#         user = User(username=user_info["username"], email=user_info["email"])
#         db.add(user)
#         db.commit()
#         db.refresh(user)

#     # Generate and return a JWT token for the user (this part is left for you to implement)
#     return {"message": "Login successful", "user": user_info}

