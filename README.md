# 🛠️ UrbanFix — On-Demand Home Services & Technician Dispatch Platform

> A production-grade React Native mobile application engineered with **TypeScript**, **upfront dynamic service pricing**, **Haversine geospatial technician dispatch**, 18% statutory GST calculation in integer paise, and 30-day post-service warranty tracking.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Geospatial](https://img.shields.io/badge/Geospatial-Haversine_Dispatch-4F46E5?style=for-the-badge&logo=googlemaps&logoColor=white)](https://en.wikipedia.org/wiki/Haversine_formula)
[![Design System](https://img.shields.io/badge/UI-Artisan_Indigo_Tokens-3730A3?style=for-the-badge)](src/theme/index.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📱 App Interface Overview & Mobile Screens

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        URBANFIX SERVICES PLATFORM                      │
├───────────────────┬───────────────────┬────────────────────────────────┤
│  🛠️ Service Hub   │  💰 Pricing Engine│  📍 Live Dispatch Tracker      │
│  - AC Jet Clean   │  - Base Labor ₹599│  - Sanjay Kumar (Master Tech)  │
│  - RO Purifier    │  - Chemicals  ₹150│  - Haversine Distance (3.8 km) │
│  - Fuse Panel Rep │  - Promo Code-₹100│  - Moderate Traffic (1.25x)    │
│  - Leak Detection │  - GST 18%    ₹117│  - ETA: 22 mins away           │
│  - Tap Cartridge  │  - Final ₹766     │  - Status: DISPATCHED          │
│  - 30-Day Warranty│  - Zero Float Math│  - One-Tap Call / Chat Action  │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 🌟 Key Highlights & Engineering Features

### 1. 🧮 Sub-Paise Dynamic Cost & Taxation Engine
- **Zero-Float Accounting:** All monetary values (labor rates, parts costs, discount vouchers, statutory GST) are represented and manipulated exclusively in integer paise to eliminate floating-point arithmetic errors.
- **Dynamic Cost Breakdown:** Computes base inspection fees, material consumables, promotional voucher deductions, and 18% service tax in accordance with Indian statutory tax requirements.
- **Service Guarantee:** Enforces automated 30-day warranty window on all completed repairs, enabling free revisits if faults recur.

### 2. 📍 Haversine Geospatial Dispatch & Real-Time ETA
- **Great-Circle Distance Formulation:** Calculates direct spherical distance between the customer's coordinates and the assigned technician's live GPS coordinates using the Haversine formula:
  $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
  where $R = 6371\text{ km}$.
- **Traffic Multiplier Coefficients:** Evaluates live congestion multipliers (`LIGHT` 1.0x, `MODERATE` 1.25x, `HEAVY` 1.6x) against a 25 km/h urban two-wheeler baseline speed to deliver accurate arrival estimates.

### 3. 🛡️ Verified Artisan Badging & Job Lifecycle State Machine
- Strict state transitions across the service delivery journey:
- Displays aggregate customer star ratings (4.8+ verified rating minimum), completed job counts, and background verification badges.

---

## 📊 Standard Service Catalog & Pricing Matrix

| Category | Service Description | Standard Duration | Estimated Pricing | Warranty |
| :--- | :--- | :---: | :---: | :---: |
| **Appliance Repair** | Inverter AC Foam Jet Cleaning & Gas Check | 45 mins | ₹599 + Consumables | 30 Days |
| **Plumbing** | RO Water Purifier Complete Filter & Membrane Swap | 35 mins | ₹399 + Cartridges | 30 Days |
| **Electrical** | MCB Tripping Diagnostic & Distribution Box Rewire | 60 mins | ₹499 + Parts | 60 Days |
| **Carpentry** | Heavy-Duty Door Lock Fitting & Alignment | 40 mins | ₹349 + Lock | 30 Days |
| **Painting & Waterproof**| Wall Moisture Thermography & Epoxy Injection | 90 mins | ₹899 + Chemical | 90 Days |

---

## 📁 Repository Directory Structure

```text
urbanfix-ondemand-services-mobile-app/
├── src/
│   ├── components/
│   │   ├── ServiceBookingCard.tsx     # Upfront cost breakdown & slot booking
│   │   └── TechnicianDispatchCard.tsx # Live GPS dispatch tracker & ETA card
│   ├── theme/
│   │   └── index.ts                   # Artisan Indigo design tokens & colors
│   └── utils/
│       ├── serviceBookingEngine.ts    # Integer-paise pricing & tax calculations
│       └── technicianDispatchEngine.ts# Haversine distance & traffic ETA engine
├── App.tsx                            # Service marketplace dashboard
├── package.json                       # Dependencies & scripts
├── tsconfig.json                      # Strict TypeScript compiler options
└── README.md                          # Full architectural documentation
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone git@github.com:trydigital2/urbanfix-ondemand-services-mobile-app.git
cd urbanfix-ondemand-services-mobile-app

# Run TypeScript Typecheck
npm run typecheck

# Start Expo Local Development
npx expo start
```

---

<sub>Architected & engineered with precision by **Trydigital** · © 2026 All Rights Reserved</sub>
