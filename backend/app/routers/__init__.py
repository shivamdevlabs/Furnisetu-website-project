from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routers.enquiries import router as enquiries_router
from app.routers.settings import router as settings_router
from app.routers.admin import router as admin_router

__all__ = [
    "auth_router",
    "products_router",
    "enquiries_router",
    "settings_router",
    "admin_router"
]
