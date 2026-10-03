from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_name: str
    user_email: str
    user_role: str


class TokenPayload(BaseModel):
    sub: str  # user email
    user_id: Optional[str] = None
    role: Optional[str] = "admin"
    exp: Optional[int] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str = "admin"


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: Optional[datetime] = None
