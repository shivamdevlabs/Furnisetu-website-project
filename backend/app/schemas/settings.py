from typing import Dict, Optional
from pydantic import BaseModel, Field


class BusinessSettingsSchema(BaseModel):
    business_name: str = Field(default="Mr. Office")
    tagline: str = Field(default="Office, School & Study Furniture Specialists in Agra")
    phone: str = Field(default="+91 98765 43210")
    whatsapp: str = Field(default="+91 98765 43210")
    email: str = Field(default="contact@mroffice.in")
    address: str = Field(default="Agra, Uttar Pradesh, India")
    business_hours: str = Field(default="Monday – Saturday: 10:00 AM – 8:00 PM")
    google_maps_embed_url: Optional[str] = Field(default="")
    about_short: str = Field(
        default="Mr. Office is Agra's premier order-based furniture specialist providing high quality office workstations, school desks, teacher tables, study room setups, and institutional furniture."
    )
    hero_headline: str = Field(
        default="Premium Office, School & Study Furniture in Agra"
    )
    hero_subheadline: str = Field(
        default="Direct order-based supply for offices, educational institutions, study spaces & corporate setups. Custom orders arranged directly from top manufacturers."
    )
    social_links: Dict[str, str] = Field(default_factory=lambda: {
        "instagram": "",
        "facebook": "",
        "linkedin": ""
    })


class SettingsUpdate(BaseModel):
    settings: BusinessSettingsSchema
