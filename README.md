# 🌱 EcoLoop — Turning Leftovers into Leverages
### B2B Circular Economy Marketplace & Industrial Synergy Platform

EcoLoop is a full-stack, responsive B2B circular-economy web platform connecting manufacturing, industrial, and commercial enterprises having excess materials, scraps, and reusable assets with certified recyclers and secondary manufacturers.

---

## 🚀 Live Localhost URLs

- **Frontend Client Application:** [http://localhost:5173](http://localhost:5173)
- **Backend REST API:** [http://localhost:5000](http://localhost:5000)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Pre-Seeded Demo Account Credentials

Use the **Instant Demo Logins** on the login page or manually sign in:

| Role | Business Name | Email | Password | Location & Category |
| :--- | :--- | :--- | :--- | :--- |
| **Seller** | GreenPack Innovations Pvt Ltd | `seller@ecoloop.com` | `ecoloop123` | Kolkata (Packaging & Cartons) |
| **Buyer** | Bengal EcoRecycle Solutions | `buyer@ecoloop.com` | `ecoloop123` | Howrah (Recycling Facility) |
| **Buyer/Supplier** | Brahmaputra Organics | `assam.organics@ecoloop.com` | `ecoloop123` | Guwahati (Food & Agri Waste) |
| **Supplier** | Siliguri Reclaimed Timber | `timber@ecoloop.com` | `ecoloop123` | Siliguri (Wood & Pallets) |
| **Supplier** | Eastern Textile Mills Ltd | `textiles@ecoloop.com` | `ecoloop123` | Kolkata (Combed Cotton Scraps) |
| **Supplier** | Howrah Alloy & Scrap Recyclers | `metals@ecoloop.com` | `ecoloop123` | Howrah (Ferrous & Non-Ferrous Scrap) |

---

## ⚙️ Tech Stack

- **Frontend:**
  - React 18 with Vite 6 & TypeScript
  - Tailwind CSS with EcoLoop custom color theme (Dark Forest Green `#062d1c`, Leaf Green `#10b981`, Pale Green `#ecfdf5`)
  - React Router DOM v7
  - Lucide React Icons
  - Framer Motion
  - Recharts (Interactive Area, Bar, and Pie Charts)
  - Canvas Confetti
- **Backend:**
  - Node.js & Express.js with TypeScript
  - Prisma ORM 5
  - SQLite (`backend/prisma/dev.db`) — zero-config local relational database with ready PostgreSQL migration schema
  - JWT & HTTP-only Cookie Authentication with `bcryptjs` password hashing

---

## 🔄 Complete Working User Flows

### 1. Seller Flow
1. **Login:** Log in with `seller@ecoloop.com`.
2. **Dashboard:** Visit `/seller/dashboard` to review real-time KPI metrics (Active Listings, Pending Requests, Revenue, Monthly sales charts).
3. **List Waste:** Click "+ List Your Waste" (`/list-waste`), pick from 12 categories, input weight, rate, condition, and submit. Listing goes live immediately in the marketplace.
4. **Respond to Bids:** Navigate to `/seller/requests` to Accept, Decline, or Negotiate counter-offers.
5. **Manage Orders:** Advance shipment milestones (Processing ➔ Dispatched ➔ In Transit ➔ Delivered).

### 2. Buyer Flow
1. **Explore:** Browse `/marketplace` with multi-category filters, Indian city clusters (Kolkata, Howrah, Siliguri, Guwahati), price range sliders, and condition sorting.
2. **AI Synergy:** View deterministic AI Compatibility Match scores (e.g. 94% match) with 6-factor algorithm breakdowns.
3. **Procurement Request:** Click "Request Material" (`/request/:id`) to specify required volume, propose pricing, and choose fulfillment method (EcoLoop Fleet, Self Pickup, Seller Delivery).
4. **Negotiation:** Use `/messages` to negotiate terms in real-time.
5. **Simulated Escrow Payment:** Once accepted, proceed to checkout (`/checkout/:id`) with simulated UPI QR, Card, or NetBanking. Instant receipt with celebratory confetti!

### 3. Circular Impact Flow
1. Every completed transaction automatically updates the database with peer-reviewed lifecycle offset coefficients.
2. Visit `/impact` to inspect total kg/tons diverted, CO₂ emissions prevented, process water conserved, and trees preserved.
3. Test prospective ESG savings with the **Interactive Waste-to-Carbon Calculator**.

---

## 🛠️ How to Run Again

If both servers are stopped, restart them via:

### Option A: Double-Click Batch File
Run `run.bat` located in the root `ecoloop` folder.

### Option B: Terminal Commands
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
