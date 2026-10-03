import logging
from pymongo import ASCENDING, DESCENDING, IndexModel
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger("mr_office.indexes")


async def create_db_indexes(db: AsyncIOMotorDatabase) -> None:
    """
    Ensure all essential indexes exist in MongoDB collections for optimal query performance.
    """
    try:
        # 1. Users collection
        await db.users.create_indexes([
            IndexModel([("email", ASCENDING)], unique=True, name="idx_users_email_unique"),
            IndexModel([("role", ASCENDING)], name="idx_users_role")
        ])

        # 2. Products collection
        await db.products.create_indexes([
            IndexModel([("slug", ASCENDING)], unique=True, name="idx_products_slug_unique"),
            IndexModel([("category", ASCENDING)], name="idx_products_category"),
            IndexModel([("is_active", ASCENDING)], name="idx_products_is_active"),
            IndexModel([("featured", ASCENDING)], name="idx_products_featured"),
            IndexModel([("created_at", DESCENDING)], name="idx_products_created_at")
        ])

        # 3. Enquiries collection
        await db.enquiries.create_indexes([
            IndexModel([("status", ASCENDING)], name="idx_enquiries_status"),
            IndexModel([("created_at", DESCENDING)], name="idx_enquiries_created_at"),
            IndexModel([("phone", ASCENDING)], name="idx_enquiries_phone"),
            IndexModel([("product_id", ASCENDING)], name="idx_enquiries_product_id")
        ])

        # 4. Settings collection
        await db.settings.create_indexes([
            IndexModel([("key", ASCENDING)], unique=True, name="idx_settings_key_unique")
        ])

        logger.info("MongoDB indexes verified/created successfully.")
    except Exception as exc:
        logger.warning("Could not create database indexes: %s", str(exc))
