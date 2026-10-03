import pytest
import os
import sys
from datetime import datetime, timezone
from mongomock_motor import AsyncMongoMockClient
from httpx import AsyncClient, ASGITransport

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.core.config import settings
from app.core.security import hash_password
from app.dependencies.database import get_db
from app.database.seed import seed_database


@pytest.fixture
async def mock_db():
    client = AsyncMongoMockClient()
    db = client["test_mr_office_db"]
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
async def test_health_check(client):
    res = await client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "database" in data


@pytest.mark.anyio
async def test_auth_login_success(client):
    res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user_role"] == "admin"


@pytest.mark.anyio
async def test_auth_login_invalid(client):
    res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": "WrongPassword123!"
    })
    assert res.status_code == 401
    assert "Invalid email or password" in res.json()["detail"]


@pytest.mark.anyio
async def test_auth_me_protected(client):
    # Without token
    res = await client.get("/api/auth/me")
    assert res.status_code == 401

    # With valid login token
    login_res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    token = login_res.json()["access_token"]
    res_me = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_me.status_code == 200
    assert res_me.json()["email"] == settings.DEFAULT_ADMIN_EMAIL


@pytest.mark.anyio
async def test_public_products_catalog(client):
    # List products
    res = await client.get("/api/products")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) > 0

    # Filter by Category
    res_office = await client.get("/api/products?category=Office%20Furniture")
    assert res_office.status_code == 200
    items = res_office.json()["items"]
    assert all(i["category"] == "Office Furniture" for i in items)

    # Featured products
    res_feat = await client.get("/api/products/featured")
    assert res_feat.status_code == 200
    assert len(res_feat.json()) > 0


@pytest.mark.anyio
async def test_product_crud_admin_protected(client):
    login_res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Product (Unauthenticated fails)
    new_product_payload = {
        "name": "Agra Premium Wooden Bookshelf",
        "category": "Study Furniture",
        "subcategory": "Bookshelves",
        "description": "High capacity solid engineered wood bookshelf for study rooms in Agra.",
        "material": "Engineered Wood with Teak Finish",
        "dimensions": "5ft (H) x 3ft (W) x 1ft (D)",
        "is_active": True,
        "featured": True,
        "price_display": "Get a Quote",
        "specifications": {"Shelves": "4 Racks"}
    }
    unauth_res = await client.post("/api/products", json=new_product_payload)
    assert unauth_res.status_code == 401

    # Create Product with auth
    create_res = await client.post("/api/products", json=new_product_payload, headers=headers)
    assert create_res.status_code == 201
    created = create_res.json()
    product_id = created["id"]
    assert created["name"] == new_product_payload["name"]
    assert "slug" in created

    # 2. Update Product
    update_res = await client.put(f"/api/products/{product_id}", json={
        "name": "Agra Premium Wooden Bookshelf - Deluxe"
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Agra Premium Wooden Bookshelf - Deluxe"

    # 3. Delete Product
    del_res = await client.delete(f"/api/products/{product_id}", headers=headers)
    assert del_res.status_code == 200


@pytest.mark.anyio
async def test_enquiry_submission_and_admin_workflow(client):
    login_res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Submit Enquiry (Public)
    enquiry_payload = {
        "customer_name": "Rohan Gupta",
        "phone": "+91 98765 12345",
        "email": "rohan@example.com",
        "product_name": "Executive Wooden Office Desk",
        "quantity": 2,
        "city": "Agra, Sanjay Place",
        "message": "Need delivery to our new corporate branch in Sanjay Place, Agra."
    }
    submit_res = await client.post("/api/enquiries", json=enquiry_payload)
    assert submit_res.status_code == 201
    assert submit_res.json()["success"] is True
    ref_id = submit_res.json()["enquiry_reference"]

    # 2. Validation test: Invalid short phone fails cleanly
    invalid_phone_payload = enquiry_payload.copy()
    invalid_phone_payload["phone"] = "123"
    inv_res = await client.post("/api/enquiries", json=invalid_phone_payload)
    assert inv_res.status_code == 422

    # 3. Admin List Enquiries
    enq_list_res = await client.get("/api/enquiries", headers=headers)
    assert enq_list_res.status_code == 200
    items = enq_list_res.json()["items"]
    assert any(e["id"] == ref_id for e in items)

    # 4. Admin Update Status
    status_res = await client.patch(f"/api/enquiries/{ref_id}/status", json={
        "status": "Contacted",
        "notes": "Spoke with client on phone, shared catalog PDF via WhatsApp."
    }, headers=headers)
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "Contacted"


@pytest.mark.anyio
async def test_settings_api(client):
    login_res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Public GET
    res = await client.get("/api/settings")
    assert res.status_code == 200
    assert "business_name" in res.json()

    # Admin PUT
    updated_settings = res.json()
    updated_settings["phone"] = "+91 99999 88888"
    put_res = await client.put("/api/settings", json={"settings": updated_settings}, headers=headers)
    assert put_res.status_code == 200
    assert put_res.json()["phone"] == "+91 99999 88888"


@pytest.mark.anyio
async def test_admin_dashboard_stats(client):
    login_res = await client.post("/api/auth/login", json={
        "email": settings.DEFAULT_ADMIN_EMAIL,
        "password": settings.DEFAULT_ADMIN_PASSWORD
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = await client.get("/api/admin/dashboard", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "stats" in data
    assert "total_products" in data["stats"]
    assert "total_enquiries" in data["stats"]
    assert "recent_products" in data
    assert "recent_enquiries" in data
