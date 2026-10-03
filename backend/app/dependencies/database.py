from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import db_manager


async def get_db() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency that returns the active MongoDB database.
    If MongoDB is unavailable, raises 503 HTTP status.
    """
    if db_manager.db is None or not db_manager.is_connected:
        # Try reconnecting once if disconnected
        await db_manager.connect()

    if db_manager.db is None or not db_manager.is_connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database service currently unavailable. Please verify MongoDB connection."
        )
    return db_manager.db
