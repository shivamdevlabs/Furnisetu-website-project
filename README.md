# Mr. Office — Full-Stack Furniture Business Platform

A modern, production-grade full-stack web platform built for **Mr. Office**, a premier furniture business located in **Agra, Uttar Pradesh, India**.

Mr. Office specializes in order-based furniture procurement and supply, primarily focused on:
- **Office Furniture** (Workstations, Executive Desks, Conference Tables, Ergonomic Chairs, Storage)
- **School & Classroom Furniture** (Student Desks & Benches, Teacher Tables, Storage)
- **Study Furniture** (Study Desks, Ergonomic Study Chairs, Modular Bookcases)
- **Custom Institutional Furniture** (arranged on request from top manufacturers)

---

## Tech Stack

### Frontend
- **Framework:** React.js 19 (Vite 8)
- **Styling:** Tailwind CSS v4 (with official Mr. Office brand color palette)
- **Routing:** React Router v7
- **HTTP Client:** Axios with JWT request & response interceptors
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python 3.14 / 3.10+)
- **Validation:** Pydantic v2 & Pydantic-Settings
- **Server:** Uvicorn (ASGI)
- **Authentication:** JWT (PyJWT) + direct bcrypt password hashing
- **Database Driver:** Motor (async MongoDB) + PyMongo

### Database
- **Database:** MongoDB Atlas / Local MongoDB
- **Collections:** `users`, `products`, `enquiries`, `settings`
- **Indexing:** Automated index creation on startup

---

## Project Structure

```text
mr-office/
├── backend/
│   ├── app/
│   │   ├── core/           # Config, bcrypt security, logging
│   │   ├── database/       # Async Motor connection & indexes
│   │   ├── dependencies/   # DB and JWT auth guards
│   │   ├── routers/        # Auth, products, enquiries, settings, admin
│   │   ├── schemas/        # Pydantic v2 request/response models
│   │   └── main.py         # FastAPI app factory & lifespan
│   ├── tests/              # Verification test suites
│   ├── .env.example        # Backend environment template
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Isolated virtual environment
├── frontend/
│   ├── public/             # Static assets (including brand logo)
│   ├── src/
│   │   ├── assets/         # Mr. Office official brand assets
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Public and Admin layouts
│   │   ├── pages/          # Home, About, Products, Details, Contact, Admin
│   │   ├── services/       # Centralized Axios API client
│   │   ├── App.jsx         # Root component & routing
│   │   ├── main.jsx        # App mounting
│   │   └── index.css       # Tailwind v4 theme setup
│   ├── .env.example        # Frontend environment template
│   ├── package.json        # Node dependencies & scripts
│   └── vite.config.js      # Vite configuration with @tailwindcss/vite
├── .gitignore              # Repository git ignore rules
├── README.md               # Project documentation
└── DEPLOYMENT.md           # Production deployment guide
```

---

## Quickstart & Local Setup

### Prerequisites
- Node.js 18+ (Node 24 recommended)
- Python 3.10+ (Python 3.14 tested and verified)
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Database Setup (Local)
A portable MongoDB server is included for 1-click local startup:
```bash
# On Windows, run:
./start-mongodb.bat
```
MongoDB Compass can connect directly to `mongodb://localhost:27017` to inspect `mr_office_db`.

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env

# Seed initial admin, business settings, and catalog (runs once):
python -m app.database.seed

# Run automated tests
pytest -v

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend API will be running at: `http://localhost:8000`
Interactive Swagger Docs: `http://localhost:8000/api/docs`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Run development server
npm run dev

# Run production build check
npm run build
```
Frontend will be running at: `http://localhost:5173`

---

## Admin Portal & Default Credentials
- **Admin Login URL:** `http://localhost:5173/admin/login`
- **Default Email:** `admin@mroffice.in`
- **Default Password:** `Admin@Shivam142` *(or as set in `backend/.env`)*

---

## Security Practices
- **Never commit `.env` files** or database credentials to version control.
- **Passwords are hashed** with bcrypt salt before saving to MongoDB.
- **JWT tokens** are digitally signed and verified on every admin endpoint.
- **Role-based authorization** ensures only admin accounts can access administrative actions.
- **CORS** is strictly bounded to allowed frontend origins.
- **Input validation** is enforced on all endpoints via Pydantic v2.

---

## Developer Credit
- **Developed by:** [Shivam Srivastava](https://shivam-srivastava-portfolio.vercel.app/)
- **Portfolio:** [https://shivam-srivastava-portfolio.vercel.app/](https://shivam-srivastava-portfolio.vercel.app/)
- **Business:** Mr. Office (Agra, Uttar Pradesh, India)
