import pytest
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from mongomock_motor import AsyncMongoMockClient
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.core.config import settings
from app.core.security import hash_password, create_access_token
from app.core.rate_limiter import InMemoryRateLimiter, enquiry_rate_limiter
from app.dependencies.database import get_db
from app.database.seed import seed_database


@pytest.fixture
async def mock_db():
    client = AsyncMongoMockClient()
    db = client["test_security_db"]
    await seed_database(db)
    return db


@pytest.fixture
async def client(mock_db):
    async def override_get_db():
        return mock_db

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.mark.anyio
async def test_auth_protection_all_admin_endpoints(client):
    """
    Ensure all admin endpoints reject unauthenticated access with 401.
    """
    endpoints = [
        ("GET", "/api/auth/me"),
        ("POST", "/api/products"),
        ("PUT", "/api/products/test-id"),
        ("DELETE", "/api/products/test-id"),
        ("GET", "/api/enquiries"),
        ("GET", "/api/enquiries/test-id"),
        ("PATCH", "/api/enquiries/test-id/status"),
        ("DELETE", "/api/enquiries/test-id"),
        ("PUT", "/api/settings"),
        ("GET", "/api/admin/dashboard"),
    ]

    for method, path in endpoints:
        if method == "GET":
            res = await client.get(path)
        elif method == "POST":
            res = await client.post(path, json={})
        elif method == "PUT":
            res = await client.put(path, json={})
        elif method == "PATCH":
            res = await client.patch(path, json={})
        elif method == "DELETE":
            res = await client.delete(path)

        assert res.status_code == 401, f"{method} {path} should return 401 when unauthorized, got {res.status_code}"


@pytest.mark.anyio
async def test_invalid_and_tampered_jwt_token(client):
    """
    Ensure invalid, tampered, or forged tokens are rejected.
    """
    headers = {"Authorization": "Bearer totally.fake.and.tampered.token"}
    res = await client.get("/api/auth/me", headers=headers)
    assert res.status_code == 401
    assert "Invalid or expired" in res.json()["detail"]


@pytest.mark.anyio
async def test_expired_jwt_token(client):
    """
    Ensure expired tokens are rejected.
    """
    # Create an expired token (10 minutes in the past)
    expired_token = create_access_token(
        data={"sub": settings.DEFAULT_ADMIN_EMAIL, "role": "admin"},
        expires_delta=timedelta(minutes=-10)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    res = await client.get("/api/auth/me", headers=headers)
    assert res.status_code == 401


@pytest.mark.anyio
async def test_deactivated_user_forbidden(client, mock_db):
    """
    Ensure deactivated user accounts are rejected with 403 Forbidden even with valid token.
    """
    # Create deactivated user
    deactivated_email = "inactive@mroffice.in"
    await mock_db.users.insert_one({
        "name": "Deactivated Admin",
        "email": deactivated_email,
        "password_hash": hash_password("Password123!"),
        "role": "admin",
        "is_active": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    })

    valid_token = create_access_token(data={"sub": deactivated_email, "role": "admin"})
    headers = {"Authorization": f"Bearer {valid_token}"}
    res = await client.get("/api/auth/me", headers=headers)
    assert res.status_code == 403
    assert "deactivated" in res.json()["detail"].lower()


@pytest.mark.anyio
async def test_input_validation_rejections(client):
    """
    Verify schema validation protects against malformed or insufficient inputs.
    """
    # 1. Product creation with description under 10 chars
    login_res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    short_desc_product = {
        "name": "Valid Desk Name",
        "category": "Office Furniture",
        "description": "Short" # Invalid: min_length is 10
    }
    res = await client.post("/api/products", json=short_desc_product, headers=headers)
    assert res.status_code == 422

    # 2. Enquiry with invalid short phone
    bad_phone_enquiry = {
        "customer_name": "Test User",
        "phone": "123",
        "message": "Valid enquiry message for desk"
    }
    res_enq = await client.post("/api/enquiries", json=bad_phone_enquiry)
    assert res_enq.status_code == 422


@pytest.mark.anyio
async def test_regex_injection_safety(client):
    """
    Verify that search parameters containing regex metacharacters (e.g. *, (, [, +) are safely escaped.
    """
    malicious_searches = [
        ".*",
        "[[[",
        "(a+)+",
        "\\",
        "?+*^$"
    ]
    for s in malicious_searches:
        res = await client.get(f"/api/products?search={s}")
        assert res.status_code == 200, f"Search with '{s}' failed with status {res.status_code}"


@pytest.mark.anyio
async def test_rate_limiter_protection(client):
    """
    Verify that rapid repetitive requests trigger HTTP 429 Too Many Requests.
    """
    test_limiter = InMemoryRateLimiter(requests_limit=3, window_seconds=60)
    from fastapi import Request

    class DummyRequest:
        def __init__(self, ip):
            self.headers = {"x-forwarded-for": ip}
            self.client = None

    req = DummyRequest("198.51.100.1")
    # First 3 should pass
    test_limiter.check_rate_limit(req)
    test_limiter.check_rate_limit(req)
    test_limiter.check_rate_limit(req)

    # 4th should raise 429
    with pytest.raises(Exception) as exc_info:
        test_limiter.check_rate_limit(req)
    assert exc_info.value.status_code == 429
