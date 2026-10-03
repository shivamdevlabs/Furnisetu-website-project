from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.settings import BusinessSettingsSchema, SettingsUpdate

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.get("", response_model=BusinessSettingsSchema)
async def get_settings(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Public endpoint: Get active business contact information, hours, location, and site copy.
    """
    doc = await db.settings.find_one({"key": "general"})
    if not doc:
        # Return default initialized configuration
        return BusinessSettingsSchema()
    return BusinessSettingsSchema(**doc.get("data", {}))


@router.put("", response_model=BusinessSettingsSchema)
async def update_settings(
    payload: SettingsUpdate,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Update business contact information, address, business hours, and copy.
    """
    now = datetime.now(timezone.utc)
    settings_dict = payload.settings.model_dump()

    await db.settings.update_one(
        {"key": "general"},
        {
            "$set": {
                "key": "general",
                "data": settings_dict,
                "updated_at": now
            }
        },
        upsert=True
    )
    return BusinessSettingsSchema(**settings_dict)
