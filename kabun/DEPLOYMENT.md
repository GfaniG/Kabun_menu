# 🚀 KABUN COFFEE + ROASTERY (ካቡን) &bull; Production Deployment Guide

> **Project**: Kabun Coffee + Roastery (ካቡን) &bull; Commercial Digital QR Menu & Admin Suite  
> **Repository**: [https://github.com/Gfani/Kabun_menu.git](https://github.com/Gfani/Kabun_menu.git)  

This guide provides step-by-step instructions for deploying Kabun Coffee + Roastery to **Render.com** with a managed PostgreSQL database.

---

## 📋 Architectural Overview

The application is engineered as a unified, production-ready web service:
* **Backend**: Node.js + Fastify (v4) + Prisma ORM.
* **Frontend**: React 18 + Vite + Tailwind CSS (SPA).
* **Database**: Managed PostgreSQL (on Render) or SQLite (for local dev).
* **Automatic Migrations & Seeding**: The server automatically detects the database connection, pushes the Prisma schema, and seeds roastery categories, artisan menu items, and initial admin credentials (`admin` / `admin123`).

---

## 🌐 Method 1: 1-Click Render Blueprint (Recommended & Fastest)

Render's Blueprint feature reads the [`render.yaml`](../render.yaml) file at the root of the repository to automatically create both the PostgreSQL database and the Web Service with zero manual configuration.

### Steps:
1. Push all latest changes to your GitHub repository:
   ```bash
   git push origin main
   ```
2. Log into your [Render Dashboard](https://dashboard.render.com).
3. Click the **New +** button in the top navigation bar and select **Blueprint**.
4. Connect your GitHub account and select repository: **`Gfani/Kabun_menu`**.
5. Render will automatically detect `render.yaml` and show:
   * **PostgreSQL Database**: `kabun-db` (Plan: Free)
   * **Web Service**: `kabun-coffee` (Plan: Free)
6. Click **Apply**.
7. Render will automatically:
   * Provision the PostgreSQL database.
   * Link `DATABASE_URL` between database and web service.
   * Generate a secure `JWT_SECRET`.
   * Run the build command (`npm run build`).
   * Boot the web service (`npm start`).
   * Automatically run `prisma db push` and seed all Kabun categories and menu items!

---

## 🛠️ Method 2: Manual Dashboard Setup (Step-by-Step)

If you prefer to configure everything manually via the Render UI:

### Part 1: Create the Managed PostgreSQL Database on Render
1. Log into [Render Dashboard](https://dashboard.render.com).
2. Click **New +** &rarr; **PostgreSQL**.
3. Fill in the database details:
   * **Name**: `kabun-db`
   * **Database**: `kabundb`
   * **User**: `kabun`
   * **Region**: Choose the region closest to you (e.g. Frankfurt, Oregon, or Ohio).
   * **PostgreSQL Version**: 16 (default).
   * **Plan**: **Free** (or Starter for production persistence).
4. Click **Create Database**.
5. Wait ~30 seconds for the database status to turn **Available**.
6. Scroll down to the **Connections** section and copy the **Internal Database URL** (e.g., `postgresql://kabun:...@dpg-...:5432/kabundb`).
   *(Note: Use "Internal Database URL" because both the web service and database run in the same Render region, offering lowest latency and no egress fees).*

---

### Part 2: Create the Web Service on Render
1. In the Render Dashboard, click **New +** &rarr; **Web Service**.
2. Select **Build and deploy from a Git repository** and connect **`Gfani/Kabun_menu`**.
3. Configure the service:
   * **Name**: `kabun-coffee` (or your preferred name)
   * **Region**: Select the **same region** as your database!
   * **Branch**: `main`
   * **Root Directory**: Leave blank (uses root of repo)
   * **Runtime**: **Node**
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Plan**: **Free**

---

### Part 3: Configure Environment Variables
Under the **Environment Variables** section of your new Web Service, add the following key-value pairs:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `DATABASE_URL` | *(Paste Internal Database URL from Part 1)* | Connects to Render PostgreSQL |
| `JWT_SECRET` | *(Generate a 32+ character random string)* | Secret key for manager auth tokens |
| `UPLOAD_DIR` | `./uploads` | Directory for uploaded food/beverage photos |
| `PORT` | `5000` | Optional, Render auto-binds |

---

### Part 4: Deploy & Verify
1. Click **Create Web Service**.
2. Watch the deployment log:
   * Frontend will build with Vite (`kabun/frontend/dist`).
   * Schema will configure for PostgreSQL and generate Prisma client.
   * Server boots on assigned port and reports `Server listening at http://0.0.0.0:...`.
   * Schema synchronizes (`prisma db push`).
   * Default Kabun Roastery catalog is seeded.
3. Once the status shows **Live**, open your public URL:
   * **Customer Menu**: `https://kabun-coffee.onrender.com`
   * **Manager Login**: `https://kabun-coffee.onrender.com/admin/login`
     * **Default Username**: `admin`
     * **Default Password**: `admin123`
4. Log into `/admin`, navigate to **Account & Security**, change your manager username and password to your private credentials, and click **Save Account**!

---

## 🖨️ Part 5: Generate & Print Roastery Table QR Codes
1. In the `/admin` portal, click **Master QR & Table Stands**.
2. Notice the URL automatically points to your live Render domain (`https://kabun-coffee.onrender.com`).
3. Download or print the high-resolution table stand cards formatted in luxury Roastery Cream (`#F5EBDD`) and Deep Teal (`#0E2F2C`) with the Kabun roastery emblem!

---

## ⚡ Part 6: 24/7 Keep-Alive (Zero Sleep / No Spin-Down)

Render free tier web services spin down ("sleep") after 15 minutes of inactivity. When a customer scans a QR code while the service is asleep, the cold start takes 50+ seconds.

To guarantee **instant response times 24/7**, Kabun is equipped with a 3-layer anti-sleep system:

1. **Automatic Self-Ping Service (Built-in)**:
   - When running on Render, the backend automatically reads `RENDER_EXTERNAL_URL` (or `KEEP_ALIVE_URL`) and pings `/api/health` every 10 minutes.
   - Because 10 minutes is well under the 15-minute threshold, Render's inactivity timer is continuously reset.

2. **GitHub Actions 24/7 Cloud Ping (Included in repo)**:
   - The workflow file [`.github/workflows/keep-alive.yml`](../.github/workflows/keep-alive.yml) runs a cron job on GitHub servers every 10 minutes (`*/10 * * * *`).
   - GitHub Actions is 100% free with unlimited minutes on public repositories.
   - To customize the target URL, go to your GitHub Repo &rarr; **Settings** &rarr; **Secrets and variables** &rarr; **Actions** &rarr; Add repository secret `RENDER_URL` with your full URL (e.g. `https://kabun-coffee.onrender.com`). If not set, it defaults to `https://kabun-coffee.onrender.com`.

3. **External Free Uptime Monitor (Optional Backup)**:
   - You can also set up a free monitor at [Cron-Job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com) to ping `https://kabun-coffee.onrender.com/api/health` every 5-10 minutes. This gives you email notifications if Render ever undergoes maintenance.
