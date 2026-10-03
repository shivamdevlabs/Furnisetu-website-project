# Production Deployment Guide — Mr. Office

This document provides complete, production-grade deployment instructions for the **Mr. Office** full-stack furniture business platform.

---

## 1. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        MR. OFFICE ARCHITECTURE                         │
├──────────────────────────┬─────────────────────────────────────────────┤
│   FRONTEND HOSTING       │   BACKEND API HOSTING                       │
│   • Vercel / Netlify     │   • Render / Railway / Linux VPS            │
│   • React 19 + Vite 8    │   • Python 3.10+ / FastAPI + Uvicorn        │
│   • Static SPA delivery  │   • Multi-worker ASGI daemon                │
│   • Custom domain        │   • Rate limited via SlowAPI                │
├──────────────────────────┴─────────────────────────────────────────────┤
│   DATABASE CLUSTER                                                     │
│   • MongoDB Atlas (Free M0 or Dedicated M10+)                          │
│   • Encrypted at rest, TLS 1.3 in transit, automated replica sets      │
│   • Collections: users, products, enquiries, settings                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Step 1: Database Setup (MongoDB Atlas)

1. **Create an Atlas Account:**
   Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register/log in.

2. **Deploy a Free Cluster:**
   - Choose **Shared Cluster (M0)** (Free forever).
   - Select cloud provider (AWS recommended) and region closest to India (e.g. `ap-south-1` Mumbai).
   - Cluster Name: `mr-office-cluster`.

3. **Configure Database Access:**
   - Go to **Security > Database Access > Add New Database User**.
   - Authentication Method: **Password**.
   - Username: `mroffice_admin`.
   - Password: Generate a strong, secure 24-character password.
   - Built-in Role: **Read and write to any database**.

4. **Configure Network Access:**
   - Go to **Security > Network Access > Add IP Address**.
   - Add `0.0.0.0/0` (Allow Access from Anywhere) so your cloud hosting providers (Vercel/Render) can connect securely using TLS and password credentials.

5. **Retrieve Connection String:**
   - Click **Connect** on your cluster > Choose **Drivers** (Python 3.12+).
   - Copy your connection string:
     ```text
     mongodb+srv://mroffice_admin:<PASSWORD>@mr-office-cluster.xxxx.mongodb.net/mr_office_db?retryWrites=true&w=majority
     ```
   - Replace `<PASSWORD>` with your actual password and ensure the database name is `mr_office_db`.

---

## 3. Step 2: Backend API Deployment

You can deploy the FastAPI backend using **Option A (Render.com - Easiest)** or **Option B (Ubuntu Linux VPS - Maximum Control)**.

### Option A: Render.com (Recommended Free/Standard Cloud Hosting)

