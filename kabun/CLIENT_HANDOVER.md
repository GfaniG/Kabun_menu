# 📜 KABUN COFFEE + ROASTERY (ካቡን) &bull; Client Operations & Handover Guide

> **Recipient**: Management & Staff &bull; Kabun Coffee + Roastery (ካቡን)  
> **Location**: Kebele 17, Mekelle, Tigray, Ethiopia  
> **System**: Commercial In-Café Digital QR Menu & Roastery Operations Suite  

---

## 🌟 1. Welcome to Your New Digital Menu System

This suite transforms your specialty café and roastery dining experience from paper menus to a high-end, interactive digital menu. It is custom-tailored for your roastery lounge and bistro in Kebele 17, combining Ethiopian single-origin coffee heritage with modern luxury architectural aesthetics.

### What Your Roastery Gets:
1. **Instant QR Menu**: Diners point their phone camera at the acrylic table stand and the menu loads in **less than 0.5 seconds**.
2. **One Master QR Code**: You only need to print **one single QR stand design** for all café tables, the pour-over bar, and outdoor roastery seats.
3. **Zero Tablet Overhead (No Hardware to Buy)**: Waiters and baristas do not need expensive dedicated tablets. The digital menu runs directly in your customer's browser, allowing baristas to focus on craft coffee and hospitality.
4. **Seamless Dual-Ambiance Switcher**: Guests can toggle freely between **Midnight Roastery** (cozy evening teal) and **Roastery Cream** (sunlit daytime parchment).
5. **Full Manager Control on Your Phone**: You can update prices in 5 seconds, hide sold-out beans or pastries, change the Wi-Fi password, and customize colors/text on your smartphone without hiring a developer.

---

## 🔐 2. Accessing the Management Portal

### How to Log In:
1. On your phone, tablet, or computer, open your browser and navigate to:
   * **`https://your-domain.com/admin`** *(or `http://localhost:5000/admin` during local testing)*
2. **Hidden Staff Shortcut**: On the customer menu page, scroll all the way down to the footer. Right beside *"Crafted from coffee."*, tap the subtle lock icon `🔒`.

### Default Manager Credentials:
* **Username**: `admin` *(or Email: `admin@kabuncoffee.com`)*
* **Password**: `adminpassword` (or `admin123`)

### Security Guarantees:
* **The Login Page Is Always Shown First**: Unauthorized users or customers browsing the Wi-Fi will never bypass the password.
* **Brute-Force Lockout**: 5 consecutive wrong passwords locks the login form for 30 seconds.
* **Automatic Session Clearing**: When you close your browser tab or tap **Logout**, your session ends immediately.

### Changing Your Password & Email:
1. Log in to the management dashboard.
2. In the top-right header, tap the **Shield / Manager Profile** button.
3. Enter your current password and your new desired password.
4. Tap **"Save Security Settings"**.

---

## ⚡ 3. Daily Operations Checklist (How-To in 10 Seconds)

### A. Updating a Drink / Bite Price (5 Seconds)
1. On your phone, log in to `/admin`.
2. Find the item in the **Menu Items & Live Pricing** tab.
3. Tap the cream price box (ETB), type the new price, and tap the checkmark.
4. Customer phones refresh within 3 seconds.

### B. Marking an Item Out of Stock / Sold Out (3 Seconds)
1. In the **Menu Items** tab, find the coffee drink or daily pastry that ran low.
2. Under **Menu Visibility**, tap the **Eye icon**.
3. The item turns grey and is immediately hidden on all customer screens. Tap again to restore when restocked.

### C. Updating the Guest Wi-Fi Password (10 Seconds)
1. In `/admin`, tap the **Customize Menu & Live CMS** tab.
2. Tap the **Guest Wi-Fi** section.
3. Enter your new network name (SSID) or password.
4. Tap **"Save Live Changes"**. All customer devices and table cards display the new password immediately.

---

## 🖨️ 4. Printing Table Stands & Master QR Cards

1. Log in to `/admin` on your computer or phone.
2. In the top navigation bar, tap the gold **"Master QR"** button.
3. Choose your preferred stand ambiance:
   - **☀️ Roastery Cream Stand (Recommended)**: Warm ivory parchment background, deep forest teal borders, and teal-on-cream QR code.
   - **🌙 Midnight Teal Stand**: Deep Forest Teal background with roasted oat cream accents.
4. Tap **"Print Stand Card"** (sized for 4x6" acrylic stands) or **"Download High-Res PNG"** for commercial printing.
5. Place the printed stands on all café tables and counter stations.

---

## 📊 5. Tracking Customer Interest & Popularity

In `/admin`, tap the **Analytics & Scans** tab:
* **Total Table QR Scans**: Tracks every physical table scan.
* **Total Menu Impressions**: Total times customers opened the menu.
* **Drinks & Bites Explored**: Expansions to view coffee tasting notes and pastry photos.
* **Popular Coffee & Bites Leaderboard**: Live ranking of what customers are browsing most.

---

## 🌐 6. Technical Specifications & Maintenance

* **Technology**: Node.js, Fastify, TypeScript, React 18, Vite, Tailwind CSS, Prisma ORM.
* **Repository**: [`https://github.com/Gfani/Kabun_menu.git`](https://github.com/Gfani/Kabun_menu.git)
* **Local Run Script**: Double-click `start-kabun.bat` on your cashier/server PC.
