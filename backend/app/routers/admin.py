from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db
from app.dependencies.auth import require_admin
from app.routers.products import format_product_doc
from app.routers.enquiries import format_enquiry_doc

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])


@router.get("/dashboard")
async def get_dashboard_stats(
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Aggregate statistics and recent items for the dashboard overview.
    """
    # Product counters
    total_products = await db.products.count_documents({})
    active_products = await db.products.count_documents({"is_active": True})
    featured_products = await db.products.count_documents({"featured": True})

    # Enquiry counters
    total_enquiries = await db.enquiries.count_documents({})
    new_enquiries = await db.enquiries.count_documents({"status": "New"})
    in_progress_enquiries = await db.enquiries.count_documents({"status": "In Progress"})
    completed_enquiries = await db.enquiries.count_documents({"status": "Completed"})

    # Recent enquiries (up to 5)
    recent_enquiries = []
    enquiry_cursor = db.enquiries.find({}).sort("created_at", -1).limit(5)
    async for doc in enquiry_cursor:
        recent_enquiries.append(format_enquiry_doc(doc))

    # Recent products (up to 5)
    recent_products = []
    product_cursor = db.products.find({}).sort("created_at", -1).limit(5)
    async for doc in product_cursor:
        recent_products.append(format_product_doc(doc))

    return {
        "stats": {
            "total_products": total_products,
            "active_products": active_products,
            "featured_products": featured_products,
            "total_enquiries": total_enquiries,
            "new_enquiries": new_enquiries,
            "in_progress_enquiries": in_progress_enquiries,
            "completed_enquiries": completed_enquiries,
        },
        "recent_enquiries": recent_enquiries,
        "recent_products": recent_products
    }
