import re
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.rate_limiter import enquiry_rate_limiter
from app.dependencies.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.enquiry import EnquiryCreate, EnquiryResponse, EnquiryUpdateStatus

router = APIRouter(prefix="/api/enquiries", tags=["Enquiries"])


def format_enquiry_doc(doc: dict) -> dict:
    """Format MongoDB document into enquiry response by converting _id to id string."""
    if "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def submit_enquiry(
    request: Request,
    payload: EnquiryCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Public endpoint: Customer submits a furniture enquiry or quote request.
    Validates input cleanly and safely saves to database with abuse protection.
    """
    enquiry_rate_limiter.check_rate_limit(request)
    # Sanitize and validate phone
    cleaned_phone = re.sub(r"[^\d+]", "", payload.phone)
    if len(cleaned_phone) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a valid contact number (at least 10 digits)."
        )

    now = datetime.now(timezone.utc)
    enquiry_data = payload.model_dump()
    enquiry_data["phone"] = cleaned_phone
    enquiry_data["status"] = "New"
    enquiry_data["notes"] = ""
    enquiry_data["created_at"] = now
    enquiry_data["updated_at"] = now

    res = await db.enquiries.insert_one(enquiry_data)

    return {
        "success": True,
        "message": "Thank you for reaching out to FURNISETU! Our Agra team will contact you shortly.",
        "enquiry_reference": str(res.inserted_id)
    }


@router.get("", response_model=dict)
async def list_enquiries(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: New, Contacted, In Progress, Completed, Cancelled"),
    search: Optional[str] = Query(None, description="Search by customer name, phone, or message"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Retrieve leads/enquiries with filtering, search, and pagination.
    """
    query: dict = {}
    if status_filter:
        query["status"] = status_filter
    if search:
        regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [
            {"customer_name": regex},
            {"phone": regex},
            {"message": regex},
            {"product_name": regex},
            {"city": regex}
        ]

    total = await db.enquiries.count_documents(query)
    skip = (page - 1) * limit
    cursor = db.enquiries.find(query).sort("created_at", -1).skip(skip).limit(limit)

    items = []
    async for doc in cursor:
        items.append(format_enquiry_doc(doc))

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 1
    }


@router.get("/{enquiry_id}", response_model=EnquiryResponse)
async def get_enquiry(
    enquiry_id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Retrieve details of a specific customer enquiry.
    """
    if not ObjectId.is_valid(enquiry_id):
        raise HTTPException(status_code=400, detail="Invalid enquiry ID.")

    doc = await db.enquiries.find_one({"_id": ObjectId(enquiry_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    return format_enquiry_doc(doc)


@router.patch("/{enquiry_id}/status", response_model=EnquiryResponse)
async def update_enquiry_status(
    enquiry_id: str,
    payload: EnquiryUpdateStatus,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Change lead status (New, Contacted, In Progress, Completed, Cancelled) and add notes.
    """
    if not ObjectId.is_valid(enquiry_id):
        raise HTTPException(status_code=400, detail="Invalid enquiry ID.")

    allowed_statuses = ["New", "Contacted", "In Progress", "Completed", "Cancelled"]
    if payload.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of: {', '.join(allowed_statuses)}"
        )

    update_fields = {
        "status": payload.status,
        "updated_at": datetime.now(timezone.utc)
    }
    if payload.notes is not None:
        update_fields["notes"] = payload.notes

    doc = await db.enquiries.find_one_and_update(
        {"_id": ObjectId(enquiry_id)},
        {"$set": update_fields},
        return_document=True
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    return format_enquiry_doc(doc)


@router.delete("/{enquiry_id}", status_code=status.HTTP_200_OK)
async def delete_enquiry(
    enquiry_id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Delete an enquiry.
    """
    if not ObjectId.is_valid(enquiry_id):
        raise HTTPException(status_code=400, detail="Invalid enquiry ID.")

    res = await db.enquiries.delete_one({"_id": ObjectId(enquiry_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    return {"message": "Enquiry deleted successfully."}
