# 🚀 KABUN COFFEE + ROASTERY (ካቡን) &bull; Production Deployment Guide

> **Project**: Kabun Coffee + Roastery (ካቡን) &bull; Commercial Digital QR Menu & Admin Suite  
> **Repository**: [https://github.com/Gfani/Kabun_menu.git](https://github.com/Gfani/Kabun_menu.git)  

This guide provides step-by-step instructions for deploying the system into live production so customers can scan table QR codes from their phones and roastery management can access the admin dashboard.

---

## 📋 Architectural Overview

The application is engineered as a unified, high-performance web service:
* **Backend**: Node.js + Fastify (v4) + Prisma ORM.
* **Frontend**: React 18 + Vite + Tailwind CSS + PWA Service Worker (pre-built into `kabun/frontend/dist`).
* **Unified Serving**: The Fastify backend directly serves the pre-compiled frontend SPA, uploaded photos (`/uploads/`), and REST API on a single port (`PORT=5000` or assigned by host).
* **Live Sync**: 3-second polling interval ensures price edits and sold-out toggles appear across all customer devices automatically.

---

## 🌐 Option 1: Cloud Deployment on Render.com (Recommended)

Render provides hosting with automatic SSL (`https://`), GitHub auto-deploys via Blueprint (`render.yaml`).

### Step 1: Create a Render Web Service
1. Log in to [Render](https://render.com).
2. Click **New +** &rarr; **Blueprint** (or **Web Service**).
3. Connect your repository: `Gfani/Kabun_menu`.
4. Render automatically reads `render.yaml` at the root of the repository:
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Health Check**: `/api/health`
5. Configure environment variables in Render:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `JWT_SECRET` | *(Generate or type secret key)* |
   | `DATABASE_URL` | `file:./prisma/dev.db` (or PostgreSQL URL) |
   | `UPLOAD_DIR` | `./uploads` |

### Step 2: Live Verification
1. Access `https://your-app-name.onrender.com`.
2. Access `https://your-app-name.onrender.com/admin/login` (Default username: `admin`, password: `adminpassword`).
3. Open **Master QR** in `/admin` and print your official table stand cards!

---

## 💻 Option 2: Local Café Wi-Fi Deployment (Windows Server / Cashier PC)

For offline cafés or local dining without internet dependency:
1. Double-click `start-kabun.bat` in the repository root.
2. The batch script detects your local IP (e.g. `192.168.1.100:5000`).
3. Guests connect to your café Wi-Fi (`Kabun_Guest_WiFi`) and scan the QR stand!