1. **Create a New Web Service:**
   - Log into [Render.com](https://render.com/).
   - Click **New +** > **Web Service**.
   - Connect your GitHub repository (`mr-office`).

2. **Configure Service Settings:**
   - **Name:** `mr-office-api`
   - **Region:** Singapore / Frankfurt / Oregon
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install --upgrade pip && pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 4
     ```

3. **Configure Environment Variables in Render:**
   In the **Environment** tab, add the following key-value pairs:

   | Key | Value / Guidance |
   |---|---|
   | `ENVIRONMENT` | `production` |
   | `DEBUG` | `False` |
   | `BUSINESS_NAME` | `Mr. Office` |
   | `BUSINESS_TAGLINE` | `Professional Furniture Solutions` |
   | `DATABASE_NAME` | `mr_office_db` |
   | `MONGODB_URI` | `mongodb+srv://mroffice_admin:<PASSWORD>@mr-office-cluster.xxxx.mongodb.net/mr_office_db?retryWrites=true&w=majority` |
   | `JWT_SECRET` | *Run `openssl rand -hex 32` and paste a random 64-char string* |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
   | `DEFAULT_ADMIN_EMAIL` | `admin@mroffice.in` |
   | `DEFAULT_ADMIN_PASSWORD` | *Strong production password (e.g. `Admin@MrOfficeSecure2026!`)* |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app,https://mroffice.in,https://www.mroffice.in` |

4. **Seed Production Database:**
   Once the service builds and deploys successfully:
   - Go to Render dashboard > **Shell**.
   - Run:
     ```bash
     python -m app.database.seed
     ```
   - This creates your production admin account, default business contact settings, and initial catalog.

---

### Option B: Ubuntu Linux VPS (Ubuntu 22.04 / 24.04 LTS)

If hosting on an AWS EC2, DigitalOcean Droplet, or Linode VPS:

1. **System Packages:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y python3-pip python3-venv nginx certbot python3-certbot-nginx git
   ```

2. **Clone & Virtualenv:**
   ```bash
   cd /var/www
   sudo git clone https://github.com/your-username/mr-office.git
   cd mr-office/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Configure Production `.env`:**
   ```bash
   cp .env.example .env
   nano .env
   # Update MONGODB_URI, JWT_SECRET, CORS_ORIGINS, and strong admin password
   python -m app.database.seed
   ```

4. **Create Systemd Service (`/etc/systemd/system/mr-office.service`):**
   ```ini
   [Unit]
   Description=Mr. Office FastAPI Backend
   After=network.target

   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/var/www/mr-office/backend
   Environment="PATH=/var/www/mr-office/backend/venv/bin"
   ExecStart=/var/www/mr-office/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4

   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   ```
   Start and enable the service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start mr-office
   sudo systemctl enable mr-office
   sudo systemctl status mr-office
   ```

5. **Nginx Reverse Proxy Configuration (`/etc/nginx/sites-available/api.mroffice.in`):**
   ```nginx
   server {
       server_name api.mroffice.in;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   Enable site and obtain SSL:
   ```bash
   sudo ln -s /etc/nginx/sites-available/api.mroffice.in /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo certbot --nginx -d api.mroffice.in
   ```

---

## 4. Step 3: Frontend SPA Deployment (Vercel)

Vercel provides edge CDN delivery, automatic SSL, and instant global cache invalidation.

1. **Import Repository to Vercel:**
   - Log into [Vercel.com](https://vercel.com/) with GitHub.
   - Click **Add New... > Project** and select `mr-office`.

2. **Configure Project Settings:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click `Edit` and select `frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Configure Environment Variables:**
   Under **Environment Variables**, add:
   | Key | Production Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://mr-office-api.onrender.com` *(or `https://api.mroffice.in`)* |

4. **Verify SPA Routing:**
   The repository already includes `frontend/vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   This ensures direct access to `/products`, `/about`, `/contact`, and `/admin/login` works without 404 errors.

5. **Deploy:**
   Click **Deploy**. Your frontend will be live at `https://your-project.vercel.app` in ~60 seconds.

6. **Add Custom Domain:**
   - In Vercel Project Settings > **Domains**, add `mroffice.in` and `www.mroffice.in`.
   - Point the DNS records (A record to `76.76.21.21` or CNAME to `cname.vercel-dns.com`).

---

## 5. Post-Deployment Verification Checklist

Once both services are deployed, verify every layer of the platform:

- [ ] **API Health:** Visit `https://api.yourdomain.com/api/health` — confirm:
  ```json
  {"status": "healthy", "environment": "production", "database": {"status": "connected", "name": "mr_office_db", "mode": "live_mongodb"}}
  ```
- [ ] **CORS Check:** Ensure backend `CORS_ORIGINS` includes your production frontend domain (with and without `www`).
- [ ] **Public Catalog:** Navigate to `/products` on the frontend; verify products load from the database.
- [ ] **Enquiry Form:** Submit a test quote request from the homepage or contact modal; verify 201 Created response.
- [ ] **Admin Authentication:** Navigate to `/admin/login`; log in with your admin credentials.
- [ ] **Admin Dashboard:** Confirm statistics cards display live counts and enquiry table shows the new enquiry.
- [ ] **Settings Update:** Modify a contact phone number or business hours in Admin Settings; verify changes reflect across the public navbar and footer immediately.
- [ ] **SSL / HTTPS:** Ensure all traffic redirects to HTTPS automatically without mixed content warnings.

---

## 6. Maintenance & Operational Procedures

### Resetting Admin Password
If you ever need to reset or rotate the admin password in production:
1. Connect to your backend shell (e.g. Render Shell or VPS SSH).
2. Run python in the backend environment:
   ```bash
   python -c "
   import asyncio
   from motor.motor_asyncio import AsyncIOMotorClient
   from app.core.security import hash_password
   from app.core.config import settings

   async def reset():
       client = AsyncIOMotorClient(settings.MONGODB_URI)
       db = client[settings.DATABASE_NAME]
       new_hash = hash_password('YourNewSecurePassword123!')
       await db.users.update_one({'email': 'admin@mroffice.in'}, {'$set': {'password_hash': new_hash}})
       print('Password reset successfully.')

   asyncio.run(reset())
   "
   ```

### Database Backups
- In MongoDB Atlas, automated continuous backups are included under **Backup**.
- To take an on-demand manual backup from your machine:
  ```bash
  mongodump --uri="mongodb+srv://mroffice_admin:<PASSWORD>@mr-office-cluster.xxxx.mongodb.net/mr_office_db" --out=./backup-$(date +%F)
  ```

### Inspecting Production Logs
- **Render.com:** Click your Web Service > **Logs** tab (real-time stream).
- **Ubuntu VPS:**
  ```bash
  sudo journalctl -u mr-office -f -n 100
  sudo tail -f /var/log/nginx/error.log
  ```
