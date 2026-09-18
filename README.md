# StockWise — Smart Stock Portfolio Management System

StockWise is a production-grade full-stack MERN (MongoDB, Express.js, React, Node.js) web application that enables users to securely track, analyze, and manage their stock investment portfolios in real-time.

The application serves as a high-fidelity tracking, auditing, and analytics platform. It automatically updates investment values, calculates profits/losses, visualizes portfolio allocations, and keeps logs of all execution transactions.

---

## 🌟 Core Features

- **JWT Session Security**: Complete user registration and login workflows with password encryption via `bcryptjs` and sessions protected by JSON Web Tokens.
- **Dynamic Portfolio Tracker (CRUD)**: Record buy and sell operations. The backend automatically manages position quantities and averages acquisition costs on multiple buys.
- **Self-Cleaning Liquidation**: Removing a stock from holdings automatically logs a offset `SELL` transaction in history.
- **Smart Watchlist**: Maintain a collection of watched tickers. Includes a quick-buy overlay that pulls latest pricing details.
- **Financial Analytics Terminal**: Calculates top winners/losers, average returns across positions, and sector diversification weightings.
- **Data Visualizations**: Responsive charts using Recharts:
  - *Portfolio Allocation* (Pie Chart)
  - *Valuation Growth Trail* (Area Chart)
  - *Margins Gain Distribution* (Bar Chart)
- **Debounced Autocomplete Search**: Global header input that debounces key presses to perform stock searches via API and routes to detailed profiles.
- **Interactive Stock Details**: Inspect key statistics (Open, Prev Close, Day High/Low, Market Cap) and toggle historical price timelines (1W, 1M, 3M, 1Y).
- **Automated DB Fallback**: If MongoDB Atlas cannot connect (e.g. due to DNS failures), the server automatically spins up a local in-memory database server for zero-configuration testing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (v19), React Router v6, Axios, Recharts, Context API, Lucide Icons, React Hot Toast |
| **Styling** | Tailwind CSS v4 (Glassmorphism, custom animations, custom scrollbars) |
| **Backend** | Node.js, Express.js, REST API, Mongoose ODM, JWT Authentication, Express Validator, Helmet, Morgan |
| **Database** | MongoDB Atlas (Cloud) / `mongodb-memory-server` (Local Fallback) |

---

## 📂 Codebase Directory Mappings

```text
MERN/
├── client/                      # React (Vite) Frontend Application
│   ├── src/
│   │   ├── assets/              # Static assets and icons
│   │   ├── components/          # Reusable UI elements
│   │   │   ├── charts/          # AllocationChart, GrowthChart, ProfitChart
│   │   │   ├── Loader.jsx       # Custom branded spinner
│   │   │   ├── Modal.jsx        # Slide-up modal wrapper
│   │   │   ├── Navbar.jsx       # Header containing SearchBox
│   │   │   ├── Sidebar.jsx      # Navigation links
│   │   │   └── SearchBox.jsx    # Debounced autocomplete search input
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global session context provider
│   │   ├── hooks/
│   │   │   └── useDebounce.js   # Autocomplete utility hook
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx   # Private layout wrapper
│   │   │   └── AuthLayout.jsx   # Public centered cards wrapper
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx  # Product landing display
│   │   │   ├── LoginPage.jsx    # Sign in
│   │   │   ├── RegisterPage.jsx # Sign up
│   │   │   ├── DashboardPage.jsx# Metrics and chart panels
│   │   │   ├── PortfolioPage.jsx# Holdings details table
│   │   │   ├── WatchlistPage.jsx# Tracked stocks grid
│   │   │   ├── TransactionsPage.jsx# Paginated order log
│   │   │   ├── AnalyticsPage.jsx# Winners/losers cards
│   │   │   ├── ProfilePage.jsx  # User configurations
│   │   │   └── NotFoundPage.jsx # Custom 404 details
│   │   ├── services/
│   │   │   ├── api.js           # Axios config with Bearer interceptors
│   │   │   └── *Service.js      # Auth, Portfolio, Watchlist, Stocks APIs
│   │   ├── App.jsx              # Routing configurations
│   │   └── main.jsx             # React entry point
│   ├── package.json             # Frontend configs
│   └── vite.config.js           # Vite plugins configuration (React & Tailwind v4)
│
└── server/                      # Express.js Backend Application
    ├── config/
    │   └── db.js                # Mongoose database connector
    ├── controllers/             # Endpoint route controllers
    ├── middlewares/
    │   ├── authMiddleware.js    # JWT authorization validator
    │   └── errorHandler.js      # Global central error parser
    ├── models/                  # Mongoose schemas (User, Portfolio, Watchlist, Transaction)
    ├── routes/                  # API routers mapped by sub-route
    ├── services/
    │   └── stockService.js      # Quote fetching, profiles, and caching
    ├── utils/
    │   └── generateToken.js     # JWT token signing wrapper
    ├── validators/
    │   └── authValidator.js     # Body inputs express-validation schemas
    ├── app.js                   # Express middle-layer declarations
    ├── server.js                # Port listener and entry point
    └── package.json             # Backend configs
```

