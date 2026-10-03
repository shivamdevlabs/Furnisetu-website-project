from typing import Optional
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.security import decode_access_token
from app.dependencies.database import get_db

security_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> dict:
    """
    Validates the JWT token from the Authorization header and returns the current user document.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject invalid.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact the administrator.",
        )

    user["_id"] = str(user["_id"])
    return user


async def require_admin(
    current_user: dict = Depends(get_current_user)
) -> dict:
    """
    Ensures the authenticated user has the 'admin' role.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required.",
        )
    return current_user
