import asyncio
import logging
from datetime import datetime, timezone
from app.core.config import settings
from app.core.security import hash_password
from app.database.mongodb import db_manager
from app.database.indexes import create_db_indexes

logger = logging.getLogger("mr_office.seed")

INITIAL_PRODUCTS_DATA = [
  # OFFICE FURNITURE
  {
    "name": "Executive Wooden Office Desk",
    "slug": "executive-wooden-office-desk-agra",
    "category": "Office Furniture",
    "subcategory": "Executive Tables",
    "description": "Premium commercial executive desk crafted with durable engineered wood, melamine finish, integrated modesty panel, and lockable storage drawers. Designed for executive cabins and corporate leadership spaces in Agra.",
    "images": ["/images/category-office.jpg"],
    "material": "High-Density Engineered Wood with Scratch-Resistant Melamine",
    "dimensions": "6ft (W) x 3ft (D) x 2.5ft (H)",
    "specifications": {
      "Material": "Engineered Wood with Melamine Coating",
      "Dimensions": "72\" x 36\" x 30\"",
      "Storage": "3-drawer pedestal with central locking",
      "Cable Management": "Dual integrated grommets",
      "Finish": "Warm Walnut / Dark Mahogany",
      "Ideal For": "Executive Cabins & Director Offices"
    },
    "is_active": True,
    "featured": True,
    "price_display": "Get a Quote"
  },
  {
    "name": "Ergonomic High-Back Mesh Chair",
    "slug": "ergonomic-high-back-mesh-office-chair",
    "category": "Office Furniture",
    "subcategory": "Office Chairs",
    "description": "Breathable high-back office chair featuring adjustable lumbar support, 3D armrests, pneumatic height adjustment, and synchronous tilt mechanism for long corporate work hours.",
    "images": ["/images/category-office.jpg"],
    "material": "Breathable Korean Mesh & Heavy Duty Nylon Base",
    "dimensions": "Standard Ergonomic Fit (Adjustable Height 46\" - 52\")",
    "specifications": {
      "Backrest": "Breathable High-Tension Mesh",
      "Mechanism": "Multi-lock Synchronous Tilt",
      "Armrests": "3D Adjustable (Height & Angle)",
      "Gas Lift": "Class 4 Certified Hydraulic Cylinder",
      "Wheel Base": "60mm PU Castor Wheels",
      "Ideal For": "Workstations & Extended Desk Work"
    },
    "is_active": True,
    "featured": True,
    "price_display": "Get a Quote"
  },
  {
    "name": "Modular 4-Seater Office Workstation",
    "slug": "modular-4-seater-office-workstation",
    "category": "Office Furniture",
    "subcategory": "Workstations",
    "description": "Linear collaborative 4-cluster workstation with aluminum partition screens, pin-up acoustic fabric tiles, integrated wire raceways, and dedicated mobile drawer pedestals.",
    "images": ["/images/category-office.jpg"],
    "material": "Pre-laminated Particle Board & Powder Coated Metal Frame",
    "dimensions": "8ft x 4ft (Per user: 4ft x 2ft)",
    "specifications": {
      "Configuration": "4-Person Back-to-Back Cluster",
      "Partition": "Fabric acoustic screen with magnetic board",
      "Frame": "50x50mm Powder-coated Steel Legs",
      "Wiring": "Concealed wire raceway with socket cutouts",
      "Ideal For": "Open-Plan Corporate Teams"
    },
    "is_active": True,
    "featured": True,
    "price_display": "Get a Quote"
  },
  {
    "name": "Corporate Conference Table (10-12 Seater)",
    "slug": "corporate-conference-room-table",
    "category": "Office Furniture",
    "subcategory": "Conference Tables",
    "description": "Spacious oval-edge boardroom conference table equipped with pop-up connectivity box slots, sturdy dual pedestals, and premium chamfered edge finish.",
    "images": ["/images/category-office.jpg"],
    "material": "Commercial Grade MDF with Teak Wood Finish",
    "dimensions": "10ft (L) x 4ft (W) x 2.5ft (H)",
    "specifications": {
      "Capacity": "10 to 12 Persons",
      "Tabletop Thickness": "36mm heavy-duty profile",
      "Connectivity": "2x Aluminum pop-up power & HDMI box slots",
      "Structure": "Dual box pedestals with leveling screws",
      "Ideal For": "Boardrooms & Meeting Rooms"
    },
    "is_active": True,
    "featured": False,
    "price_display": "Get a Quote"
  },

  # SCHOOL FURNITURE
  {
    "name": "Dual Student Classroom Desk & Bench Combo",
    "slug": "dual-student-classroom-desk-bench",
    "category": "School Furniture",
    "subcategory": "Student Desks",
    "description": "Heavy-duty dual seater student desk with integrated bench. Engineered with rounded safety corners, book shelf rack, and powder-coated steel framework built to withstand high school daily usage.",
    "images": ["/images/category-school.jpg"],
    "material": "Marine Grade Plywood with CRCA Steel Tubular Pipe",
    "dimensions": "42\" (W) x 32\" (D) x 30\" (H)",
    "specifications": {
      "Capacity": "2 Students",
      "Frame": "1.2mm thick CRCA steel tube with epoxy coating",
      "Desk Top": "18mm pre-laminated board with PVC edge banding",
      "Storage": "Under-desk wire mesh book tray",
      "Safety": "Rounded corners with rubber floor buffers",
      "Ideal For": "Primary & Secondary Classrooms"
    },
    "is_active": True,
    "featured": True,
    "price_display": "Get a Quote"
  },
  {
    "name": "Teacher Faculty Table & Chair Set",
    "slug": "teacher-table-with-drawer-unit",
    "category": "School Furniture",
    "subcategory": "Teacher Tables",
    "description": "Sturdy faculty table with lockable single pedestal drawer unit, smooth laminate top, and cushioned mid-back teacher chair for classrooms and staff rooms.",
    "images": ["/images/category-school.jpg"],
    "material": "High-grade wood laminate & heavy steel frame",
    "dimensions": "4ft (W) x 2ft (D) x 2.5ft (H)",
    "specifications": {
      "Top": "25mm Prelam board with rounded edges",
      "Drawers": "2 lockable utility drawers",
      "Footrest": "Reinforced ergonomic steel crossbar",
      "Chair Included": "High-density foam cushioned chair",
      "Ideal For": "School & College Staff Rooms"
    },
    "is_active": True,
    "featured": False,
    "price_display": "Get a Quote"
  },
  {
    "name": "Double-Sided School Library Rack",
    "slug": "institutional-school-library-bookshelf",
    "category": "School Furniture",
    "subcategory": "School Storage",
    "description": "Modular steel library display rack with adjustable shelving levels, center book supports, and powder-coated anti-rust finish for institutional book collections.",
    "images": ["/images/category-school.jpg"],
    "material": "Heavy Gauge Cold Rolled Steel",
    "dimensions": "6.5ft (H) x 3ft (W) x 1.5ft (D)",
    "specifications": {
      "Shelves": "5 adjustable tiers per side (10 shelves total)",
      "Load Capacity": "70 kg per tier",
      "Finish": "Anti-rust electro-deposition powder coating",
      "Ideal For": "Schools, Colleges & Institutional Libraries"
    },
    "is_active": True,
    "featured": False,
    "price_display": "Get a Quote"
  },

  # STUDY FURNITURE
  {
    "name": "Compact Study Table with Integrated Bookshelf",
    "slug": "ergonomic-home-study-desk-with-bookshelf",
    "category": "Study Furniture",
    "subcategory": "Study Tables",
    "description": "Space-saving modern study desk featuring upper bookshelf racks, cable organizer grommet, stationery drawer, and sturdy leg structure for students and remote workers.",
    "images": ["/images/category-study.jpg"],
    "material": "Engineered Hardwood with Natural Teak Veneer finish",
    "dimensions": "4ft (W) x 2ft (D) x 4.5ft (Total Height with Shelf)",
    "specifications": {
      "Desktop Area": "48\" x 24\" spacious work surface",
      "Storage": "Upper 2-tier display rack + 1 bottom storage drawer",
      "Cable Hole": "Centered rubberized pass-through",
      "Color Options": "Natural Teak, Frost White, Walnut",
      "Ideal For": "Student Study Rooms & Home Offices"
    },
    "is_active": True,
    "featured": True,
    "price_display": "Get a Quote"
  },
  {
    "name": "Cushioned Ergonomic Study Chair",
    "slug": "ergonomic-student-study-chair",
    "category": "Study Furniture",
    "subcategory": "Study Chairs",
    "description": "Comfortable ergonomic student chair with breathable mesh back, contoured lumbar support cushion, and 360-degree swivel for focused study sessions.",
    "images": ["/images/category-study.jpg"],
    "material": "Breathable Mesh, Molded Foam, Sturdy Star Base",
    "dimensions": "Seat Height 17\" - 22\" (Adjustable)",
    "specifications": {
      "Back Support": "Adaptive spinal contour curve",
      "Cushion": "High resilience 45-density molded foam",
      "Base": "Reinforced nylon 5-point caster base",
      "Ideal For": "High school, competitive exam & college students"
    },
    "is_active": True,
    "featured": False,
    "price_display": "Get a Quote"
  },

  # OTHER FURNITURE
  {
    "name": "Modern Reception Lounge Sofa (3-Seater)",
    "slug": "commercial-reception-3-seater-sofa",
    "category": "Other Furniture",
    "subcategory": "Sofas",
    "description": "Commercial quality 3-seater sofa upholstered in premium anti-stain leatherette with solid wood frame and brushed chrome accent legs. Ideal for office receptions and visitor waiting lounges in Agra.",
    "images": ["/images/category-office.jpg"],
    "material": "Kiln-Dried Solid Hardwood & Commercial Leatherette",
    "dimensions": "6.5ft (W) x 2.8ft (D) x 2.8ft (H)",
    "specifications": {
      "Seating Capacity": "3 Persons",
      "Upholstery": "Heavy duty commercial grade leatherette",
      "Frame": "Treated solid sal-wood internal structure",
      "Legs": "Brushed stainless steel",
      "Ideal For": "Corporate Receptions, Waiting Areas & Clinics"
    },
    "is_active": True,
    "featured": False,
    "price_display": "Get a Quote"
  }
]


