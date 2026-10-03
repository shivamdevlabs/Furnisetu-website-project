from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.schemas.auth import Token, UserLogin, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Authenticate admin credentials and issue a signed JWT Bearer token.
    """
    email = credentials.email.lower().strip()
    user = await db.users.find_one({"email": email})

    if not user:
        # Check if this is the very first startup matching default admin env credentials
        if (
            email == settings.DEFAULT_ADMIN_EMAIL.lower()
            and credentials.password == settings.DEFAULT_ADMIN_PASSWORD
        ):
            # Auto-seed the initial admin securely
            now = datetime.now(timezone.utc)
            new_user = {
                "name": settings.DEFAULT_ADMIN_NAME,
                "email": email,
                "password_hash": hash_password(credentials.password),
                "role": "admin",
                "is_active": True,
                "created_at": now,
                "updated_at": now
            }
            res = await db.users.insert_one(new_user)
            user = new_user
            user["_id"] = res.inserted_id
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

    if not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    # Issue JWT token
    token_payload = {
        "sub": user["email"],
        "user_id": str(user["_id"]),
        "role": user.get("role", "admin")
    }
    access_token = create_access_token(data=token_payload)

    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user_name=user.get("name", "Admin"),
        user_email=user["email"],
        user_role=user.get("role", "admin")
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get profile information of the currently authenticated administrator.
    """
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user.get("name", "Admin"),
        email=current_user["email"],
        role=current_user.get("role", "admin"),
        is_active=current_user.get("is_active", True),
        created_at=current_user.get("created_at")
    )
