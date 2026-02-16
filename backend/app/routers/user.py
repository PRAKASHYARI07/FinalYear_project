from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
import secrets
from datetime import datetime, timedelta

from app.core.security import hash_password
from app.core.auth import verify_password, create_access_token, SECRET_KEY
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    reset_token: str
    new_password: str


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        hashed_pwd = hash_password(user.password)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Password hashing error: {e!r}")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_pwd,
        role=user.role
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="User with this email already exists")
    except Exception as e:
        db.rollback()
        # Temporarily return exception details to help debugging
        raise HTTPException(status_code=500, detail=f"Server error: {e!r}")

    db.refresh(new_user)
    return new_user


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login endpoint - accepts form data (username=email, password=password)"""
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/token")
def get_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Token endpoint for Swagger UI authorize - uses form data"""
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/debug")
def debug_body(body: dict):
    """Simple echo endpoint to confirm JSON payload parsing."""
    return {"received": body}


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request password reset - generates a reset token"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Don't reveal if email exists or not (security best practice)
        return {"message": "If email exists, reset link has been sent"}
    
    # Generate reset token (valid for 30 minutes)
    reset_token = secrets.token_urlsafe(32)
    reset_expires = datetime.utcnow() + timedelta(minutes=30)
    
    # Store reset token in user (in production, use a separate table)
    user.reset_token = reset_token
    user.reset_token_expires = reset_expires
    db.commit()
    
    # Return token (in production, send via email)
    return {
        "message": "Password reset token generated",
        "reset_token": reset_token,
        "expires_in_minutes": 30
    }


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using reset token"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if reset token exists and is valid
    if not hasattr(user, 'reset_token') or not user.reset_token:
        raise HTTPException(status_code=400, detail="No reset token found. Request a new one.")
    
    if user.reset_token != request.reset_token:
        raise HTTPException(status_code=400, detail="Invalid reset token")
    
    if hasattr(user, 'reset_token_expires') and user.reset_token_expires:
        if datetime.utcnow() > user.reset_token_expires:
            raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Update password
    user.password = hash_password(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password reset successfully. You can now login with your new password."}
