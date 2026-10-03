from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.database.mongodb import db_manager
from app.database.indexes import create_db_indexes
from app.routers import (
    auth_router,
    products_router,
    enquiries_router,
    settings_router,
    admin_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler: manages DB connections and index creation.
    """
    setup_logging(debug=settings.DEBUG)
    logger.info("Initializing %s backend in %s mode...", settings.BUSINESS_NAME, settings.ENVIRONMENT)

    # Connect to MongoDB
    await db_manager.connect()
    if db_manager.is_connected and db_manager.db is not None:
        await create_db_indexes(db_manager.db)
    else:
        logger.warning("Application started, but MongoDB is not connected yet.")

    yield

    # Clean shutdown
    await db_manager.close()
    logger.info("Backend application shutdown complete.")


app = FastAPI(
    title="FURNISETU API",
    description="Full-stack Furniture Business Platform API for FURNISETU (Agra, UP)",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    lifespan=lifespan
)

# CORS Configuration
origins = settings.CORS_ORIGINS
logger.info("Configured CORS Allowed Origins: %s", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/", tags=["System"])
async def root():
    return {
        "business": settings.BUSINESS_NAME,
        "tagline": settings.BUSINESS_TAGLINE,
        "location": f"{settings.BUSINESS_CITY}, {settings.BUSINESS_STATE}, {settings.BUSINESS_COUNTRY}",
        "status": "online",
        "documentation": "/api/docs" if settings.DEBUG else "disabled in production"
    }


@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Service health check endpoint. Verifies server status and database connectivity.
    """
    db_alive = await db_manager.ping()
    return {
        "status": "healthy" if db_alive else "degraded",
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": "connected" if db_alive else "disconnected",
            "name": settings.DATABASE_NAME,
            "mode": "live_mongodb" if not db_manager.is_fallback else "embedded_dev_fallback"
        }
    }


# Include feature routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(enquiries_router)
app.include_router(settings_router)
app.include_router(admin_router)


# Global unhandled exception handler to avoid leaking tracebacks in production
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled server exception on %s %s: %s", request.method, request.url.path, str(exc), exc_info=settings.DEBUG)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )
