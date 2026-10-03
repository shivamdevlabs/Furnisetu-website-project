import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("mr_office.database")


class MongoDBManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False

    async def connect(self) -> None:
        """
        Initialize the async MongoDB connection using Motor.
        """
        try:
            logger.info("Connecting to MongoDB database: %s", settings.DATABASE_NAME)
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000
            )
            self.db = self.client[settings.DATABASE_NAME]
            # Verify connectivity via admin ping
            await self.client.admin.command("ping")
            self.is_connected = True
            logger.info("Successfully connected to MongoDB.")
        except Exception as exc:
            self.is_connected = False
            logger.warning(
                "MongoDB connection could not be established at %s: %s. "
                "(Verify that MongoDB Atlas or local MongoDB is running and MONGODB_URI is correct).",
                settings.MONGODB_URI,
                str(exc)
            )

    async def close(self) -> None:
        """
        Close the MongoDB client connection pool cleanly.
        """
        if self.client:
            logger.info("Closing MongoDB connection.")
            self.client.close()
            self.client = None
            self.db = None
            self.is_connected = False

    async def ping(self) -> bool:
        """
        Health check ping for MongoDB.
        """
        if not self.client:
            return False
        try:
            await self.client.admin.command("ping")
            self.is_connected = True
            return True
        except Exception:
            self.is_connected = False
            return False

    def get_database(self) -> AsyncIOMotorDatabase:
        """
        Return active database handle.
        """
        if self.db is None:
            raise RuntimeError("Database is not initialized. Please ensure MongoDB is running.")
        return self.db


db_manager = MongoDBManager()
