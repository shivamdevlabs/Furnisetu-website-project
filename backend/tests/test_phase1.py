import os
import sys

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.main import app


def test_config():
    print("[PASS] Config loaded:")
    print(f"       - Business Name: {settings.BUSINESS_NAME}")
    print(f"       - City: {settings.BUSINESS_CITY}")
    print(f"       - CORS Origins: {settings.CORS_ORIGINS}")
    assert settings.BUSINESS_NAME == "Mr. Office"


def test_security():
    password = "SecurePassword123!"
    hashed = hash_password(password)
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False
    print("[PASS] Direct Bcrypt hashing and verification verified.")

    token = create_access_token({"sub": "admin@mroffice.in", "role": "admin"})
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "admin@mroffice.in"
    assert payload["role"] == "admin"
    print("[PASS] PyJWT token creation and decoding verified.")


def extract_routes(routes_list, prefix=""):
    extracted = []
    for r in routes_list:
        if hasattr(r, "path"):
            extracted.append(prefix + r.path)
        elif hasattr(r, "routes"):
            router_prefix = getattr(r, "prefix", "")
            extracted.extend(extract_routes(r.routes, prefix + router_prefix))
    return extracted


def test_routes():
    # Use FastAPI's OpenAPI schema to inspect all declared endpoint paths
    openapi_schema = app.openapi()
    paths = list(openapi_schema.get("paths", {}).keys())
    print(f"[PASS] Total API endpoints in OpenAPI schema: {len(paths)}")
    
    required_routes = [
        "/",
        "/api/health",
        "/api/auth/login",
        "/api/auth/me",
        "/api/products",
        "/api/products/featured",
        "/api/enquiries",
        "/api/settings",
        "/api/admin/dashboard",
    ]
    for r in required_routes:
        assert r in paths, f"Missing route in OpenAPI paths: {r}"
        print(f"       - Verified endpoint: {r}")


if __name__ == "__main__":
    print("--- Running Phase 1 Architecture Verification Tests ---")
    test_config()
    test_security()
    test_routes()
    print("--- ALL PHASE 1 ARCHITECTURE TESTS PASSED ---")
