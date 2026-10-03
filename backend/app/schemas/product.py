from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., description="Office Furniture, School Furniture, Study Furniture, or Other Furniture")
    subcategory: Optional[str] = None
    description: str = Field(..., min_length=10)
    images: List[str] = Field(default_factory=list)
    specifications: Dict[str, str] = Field(default_factory=dict)
    material: Optional[str] = None
    dimensions: Optional[str] = None
    is_active: bool = True
    featured: bool = False
    price_display: Optional[str] = Field(default="Get a Quote", description="e.g. 'Get a Quote' or optional price guidance")


class ProductCreate(ProductBase):
    slug: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None
    material: Optional[str] = None
    dimensions: Optional[str] = None
    is_active: Optional[bool] = None
    featured: Optional[bool] = None
    price_display: Optional[str] = None
    slug: Optional[str] = None


class ProductResponse(ProductBase):
    id: str
    slug: str
    created_at: datetime
    updated_at: datetime
