from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "citizen"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: Optional[str] = None

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    email: str
    password: str