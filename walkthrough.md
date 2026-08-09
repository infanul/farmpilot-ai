# 🌾 FarmPilot AI — Premium Farmer-First UI/UX + Functionality Upgrade Walkthrough

> **Tagline**: *"Smarter Decisions. Healthier Crops. Better Harvests."*

FarmPilot AI has been upgraded into a premium, farmer-first digital agriculture platform built with **Next.js 14+**, **TypeScript**, **Tailwind CSS**, **Express.js**, **Prisma ORM**, and **SQLite**.

---

## ☀️ 1. Light & Dark Theme System (`ThemeContext.tsx`)
- **Light Mode**: High-contrast, bright outdoor-readable glassmorphic design system (`html.light .glass-panel`) with crisp dark text (`#0f172a`), soft borders (`rgba(203, 213, 225, 0.8)`), and slate backgrounds.
- **Dark Mode**: Deep atmospheric glassmorphism (`rgba(15, 23, 42, 0.85)`).
- **Navbar Switcher**: Instant theme toggle button (☀️ / 🌙) syncing with `localStorage`.

---

## 🌐 2. Multi-Language Support — English & Malayalam (`LanguageContext.tsx`)
- Full translation dictionary supporting **English (`en`)** and **Malayalam (`ml`)** (*"മലയാളം"*).
- Translates navigation items, farmer greetings (*"സുപ്രഭാതം, രമേഷ് 👨‍🌾 — നിങ്ങളുടെ കൃഷിയിടത്തിന് ഇന്ന് ആവശ്യമായ കാര്യങ്ങൾ."*), disease scanner prompts, crop health statuses, and growth stages.
- Language selector dropdown (🌐 English / മലയാളം) in top Navbar.

---

## 🌦️ 3. Weather-Responsive Living Farm Background (`LiveFarmBackground.tsx`)
- Visual background automatically adjusts based on weather data and ambient time:
  - **SUNNY**: Bright warm amber sunlight beam sweep + floating golden pollen particles.
  - **RAIN**: Falling rain lines canvas layer + dark cloud backdrop.
  - **CLOUDY**: Soft floating cloud drift + ambient daylight.
  - **NIGHT**: Starlit canopy backdrop with ambient moon glow gradient.

---

## 🌱 4. Visual Crop Health Cards & Growth Progress Visualization
- **Crop Health Cards (`CropHealthCard.tsx`)**: Visual progress bars (`████████████░░ 72%`) for Rice, Tomato, and Chilli showing water level, disease risk, and next task.
- **Interactive 6-Stage Timeline (`CropGrowthTimeline.tsx`)**:
  - **Planting ➔ Germination ➔ Vegetative ➔ Flowering ➔ Maturity ➔ Harvest**
  - Clickable stage modal showing expected duration, water requirement, fertilizer task, pest/disease risks, weather notes, and farmer action checklists.

---

## 🗺️ 5. Visual Farm Field Map & Actionable Smart Alerts
- **Farm Field Map (`FarmFieldMap.tsx`)**: Visual plot status cards (Sector A - Paddy, Sector B - Raised Bed, Sector C - South Plot) with live soil moisture bars and irrigation status.
- **Smart Alert Center (`SmartAlertCenter.tsx`)**: Categorized alerts (**Critical 🔴**, **Important 🟠**, **Attention 🟡**, **Information 🟢**) with 1-click action buttons (`[Scan Leaf Image]`, `[Check Weather]`, `[View Task]`).

---

## 🚀 How to Run FarmPilot AI

### 1. Start Express Backend API
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000/api`.

### 2. Start Next.js Frontend Web App
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:3000`.

#### 🔑 Pre-Seeded Demo Farmer Credentials
- **Email**: `farmer@farmpilot.ai`
- **Password**: `password123`
