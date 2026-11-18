# ☁️ KABUN COFFEE + ROASTERY (ካቡን) &bull; Azure Deployment Guide (Docker)

> **Project**: Kabun Coffee + Roastery (ካቡን) &bull; Commercial Digital QR Menu & Admin Suite  
> **Repository**: [https://github.com/Gfani/Kabun_menu.git](https://github.com/Gfani/Kabun_menu.git)  

This guide walks you through deploying your Dockerized Kabun Coffee + Roastery menu and management suite directly to **Microsoft Azure** or any containerized hosting provider.

---

## 🚀 Quick Setup with Azure App Service (Linux Web App)

1. **Create Azure Resource Group**:
   ```bash
   az group create --name rg-kabun-coffee --location southafricanorth
   ```

2. **Create App Service Plan**:
   ```bash
   az appservice plan create --name plan-kabun-coffee --resource-group rg-kabun-coffee --sku B1 --is-linux
   ```

3. **Deploy Container from GitHub**:
   ```bash
   az webapp create \
     --resource-group rg-kabun-coffee \
     --plan plan-kabun-coffee \
     --name kabun-coffee-menu \
     --deployment-source-url https://github.com/Gfani/Kabun_menu.git \
     --deployment-source-branch main
   ```

4. **Set Environment Variables**:
   ```bash
   az webapp config appsettings set --resource-group rg-kabun-coffee --name kabun-coffee-menu --settings \
     NODE_ENV=production \
     PORT=5000 \
     JWT_SECRET=kabun-coffee-roastery-azure-key-2026 \
     DATABASE_URL=file:./prisma/dev.db \
     UPLOAD_DIR=/app/uploads
   ```

5. **Verify Live Deployment**:
   * Customer Menu: `https://kabun-coffee-menu.azurewebsites.net`
   * Admin Portal: `https://kabun-coffee-menu.azurewebsites.net/admin/login`