async def seed_database(db=None):
    """
    Populate the MongoDB database with initial admin user, default business settings, and furniture products.
    """
    should_close = False
    if db is None:
        await db_manager.connect()
        if not db_manager.is_connected or db_manager.db is None:
            logger.warning("Database connection failed. Skipping database seed.")
            return False
        db = db_manager.db
        should_close = True

    now = datetime.now(timezone.utc)

    # 1. Create indexes
    await create_db_indexes(db)

    # 2. Seed Default Admin User
    admin_email = settings.DEFAULT_ADMIN_EMAIL.lower().strip()
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        admin_doc = {
            "name": settings.DEFAULT_ADMIN_NAME,
            "email": admin_email,
            "password_hash": hash_password(settings.DEFAULT_ADMIN_PASSWORD),
            "role": "admin",
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
        await db.users.insert_one(admin_doc)
        logger.info("Admin user created: %s", admin_email)
    else:
        logger.info("Admin user already exists: %s", admin_email)

    # 3. Seed Default Business Settings
    existing_settings = await db.settings.find_one({"key": "general"})
    if not existing_settings:
        settings_doc = {
            "key": "general",
            "data": {
                "business_name": settings.BUSINESS_NAME,
                "tagline": settings.BUSINESS_TAGLINE,
                "phone": "+91 98765 43210",
                "whatsapp": "+91 98765 43210",
                "email": "contact@mroffice.in",
                "address": "Agra, Uttar Pradesh, India",
                "business_hours": "Monday – Saturday: 10:00 AM – 8:00 PM (Sunday by appointment)",
                "google_maps_embed_url": "",
                "about_short": "Mr. Office is Agra's premier order-based furniture specialist providing high quality office workstations, school desks, teacher tables, study room setups, and institutional furniture.",
                "hero_headline": "Premium Office, School & Study Furniture in Agra",
                "hero_subheadline": "Direct order-based supply for offices, educational institutions, study spaces & corporate setups. Custom orders arranged directly from top manufacturers.",
                "social_links": {
                    "instagram": "",
                    "facebook": "",
                    "linkedin": ""
                }
            },
            "created_at": now,
            "updated_at": now
        }
        await db.settings.insert_one(settings_doc)
        logger.info("Initial business settings seeded.")
    else:
        logger.info("Business settings already initialized.")

    # 4. Seed Products
    product_count = await db.products.count_documents({})
    if product_count == 0:
        for p in INITIAL_PRODUCTS_DATA:
            p_copy = p.copy()
            p_copy["created_at"] = now
            p_copy["updated_at"] = now
            await db.products.insert_one(p_copy)
        logger.info("Seeded %d furniture products into catalog.", len(INITIAL_PRODUCTS_DATA))
    else:
        logger.info("Products collection already has %d items. Skipping product seeding.", product_count)

    if should_close:
        await db_manager.close()

    return True


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed_database())
