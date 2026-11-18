# KABUN COFFEE + ROASTERY (ካቡን) &bull; Commercial Digital QR Menu & Management Suite

> *"CRAFTED FROM COFFEE."*  
> Modern luxury digital menu and roastery operations suite built specifically for **Kabun Coffee + Roastery (ካቡን)** (Mekelle, Tigray, Ethiopia).

---

## 🌟 Overview & Architecture

This suite consists of two high-performance decoupled systems:
1. **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons, TanStack Query v5.
2. **Backend**: Fastify v4, TypeScript, Prisma ORM, SQLite database (`dev.db`), JWT Auth, Multipart Image Uploads.

---

## 📁 Project Structure

```
kabun/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Category, MenuItem, Admin, SiteSetting, Analytics models
│   │   └── seed.ts             # Seeds roastery coffee and bakery items, settings, and admin
│   ├── src/
│   │   ├── config/             # database.ts (PrismaClient), env.ts
│   │   ├── controllers/        # auth.controller.ts, menu.controller.ts, settings.controller.ts, analytics.controller.ts
│   │   ├── hooks/              # auth.hook.ts (JWT verification)
│   │   ├── routes/             # auth.routes.ts, menu.routes.ts, settings.routes.ts, analytics.routes.ts
│   │   ├── services/           # menu.service.ts, storage.service.ts
│   │   ├── types/              # index.ts (TypeScript DTOs)
│   │   └── app.ts              # Fastify server bootstrap & static frontend serving
│   ├── uploads/                # Local uploaded coffee and pastry photography
│   ├── .env                    # PORT=5000, JWT_SECRET, DATABASE_URL
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── public/
    │   ├── assets/kabun/       # Vector emblems (dark & cream), ambient roastery photos
    │   └── favicon.svg         # Signature Kabun Coffee Bean emblem
    ├── src/
    │   ├── api/
    │   │   └── client.ts       # Typed Fetch API client
    │   ├── components/
    │   │   ├── admin/          # AdminHeader, CategoryManager, ItemFormModal, ItemListTable, TableQRModal, SiteSettingsCMS, AnalyticsDashboard
    │   │   ├── customer/       # MenuHeader, CategoryTabs, MenuCard, MenuItemRow, KabunRoasteryRibbon
    │   │   └── ui/             # Button, Input, Modal
    │   ├── context/            # AuthContext.tsx, ThemeContext.tsx (Dark Teal vs Cream)
    │   ├── hooks/              # useMenu.ts (React Query hooks & optimistic mutations)
    │   ├── pages/              # CustomerMenu.tsx, AdminLogin.tsx, AdminDashboard.tsx
    │   ├── types/              # menu.ts
    │   ├── App.tsx             # React Router setup & ErrorBoundary
    │   ├── index.css           # Tailwind base & luxury scrollbars
    │   └── main.tsx
    ├── .env                    # VITE_API_URL=http://localhost:5000
    ├── package.json
    ├── tailwind.config.js      # Kabun palette (#0E2F2C, #133834, #E5CFAF, #FAF7F2)
    └── vite.config.ts          # Reverse proxy to backend API & uploads
```

---

## 🎨 Design & Brand Identity
- **Mode A: Midnight Roastery (Dark Mode)**
  - Background: `#0E2F2C` (Deep Roastery Forest Teal)
  - Cards & Containers: `#133834` with subtle `#1D4D47` borders
  - Accents & Badges: `#E5CFAF` (Roasted Oat Cream)
  - Typography: `#FAF7F2` (Warm Alabaster) & `#C5D5D3`
- **Mode B: Roastery Cream (Light Mode)**
  - Background: `#FAF6F0` / `#F5EBDD` (Warm Roasted Oat parchment)
  - Cards & Inputs: `#FAF6F0` with subtle `#DFC9AA` borders
  - Primary Typography & Geez: `#0E2F2C` (Deep Forest Teal)
  - Inverted Brand Emblem: Deep teal coffee bean on cream circular emblem

---

## 📱 Customer Features (`/`)
1. **Header & Navigation Bar**:
   - **Color Inversion Toggle (`🌓`)**: Seamless 1-tap transition between Midnight Teal and Roastery Cream ambiance.
   - **Complimentary Guest Wi-Fi**: Network `Kabun_Guest_WiFi`, password `craftedfromcoffee` with 1-click clipboard copy.
   - **Direct Contact & Social**: 1-tap phone calls, Instagram, TikTok, and Facebook links.
2. **Two-Tier Craft Hierarchy**:
   - **☕ COFFEE & BEVERAGES**: Espresso & Hot Classics, Roastery Pour-Over (V60, Chemex, Jebena Buna), Signature Cold Brews, Iced Spanish Lattes, Frappes & Shakes, Artisanal Teas & Fresh Juices.
   - **🥐 BAKERY, PASTRIES & BITES**: Fresh Viennoiserie (Butter Croissant, Pain au Chocolat), Artisan Cakes, and Light Savory Breakfast Bites.
3. **Live Search**: Instant text filtering by drink name, description, or origin bean.
4. **Accordion Expandable Item Rows**:
   - Ultra-compact default row: Drink name and price in ETB with chevron toggle.
   - Expanded state: High-resolution beverage photograph, tasting notes, dietary badges, live availability, and dynamic pricing tag.

---

## 🔐 Admin Console (`/admin`)
- **Login Credentials**:
  - **Email**: `admin@kabuncoffee.com`
  - **Password**: `adminpassword` (or `admin123`)
- **Menu Items & Live Pricing**:
  - Create drinks and bites with image upload, category, tags, and price.
  - Inline 5-second price editing directly from table rows.
  - 1-click out-of-stock toggle (`isAvailable`) with real-time customer sync.
- **Master QR Stand Generator**:
  - Generates 4x6" acrylic table tent cards in either **☀️ Roastery Cream** or **🌙 Midnight Teal**.
  - QR Code colors: Warm Cream background (`#E5CFAF`) with Deep Teal pattern (`#0E2F2C`).
  - High-res PNG download & direct print preview.
- **Site Settings & Live CMS**:
  - Live customization of hero headlines, philosophy text, Wi-Fi credentials, and ambiance defaults.
- **Real-Time Analytics**:
  - Tracks total table QR scans, menu impressions, and dish expansions with a live popularity ranking.
