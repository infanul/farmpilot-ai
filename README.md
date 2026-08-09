# 🌾 FarmPilot AI — Full-Stack Digital Farming Platform

> **Tagline**: *"Smarter Decisions. Healthier Crops. Better Harvests."*

FarmPilot AI is an all-in-one digital agriculture ecosystem powered by **Next.js 14+**, **TypeScript**, **Tailwind CSS**, **Express.js**, **Prisma ORM**, and **SQLite**.

---

## 🏗️ Project Structure

This folder (`Farmpilot AI`) is the **root** of the project:

```
Farmpilot AI/
├── frontend/               # Next.js 14+ App Router Web Application
│   ├── src/
│   │   ├── app/           # App routes (Dashboard, Disease Scanner, Soil, Weather, Crops, etc.)
│   │   ├── components/    # Reusable UI components & Live Farm Background
│   │   ├── context/       # Auth context & global state
│   │   ├── lib/           # API helper functions
│   │   └── types/         # TypeScript definitions
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express + TypeScript REST API Backend
│   ├── prisma/            # Database schema & seed scripts (`schema.prisma`, `dev.db`, `seed.ts`)
│   ├── src/               # Controllers, services, routes, middleware
│   ├── uploads/           # Disease scanner uploaded leaf images
│   └── package.json
├── package.json            # Root monorepo workspace scripts
├── README.md               # Project documentation
└── walkthrough.md          # Technical feature walkthrough
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install Dependencies
Run the following inside the root directory:
```bash
cd server && npm install
cd ../frontend && npm install
```

### 2. Run Database Migrations & Seed
```bash
cd server
npx prisma db push
npx prisma db seed
```

### 3. Start Development Servers

**Option A — Running from Root:**
```bash
# Start Backend API (Port 5000)
npm run dev:server

# Start Frontend Web App (Port 3000)
npm run dev:frontend
```

**Option B — Running from Subdirectories:**
- **Backend API**: `cd server && npm run dev` (Runs at `http://localhost:5000/api`)
- **Frontend App**: `cd frontend && npm run dev` (Runs at `http://localhost:3000`)

---

## 🔑 Pre-Seeded Demo User
- **Email**: `farmer@farmpilot.ai`
- **Password**: `password123`

---

## ✨ Features & Modules

1. **🌾 Live Animated Farm Visuals (`LiveFarmBackground.tsx`)**: Real-time canvas breeze animation, sunlight beams, floating pollen, and responsive visual layout.
2. **🔬 AI Crop Disease Scanner**: Upload crop leaf images for instant diagnostic scan, symptoms analysis, cause identification, and Integrated Pest Management (IPM) guidelines.
3. **🌱 Smart Crop Calendar**: Dynamic planting date scheduler, lifecycle phase tracking (Germination, Vegetation, Flowering, Harvest), and weather overlay integration.
4. **🧪 Soil Health & Nutrient Insights**: N-P-K nutrient tracking, pH balance monitoring, and automated soil treatment recommendations.
5. **📈 Market Price & Trend Intelligence**: Live crop commodity prices, 7-day and 30-day price trend analysis, and buy/sell advisory.
6. **🌤️ Weather & Agricultural Advisory**: Real-time forecast, precipitation probability, humidity levels, and crop alert advisories.
7. **💰 Financial Management**: Expense & revenue tracking, yield ROI calculator, and category breakdown charts.
