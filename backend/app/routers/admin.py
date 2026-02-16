from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user  import User
from app.core.auth import create_access_token
from app.core.deps import get_current_user
from app.core.security import hash_password

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/create-admin")
def create_admin(
    email: str,
    password: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    admin = User(
        name="Admin",
        email=email,
        password=hash_password(password),
        role="admin"
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {"message": "Admin created", 
            "email": admin.email,
            "role": admin.role
            }