---

## ⚡ Setup & Run Instructions

Follow these steps to run the application locally on your computer:

### 1. Prerequisites
- **Node.js** installed (v18 or higher recommended)
- **MongoDB** running locally (optional, port `27017`) or a MongoDB Atlas Account.

### 2. Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```bash
# Path: server/.env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/stockwise
JWT_SECRET=supersecretjwttokendesignedforstockwise2026
JWT_EXPIRE=7d
FINNHUB_API_KEY=your_finnhub_api_key_here
NODE_ENV=development
```
*(If the connection string fails or is blank, the backend automatically uses an in-memory database fallback so you can demo it immediately with zero configuration).*

### 3. Install Dependencies
Run install commands inside both subfolders:
```bash
# Install backend packages
cd server
npm install

# Install frontend packages
cd ../client
npm install --legacy-peer-deps
```

### 4. Run Development Servers
Start both servers in separate terminal windows:

**Backend Server (Runs on Port 5000):**
```bash
cd server
npm run dev
```

**Frontend React Server (Runs on Port 5173):**
```bash
cd client
npm run dev
```

Open **[http://localhost:5173/](http://localhost:5173/)** in your browser to view the application.

---

## 📡 REST API Structure

All requests route through the base URI: `http://localhost:5000/api`

### 1. Authentication
- `POST /api/auth/register` — Create user, returns JWT.
- `POST /api/auth/login` — Authenticate credentials, returns JWT.
- `GET /api/auth/profile` — View current profile (Protected).
- `PUT /api/auth/profile` — Update name, email, or reset password (Protected).

### 2. Portfolio Holdings
- `GET /api/portfolio` — Fetch user holdings enriched with current prices (Protected).
- `POST /api/portfolio` — Record buy asset operation (Protected).
- `PUT /api/portfolio/:id` — Update buy cost or quantity (Protected).
- `DELETE /api/portfolio/:id` — Liquidate asset position, logs SELL transaction (Protected).

### 3. Watchlist
- `GET /api/watchlist` — Retrieve tracked stocks with quotes (Protected).
- `POST /api/watchlist` — Add stock symbol to watchlist (Protected).
- `DELETE /api/watchlist/:id` — Remove ticker from watchlist (Protected).

### 4. Transactions
- `GET /api/transactions` — Fetch paginated order journals with filter and sort options (Protected).

### 5. Stocks Reference
- `GET /api/stocks/search?q=` — Query tickers by keyword (Protected).
- `GET /api/stocks/:symbol?range=` — Fetch profile stats and chart timeline datasets (Protected).

### 6. Dashboard & Analytics
- `GET /api/dashboard` — Aggregates valuation summaries and charts series (Protected).
- `GET /api/analytics` — Audits holdings to identify top performers and sector allocations (Protected).
