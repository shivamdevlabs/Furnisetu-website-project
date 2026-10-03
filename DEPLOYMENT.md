# Production Deployment Guide — Mr. Office

This document provides step-by-step instructions for deploying the **Mr. Office** full-stack furniture business platform to production environments (e.g. AWS, Render, Railway, DigitalOcean, Vercel, or VPS).

---

## 1. Architecture Overview

- **Frontend:** Static Single Page Application (SPA) built with React + Vite + Tailwind CSS. Can be deployed to Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront, or Nginx.
- **Backend:** Python FastAPI application running via Uvicorn (or Gunicorn with Uvicorn workers). Can be deployed to Render, AWS ECS / EC2, Railway, DigitalOcean App Platform, or a Linux VPS with systemd + Nginx reverse proxy.
- **Database:** MongoDB Atlas managed cluster with network access rules, database users, and automatic backups.

---

## 2. MongoDB Atlas Configuration

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user with read/write access to `mr_office_db`.
3. Under **Network Access**, whitelist your backend server IP (or `0.0.0.0/0` with strong password authentication).
4. Retrieve your connection string URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/mr_office_db?retryWrites=true&w=majority
   ```

---

## 3. Backend Deployment

### Environment Variables
Configure the following in your hosting provider's dashboard:

| Variable | Description | Example Production Value |
|---|---|---|
| `ENVIRONMENT` | Environment mode | `production` |
| `DEBUG` | FastAPI debug docs toggle | `False` |
| `HOST` | Server bind host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | `https://mroffice.in,https://www.mroffice.in` |
| `MONGODB_URI` | MongoDB Atlas URI | `mongodb+srv://user:pass@cluster0...` |
| `DATABASE_NAME` | Database name | `mr_office_db` |
| `JWT_SECRET` | 64-character random secret | *(generate with `openssl rand -hex 32`)* |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | `1440` (24h) |
| `DEFAULT_ADMIN_EMAIL` | Initial Admin Email | `admin@mroffice.in` |
| `DEFAULT_ADMIN_PASSWORD` | Strong Initial Admin Password | *(use a 16+ character complex string)* |

### Production Run Command
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 4. Frontend Deployment

### Environment Variables
Configure in your frontend hosting dashboard (e.g. Vercel / Netlify):

| Variable | Description | Example Production Value |
|---|---|---|
| `VITE_API_BASE_URL` | Production Backend API URL | `https://api.mroffice.in` |

### Build Command & Output Directory
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **SPA Routing Rewrite Rule:** Redirect all routes `/*` to `/index.html` (status 200).

---

## 5. Domain, HTTPS & Security Checklist

- [ ] Connect custom domains: `mroffice.in` (frontend) and `api.mroffice.in` (backend).
- [ ] Enforce HTTPS / TLS certificates via Cloudflare or Let's Encrypt.
- [ ] Verify `CORS_ORIGINS` matches the production domain exactly.
- [ ] Verify `DEBUG=False` in backend so Swagger docs and internal tracebacks are not public.
- [ ] Change the default admin password immediately after first login.
