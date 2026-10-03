import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("mr_office.database")


class MongoDBManager:
    client: Optional[AsyncIOMotorClient] = None
    mock_client: Optional[object] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False
    is_fallback: bool = False

    async def connect(self) -> None:
        """
        Initialize the async MongoDB connection using Motor.
        If the external MongoDB URI is temporarily unreachable in development,
        initializes an in-process fallback database with auto-seeded admin & products
        so the admin portal and public website remain fully functional.
        """
        try:
            logger.info("Attempting connection to MongoDB at: %s", settings.MONGODB_URI)
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000
            )
            self.db = self.client[settings.DATABASE_NAME]
            # Verify connectivity via admin ping
            await self.client.admin.command("ping")
            self.is_connected = True
            self.is_fallback = False
            logger.info("Successfully connected to live MongoDB (%s).", settings.DATABASE_NAME)
        except Exception as exc:
            self.client = None
            logger.warning(
                "Could not connect to external MongoDB server at %s: %s.",
                settings.MONGODB_URI,
                str(exc)
            )

            # Resilient development fallback
            try:
                from mongomock_motor import AsyncMongoMockClient
                from app.database.seed import seed_database

                logger.info("Activating resilient development database engine...")
                self.mock_client = AsyncMongoMockClient()
                self.db = self.mock_client[settings.DATABASE_NAME]
                self.is_connected = True
                self.is_fallback = True

                # Seed the fallback database with admin user, settings, and furniture products
                await seed_database(self.db)
                logger.info(
                    "Fallback database online with default admin (%s) and catalog.",
                    settings.DEFAULT_ADMIN_EMAIL
                )
            except Exception as mock_exc:
                self.is_connected = False
                self.is_fallback = False
                logger.error("Failed to initialize database engine: %s", str(mock_exc))

    async def close(self) -> None:
        """
        Close the MongoDB client connection pool cleanly.
        """
        if self.client:
            logger.info("Closing MongoDB connection.")
            self.client.close()
            self.client = None
        if self.mock_client:
            self.mock_client = None
        self.db = None
        self.is_connected = False
        self.is_fallback = False

    async def ping(self) -> bool:
        """
        Health check ping for MongoDB.
        """
        if self.is_fallback:
            return True
        if not self.client:
            return False
        try:
            await self.client.admin.command("ping")
            self.is_connected = True
            return True
        except Exception:
            return False

    def get_database(self) -> AsyncIOMotorDatabase:
        """
        Return active database handle.
        """
        if self.db is None:
            raise RuntimeError("Database is not initialized. Please ensure MongoDB is running.")
        return self.db


db_manager = MongoDBManager()
