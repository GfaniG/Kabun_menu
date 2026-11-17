# KABUN COFFEE + ROASTERY (ካቡን) &bull; Commercial Digital QR Menu & Management Suite

> *"CRAFTED FROM COFFEE."*  
> A high-performance, mobile-first, in-café digital QR menu and roastery management suite built specifically for **Kabun Coffee + Roastery (ካቡን)** (Mekelle, Tigray, Ethiopia).

---

## 🌟 Overview & Key Capabilities

This suite replaces traditional physical paper menus with an interactive, instant-loading digital menu and barista management suite designed for specialty coffee roastery operations.

### ☕ 1. Customer Roastery Experience (Mobile QR View)
- **Zero-App Instant Load (< 0.5s)**: Progressive Web App (PWA) with Service Worker offline caching (`sw.js`). Specialty coffee drinks and pastries open instantly even on slow 3G network connections.
- **Bespoke Specialty Roastery Aesthetic**: Deep Roastery Forest Teal (`#0E2F2C`), Warm Roasted Oat / Parchment Cream (`#E5CFAF`), Warm Alabaster (`#FAF7F2`) cards, and Deep Charcoal/Espresso typography (`#1A1817`).
- **Two-Tier Craft Hierarchy**:
  - **☕ COFFEE & BEVERAGES (ቡንን መስተታትን / ቡና እና መጠጦች)**: Espresso & Hot Classics, Roastery Pour-Over (V60, Chemex, Jebena Buna), Signature Cold Brews, Iced Spanish Lattes, Frappes & Shakes, Artisanal Teas & Fresh Juices.
  - **🥐 BAKERY, PASTRIES & BITES (መቁርስን ፓስትሪን / ቁርስ እና ፔስትሪ)**: Fresh Viennoiserie (Butter Croissant, Pain au Chocolat), Artisan Cakes (Tiramisu, Cheesecake), and Light Savory Breakfast Bites (Avocado Toast, Paninis).
- **3-Language Instant Switcher**: Full trilingual support switchable with 1 tap:
  - **English (`EN`)**
  - **ትግርኛ / Tigrinya (`ትግ`)**
  - **አማርኛ / Amharic (`አማ`)**
- **Single Master QR Code**: No confusing per-table QR printing or fragile hardware dependencies. One master QR code prints on acrylic table tents, counter displays, and roastery tables.
- **Zero Waiter Tablet Burden**: Waiters and baristas do not need expensive dedicated tablets; customers browse effortlessly on their own smartphones, allowing staff to provide warm, artisanal hospitality.
- **Complimentary Guest Wi-Fi**: 1-tap SSID and password copy (`Kabun_Guest_WiFi`) with live credentials pulled directly from the manager dashboard.
- **Social & Location**: Direct links to official Instagram (`@kabun_coffee`), TikTok (`@kabuncoffee`), Facebook, and 1-tap phone calls.

---

### 🛡️ 2. Admin & Roastery Management Portal (`/admin`)
- **Strict Security Lockdown**:
  - Customer-facing pages contain zero visible admin links.
  - Any direct visit to `/admin` forces the **Login Page (`/admin/login`)** first.
  - Cryptographic `bcrypt.compare` password authentication. Incorrect passwords return `401 Unauthorized` with a 5-attempt brute-force rate-limiting lockout.
  - Session-scoped security (`sessionStorage`) ensures credentials never linger on shared tablets or customer devices.
  - Discreet hidden staff portal shortcut `🔒` in the menu footer for staff phones.
- **100% Mobile-Responsive Management**:
  - Built specifically for managers walking the floor with a smartphone.
  - Desktop tables automatically convert into touch-friendly **Mobile Cards** on small screens.
  - **1-Tap Item Availability Toggle**: Instantly mark any drink or pastry as *"Live on Menu"* or *"Sold Out / Hidden"* when ingredients or daily bake runs low.
  - **Inline Live Price Editor**: Change prices in ETB in under 5 seconds directly from the mobile card.
- **Visual CMS & Live Customization**:
  - Update roastery name, taglines, hero titles, roastery craft manifesto, and address live without touching code.
  - Update guest Wi-Fi SSID and password instantly.
  - Adjust theme colors (Teal, Cream, Canvas) and typography fonts.
  - **1-Click "Restore to Default"**: Safety net to revert any mistake back to Kabun factory defaults instantly.
- **Menu Analytics & Popular Items Leaderboard**:
  - Unified **Total QR Scans** counter tracking physical table scans.
  - **Total Menu Impressions** and **Drinks & Bites Explored**.
  - Real-time **Popular Coffee & Bites Leaderboard** showing the top items guests browse most frequently.
- **1-Click Master QR Stand Card Generator**:
  - Generates high-resolution 4x6" acrylic table tent cards featuring the vector Kabun Coffee Emblem, "CRAFTED FROM COFFEE — SCAN FOR MENU & WI-FI" badge, and guest Wi-Fi info.
  - Ready for immediate 4x6" / A5 printing or high-res PNG download.
- **1-Page Manager Cheatsheet Guide**:
  - Accessible via "Manager Guide" in the admin header with 1-click A4 printing for staff onboarding.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript** and **Vite**
- **Tailwind CSS** with bespoke Kabun color tokens (`#0E2F2C`, `#E5CFAF`, `#133834`, `#1D4D47`, `#FAF7F2`)
- **TanStack React Query v5** for 3-second live polling and optimistic updates
- **Lucide Icons** for refined iconography
- **HTML2Canvas** & **JSPDF** for high-resolution QR tent card exports

### Backend & Database
- **Fastify v4** high-throughput TypeScript server
- **Prisma ORM** supporting SQLite (`file:./dev.db`) for zero-config offline local deployment, with instant PostgreSQL compatibility for cloud deployment
- **BcryptJS** & **JWT** for secure password hashing and admin authentication
- **Multer / Static File Serving** for roastery photo uploads

---

## 🚀 Quick Start (Local Windows Deployment)

1. Double-click **`start-kabun.bat`** (or run `npm start`).
2. The server will detect your local network IP (e.g. `192.168.1.100`) and boot the unified port on `5000`.
3. Open in your browser:
   - **Customer Menu:** `http://localhost:5000` (or `http://<YOUR_LOCAL_IP>:5000`)
   - **Admin Management:** `http://localhost:5000/admin/login` (Default username: `admin`, password: `adminpassword123`)
