from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class EnquiryCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    quantity: Optional[int] = Field(default=1, ge=1, le=100000)
    message: str = Field(..., min_length=5, max_length=3000)
    city: Optional[str] = Field(default="Agra", max_length=100)


class EnquiryUpdateStatus(BaseModel):
    status: str = Field(..., description="New, Contacted, In Progress, Completed, or Cancelled")
    notes: Optional[str] = None


class EnquiryResponse(BaseModel):
    id: str
    customer_name: str
    phone: str
    email: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    quantity: Optional[int] = 1
    message: str
    city: Optional[str] = "Agra"
    status: str = "New"
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
