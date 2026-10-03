import os
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables and backend/.env.
    Never commit production secrets to version control.
    """
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://127.0.0.1:5173"

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, tuple)):
            return [str(i).strip() for i in v if str(i).strip()]
        return ["http://localhost:5173"]

    # MongoDB Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "mr_office_db"

    # Security & JWT Authentication
    JWT_SECRET: str = "change_this_to_a_random_secure_hex_key_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Initial Admin Seed
    DEFAULT_ADMIN_EMAIL: str = "admin@mroffice.in"
    DEFAULT_ADMIN_PASSWORD: str = "Admin@MrOffice2025!"
    DEFAULT_ADMIN_NAME: str = "FURNISETU Admin"

    # Business Information Defaults (can be customized via admin settings in database)
    BUSINESS_NAME: str = "FURNISETU"
    BUSINESS_TAGLINE: str = "Premium Office, School & Study Furniture in Agra"
    BUSINESS_CITY: str = "Agra"
    BUSINESS_STATE: str = "Uttar Pradesh"
    BUSINESS_COUNTRY: str = "India"


settings = Settings()
