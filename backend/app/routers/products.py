import re
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter(prefix="/api/products", tags=["Products"])


def generate_slug(name: str) -> str:
    """Generate a clean URL-friendly slug from product name."""
    s = name.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return s.strip("-")


def format_product_doc(doc: dict) -> dict:
    """Transform MongoDB document into serializable product dictionary."""
    doc["id"] = str(doc["_id"])
    return doc


@router.get("", response_model=dict)
async def list_products(
    category: Optional[str] = Query(None, description="Filter by main category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    is_active: Optional[bool] = Query(True, description="Filter active/inactive products"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Public endpoint: List furniture products with category filtering, search, and pagination.
    """
    query: dict = {}
    if is_active is not None:
        query["is_active"] = is_active
    if category:
        query["category"] = category
    if subcategory:
        query["subcategory"] = subcategory
    if featured is not None:
        query["featured"] = featured
    if search:
        regex = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [
            {"name": regex},
            {"description": regex},
            {"material": regex}
        ]

    total = await db.products.count_documents(query)
    skip = (page - 1) * limit
    cursor = db.products.find(query).sort("created_at", -1).skip(skip).limit(limit)

    products = []
    async for doc in cursor:
        products.append(format_product_doc(doc))

    return {
        "items": products,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 1
    }


@router.get("/featured", response_model=List[ProductResponse])
async def get_featured_products(
    limit: int = Query(6, ge=1, le=20),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Public endpoint: Quick fetch of featured products for the homepage.
    """
    cursor = db.products.find({"is_active": True, "featured": True}).sort("created_at", -1).limit(limit)
    items = []
    async for doc in cursor:
        items.append(format_product_doc(doc))
    return items


@router.get("/{id_or_slug}", response_model=ProductResponse)
async def get_product(id_or_slug: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Public endpoint: Retrieve a single product by its ObjectId string or unique slug.
    """
    query = {}
    if ObjectId.is_valid(id_or_slug):
        query = {"_id": ObjectId(id_or_slug)}
    else:
        query = {"slug": id_or_slug}

    doc = await db.products.find_one(query)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found."
        )
    return format_product_doc(doc)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    payload: ProductCreate,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Add a new furniture product to the catalog.
    """
    now = datetime.now(timezone.utc)
    base_slug = payload.slug or generate_slug(payload.name)
    slug = base_slug
    counter = 1

    # Ensure unique slug
    while await db.products.find_one({"slug": slug}):
        slug = f"{base_slug}-{counter}"
        counter += 1

    product_dict = payload.model_dump()
    product_dict["slug"] = slug
    product_dict["created_at"] = now
    product_dict["updated_at"] = now

    result = await db.products.insert_one(product_dict)
    product_dict["_id"] = result.inserted_id
    return format_product_doc(product_dict)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Update product specifications, categories, image URLs, or status.
    """
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")

    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid update fields provided.")

    if "name" in update_data and "slug" not in update_data:
        # Check if slug should update or stay
        base_slug = generate_slug(update_data["name"])
        existing = await db.products.find_one({"slug": base_slug, "_id": {"$ne": ObjectId(product_id)}})
        if existing:
            update_data["slug"] = f"{base_slug}-{product_id[-4:]}"
        else:
            update_data["slug"] = base_slug

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db.products.find_one_and_update(
        {"_id": ObjectId(product_id)},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found.")
    return format_product_doc(result)


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin endpoint: Delete a product from catalog. Requires confirmation on frontend.
    """
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID.")

    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"message": "Product successfully deleted."}
