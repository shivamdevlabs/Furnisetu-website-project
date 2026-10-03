export const INITIAL_PRODUCTS = [
  // OFFICE FURNITURE
  {
    id: "off-01",
    slug: "executive-wooden-office-desk-agra",
    name: "Executive Wooden Office Desk",
    category: "Office Furniture",
    subcategory: "Executive Tables",
    description: "Premium commercial executive desk crafted with durable engineered wood, melamine finish, integrated modesty panel, and lockable storage drawers. Designed for executive cabins and corporate leadership spaces.",
    images: ["/images/category-office.jpg"],
    material: "High-Density Engineered Wood with Scratch-Resistant Melamine",
    dimensions: "6ft (W) x 3ft (D) x 2.5ft (H)",
    specifications: {
      "Material": "Engineered Wood with Melamine Coating",
      "Dimensions": "72\" x 36\" x 30\"",
      "Storage": "3-drawer pedestal with central locking",
      "Cable Management": "Dual integrated grommets",
      "Finish": "Warm Walnut / Dark Mahogany",
      "Ideal For": "Executive Cabins & Director Offices"
    },
    is_active: true,
    featured: true,
    price_display: "Get a Quote"
  },
  {
    id: "off-02",
    slug: "ergonomic-high-back-mesh-office-chair",
    name: "Ergonomic High-Back Mesh Chair",
    category: "Office Furniture",
    subcategory: "Office Chairs",
    description: "Breathable high-back office chair featuring adjustable lumbar support, 3D armrests, pneumatic height adjustment, and synchronous tilt mechanism for long working hours.",
    images: ["/images/category-office.jpg"],
    material: "Breathable Korean Mesh & Heavy Duty Nylon Base",
    dimensions: "Standard Ergonomic Fit (Adjustable Height 46\" - 52\")",
    specifications: {
      "Backrest": "Breathable High-Tension Mesh",
      "Mechanism": "Multi-lock Synchronous Tilt",
      "Armrests": "3D Adjustable (Height & Angle)",
      "Gas Lift": "Class 4 Certified Hydraulic Cylinder",
      "Wheel Base": "60mm PU Castor Wheels",
      "Ideal For": "Workstation & Extended Desk Work"
    },
    is_active: true,
    featured: true,
    price_display: "Get a Quote"
  },
  {
    id: "off-03",
    slug: "modular-4-seater-office-workstation",
    name: "Modular 4-Seater Office Workstation",
    category: "Office Furniture",
    subcategory: "Workstations",
    description: "Linear collaborative 4-cluster workstation with aluminum partition screens, pin-up acoustic fabric tiles, integrated wire raceways, and dedicated mobile drawer pedestals.",
    images: ["/images/category-office.jpg"],
    material: "Pre-laminated Particle Board & Powder Coated Metal Frame",
    dimensions: "8ft x 4ft (Per user: 4ft x 2ft)",
    specifications: {
      "Configuration": "4-Person Back-to-Back Cluster",
      "Partition": "Fabric acoustic screen with magnetic board",
      "Frame": "50x50mm Powder-coated Steel Legs",
      "Wiring": "Concealed wire raceway with socket cutouts",
      "Ideal For": "Open-Plan Corporate Teams"
    },
    is_active: true,
    featured: true,
    price_display: "Get a Quote"
  },
  {
    id: "off-04",
    slug: "corporate-conference-room-table",
    name: "Corporate Conference Table (10-12 Seater)",
    category: "Office Furniture",
    subcategory: "Conference Tables",
    description: "Spacious oval-edge boardroom conference table equipped with pop-up connectivity box slots, sturdy dual pedestals, and premium chamfered edge finish.",
    images: ["/images/category-office.jpg"],
    material: "Commercial Grade MDF with Teak Wood Finish",
    dimensions: "10ft (L) x 4ft (W) x 2.5ft (H)",
    specifications: {
      "Capacity": "10 to 12 Persons",
      "Tabletop Thickness": "36mm heavy-duty profile",
      "Connectivity": "2x Aluminum pop-up power & HDMI box slots",
      "Structure": "Dual box pedestals with leveling screws",
      "Ideal For": "Boardrooms & Meeting Rooms"
    },
    is_active: true,
    featured: false,
    price_display: "Get a Quote"
  },

  // SCHOOL FURNITURE
  {
    id: "sch-01",
    slug: "dual-student-classroom-desk-bench",
    name: "Dual Student Classroom Desk & Bench Combo",
    category: "School Furniture",
    subcategory: "Student Desks",
    description: "Heavy-duty dual seater student desk with integrated bench. Engineered with rounded safety corners, book shelf rack, and powder-coated steel framework built to withstand high school daily usage.",
    images: ["/images/category-school.jpg"],
    material: "Marine Grade Plywood with CRCA Steel Tubular Pipe",
    dimensions: "42\" (W) x 32\" (D) x 30\" (H)",
    specifications: {
      "Capacity": "2 Students",
      "Frame": "1.2mm thick CRCA steel tube with epoxy coating",
      "Desk Top": "18mm pre-laminated board with PVC edge banding",
      "Storage": "Under-desk wire mesh book tray",
      "Safety": "Rounded corners with rubber floor buffers",
      "Ideal For": "Primary & Secondary Classrooms"
    },
    is_active: true,
    featured: true,
    price_display: "Get a Quote"
  },
  {
    id: "sch-02",
    slug: "teacher-table-with-drawer-unit",
    name: "Teacher Faculty Table & Chair Set",
    category: "School Furniture",
    subcategory: "Teacher Tables",
    description: "Sturdy faculty table with lockable single pedestal drawer unit, smooth laminate top, and cushioned mid-back teacher chair for classrooms and staff rooms.",
    images: ["/images/category-school.jpg"],
    material: "High-grade wood laminate & heavy steel frame",
    dimensions: "4ft (W) x 2ft (D) x 2.5ft (H)",
    specifications: {
      "Top": "25mm Prelam board with rounded edges",
      "Drawers": "2 lockable utility drawers",
      "Footrest": "Reinforced ergonomic steel crossbar",
      "Chair Included": "High-density foam cushioned chair",
      "Ideal For": "School & College Staff Rooms"
    },
    is_active: true,
    featured: false,
    price_display: "Get a Quote"
  },
  {
    id: "sch-03",
    slug: "institutional-school-library-bookshelf",
    name: "Double-Sided School Library Rack",
    category: "School Furniture",
    subcategory: "School Storage",
    description: "Modular steel library display rack with adjustable shelving levels, center book supports, and powder-coated anti-rust finish for institutional book collections.",
    images: ["/images/category-school.jpg"],
    material: "Heavy Gauge Cold Rolled Steel",
    dimensions: "6.5ft (H) x 3ft (W) x 1.5ft (D)",
    specifications: {
      "Shelves": "5 adjustable tiers per side (10 shelves total)",
      "Load Capacity": "70 kg per tier",
      "Finish": "Anti-rust electro-deposition powder coating",
      "Ideal For": "Schools, Colleges & Institutional Libraries"
    },
    is_active: true,
    featured: false,
    price_display: "Get a Quote"
  },

  // STUDY FURNITURE
  {
    id: "stu-01",
    slug: "ergonomic-home-study-desk-with-bookshelf",
    name: "Compact Study Table with Integrated Bookshelf",
    category: "Study Furniture",
    subcategory: "Study Tables",
    description: "Space-saving modern study desk featuring upper bookshelf racks, cable organizer grommet, stationery drawer, and sturdy leg structure for students and remote workers.",
    images: ["/images/category-study.jpg"],
    material: "Engineered Hardwood with Natural Teak Veneer finish",
    dimensions: "4ft (W) x 2ft (D) x 4.5ft (Total Height with Shelf)",
    specifications: {
      "Desktop Area": "48\" x 24\" spacious work surface",
      "Storage": "Upper 2-tier display rack + 1 bottom storage drawer",
      "Cable Hole": "Centered rubberized pass-through",
      "Color Options": "Natural Teak, Frost White, Walnut",
      "Ideal For": "Student Study Rooms & Home Offices"
    },
    is_active: true,
    featured: true,
    price_display: "Get a Quote"
  },
  {
    id: "stu-02",
    slug: "ergonomic-student-study-chair",
    name: "Cushioned Ergonomic Study Chair",
    category: "Study Furniture",
    subcategory: "Study Chairs",
    description: "Comfortable ergonomic student chair with breathable mesh back, contoured lumbar support cushion, and 360-degree swivel for focused study sessions.",
    images: ["/images/category-study.jpg"],
    material: "Breathable Mesh, Molded Foam, Sturdy Star Base",
    dimensions: "Seat Height 17\" - 22\" (Adjustable)",
    specifications: {
      "Back Support": "Adaptive spinal contour curve",
      "Cushion": "High resilience 45-density molded foam",
      "Base": "Reinforced nylon 5-point caster base",
      "Ideal For": "High school, competitive exam & college students"
    },
    is_active: true,
    featured: false,
    price_display: "Get a Quote"
  },

  // OTHER FURNITURE
  {
    id: "oth-01",
    slug: "commercial-reception-3-seater-sofa",
    name: "Modern Reception Lounge Sofa (3-Seater)",
    category: "Other Furniture",
    subcategory: "Sofas",
    description: "Commercial quality 3-seater sofa upholstered in premium anti-stain leatherette with solid wood frame and brushed chrome accent legs. Ideal for office receptions and visitor waiting lounges.",
    images: ["/images/category-office.jpg"],
    material: "Kiln-Dried Solid Hardwood & Commercial Leatherette",
    dimensions: "6.5ft (W) x 2.8ft (D) x 2.8ft (H)",
    specifications: {
      "Seating Capacity": "3 Persons",
      "Upholstery": "Heavy duty commercial grade leatherette",
      "Frame": "Treated solid sal-wood internal structure",
      "Legs": "Brushed stainless steel",
      "Ideal For": "Corporate Receptions, Waiting Areas & Clinics"
    },
    is_active: true,
    featured: false,
    price_display: "Get a Quote"
  }
];

export const CATEGORIES = [
  "All Products",
  "Office Furniture",
  "School Furniture",
  "Study Furniture",
  "Other Furniture"
];
