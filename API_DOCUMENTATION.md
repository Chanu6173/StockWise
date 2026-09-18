# StockWise REST API Documentation

This document provides detailed specifications for all REST API endpoints, database schemas, payloads, and response JSON formats for the StockWise backend.

---

## 💾 Database Schemas (Mongoose Models)

### 1. User Schema (`server/models/User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```
*Note: The password field is hashed using bcryptjs with salt factor 10, and is omitted from standard query projections.*

### 2. Portfolio Schema (`server/models/Portfolio.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true, uppercase: true },
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  buyPrice: { type: Number, required: true, min: 0 },
  purchaseDate: { type: Date, required: true, default: Date.now }
}
```
*Indexing: Compound index `{ userId: 1, symbol: 1 }` prevents users from having duplicate entries for the same ticker.*

### 3. Watchlist Schema (`server/models/Watchlist.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true, uppercase: true },
  companyName: { type: String, required: true }
}
```
*Indexing: Compound index `{ userId: 1, symbol: 1 }` prevents users from watching a stock twice.*

### 4. Transaction Schema (`server/models/Transaction.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true, uppercase: true },
  companyName: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now }
}
```
*Indexing: Index `{ userId: 1, date: -1 }` optimizes historical logs queries.*

---

## 📡 REST API Endpoint Specifications

All endpoints use JSON payloads and require the `Content-Type: application/json` header. Protected routes require `Authorization: Bearer <JWT_TOKEN>`.

---

### 🔑 Authentication Module

#### 1. Register User
- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Authenticate User (Login)
- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. View User Profile
- **Route**: `GET /api/auth/profile`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2026-07-18T00:00:00.000Z"
}
```

#### 4. Update Profile Configurations
- **Route**: `PUT /api/auth/profile`
- **Access**: Protected
- **Request Body** (All fields optional):
```json
{
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "password": "newsecurepassword456"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 💼 Portfolio Positions Module

#### 1. Fetch Portfolio positions
- **Route**: `GET /api/portfolio`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "symbol": "AAPL",
      "companyName": "Apple Inc.",
      "quantity": 10,
      "buyPrice": 150.50,
      "purchaseDate": "2026-07-15T00:00:00.000Z",
      "currentPrice": 178.20,
      "totalInvestment": 1505.00,
      "currentValue": 1782.00,
      "profit": 277.00,
      "profitPercent": 18.41,
      "dailyChangePercent": 1.25
    }
  ]
}
```

#### 2. Add Stock Position
- **Route**: `POST /api/portfolio`
- **Access**: Protected
- **Request Body**:
```json
{
  "symbol": "AAPL",
  "companyName": "Apple Inc.",
  "quantity": 10,
  "buyPrice": 150.50,
  "purchaseDate": "2026-07-15"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cb",
    "userId": "60d0fe4f5311236168a109ca",
    "symbol": "AAPL",
    "companyName": "Apple Inc.",
    "quantity": 10,
    "buyPrice": 150.50,
    "purchaseDate": "2026-07-15T00:00:00.000Z"
  }
}
```
*Note: If the stock is already held, the quantity will be added and the `buyPrice` will be updated to a weighted average.*

#### 3. Edit Stock position
- **Route**: `PUT /api/portfolio/:id`
- **Access**: Protected
- **Request Body**:
```json
{
  "quantity": 15,
  "buyPrice": 155.00,
  "purchaseDate": "2026-07-16"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cb",
    "userId": "60d0fe4f5311236168a109ca",
    "symbol": "AAPL",
    "companyName": "Apple Inc.",
    "quantity": 15,
    "buyPrice": 155.00,
    "purchaseDate": "2026-07-16T00:00:00.000Z"
  }
}
```

#### 4. Delete / Liquidate Position
- **Route**: `DELETE /api/portfolio/:id`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Stock removed from portfolio"
}
```

---

### 👁️ Watchlist Module

#### 1. Retrieve Watchlist
- **Route**: `GET /api/watchlist`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "symbol": "MSFT",
      "companyName": "Microsoft Corporation",
      "currentPrice": 420.15,
      "change": 4.50,
      "changePercent": 1.08
    }
  ]
}
```

#### 2. Add to Watchlist
- **Route**: `POST /api/watchlist`
- **Access**: Protected
- **Request Body**:
```json
{
  "symbol": "MSFT",
  "companyName": "Microsoft Corporation"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cc",
    "userId": "60d0fe4f5311236168a109ca",
    "symbol": "MSFT",
    "companyName": "Microsoft Corporation"
  }
}
```

#### 3. Remove from Watchlist
- **Route**: `DELETE /api/watchlist/:id`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Stock removed from watchlist"
}
```

---

### 📊 Transactions History Module

#### 1. Fetch Paginated Order Logs
- **Route**: `GET /api/transactions`
- **Access**: Protected
- **Query Params**:
  - `page`: default `1`
  - `limit`: default `10`
  - `search`: search query by symbol or company
  - `type`: filter by `BUY` or `SELL`
  - `sortBy`: default `date`
  - `sortOrder`: `asc` or `desc` (default `desc`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  },
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cd",
      "userId": "60d0fe4f5311236168a109ca",
      "symbol": "AAPL",
      "companyName": "Apple Inc.",
      "type": "BUY",
      "quantity": 10,
      "price": 150.50,
      "totalAmount": 1505.00,
      "date": "2026-07-15T00:00:00.000Z"
    }
  ]
}
```

---

### 📈 Stocks Reference & Autocomplete

#### 1. Ticker Autocomplete Search
- **Route**: `GET /api/stocks/search`
- **Access**: Protected
- **Query Params**: `q` (e.g. `AAPL`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "symbol": "AAPL",
      "description": "APPLE INC",
      "type": "Common Stock"
    }
  ]
}
```

#### 2. Stock Profile, Quote & Timeline details
- **Route**: `GET /api/stocks/:symbol`
- **Access**: Protected
- **Query Params**: `range` (choices: `1W`, `1M`, `3M`, `1Y` — default `1M`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "quote": {
      "symbol": "AAPL",
      "price": 178.20,
      "change": 2.20,
      "changePercent": 1.25,
      "high": 179.50,
      "low": 177.10,
      "open": 177.50,
      "previousClose": 176.00
    },
    "profile": {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "marketCap": 3000000000000,
      "logo": "https://logo.clearbit.com/apple.com"
    },
    "history": [
      {
        "date": "2026-06-18",
        "price": 176.00
      },
      {
        "date": "2026-06-19",
        "price": 177.50
      }
    ]
  }
}
```

---

### 📊 Dashboard & Analytics Aggregators

#### 1. Dashboard Metrics Summary
- **Route**: `GET /api/dashboard`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "portfolioValue": 1782.00,
      "totalInvestment": 1505.00,
      "overallProfit": 277.00,
      "overallProfitPercent": 18.41,
      "todayGain": 12.50,
      "todayGainPercent": 0.70,
      "totalHoldings": 1
    },
    "charts": {
      "allocation": [
        { "name": "AAPL", "value": 1782.00, "percentage": 100 }
      ],
      "profitDistribution": [
        { "name": "AAPL", "profit": 277.00 }
      ],
      "growthTrend": [
        { "date": "Jul 11", "value": 1505.00 },
        { "date": "Jul 18", "value": 1782.00 }
      ]
    },
    "recentTransactions": []
  }
}
```

#### 2. Performance Analytics Report
- **Route**: `GET /api/analytics`
- **Access**: Protected
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalInvestment": 1505.00,
      "currentValue": 1782.00,
      "overallReturn": 277.00,
      "overallReturnPercent": 18.41,
      "averageReturnPercent": 18.41
    },
    "bestPerformer": {
      "symbol": "AAPL",
      "companyName": "Apple Inc.",
      "profit": 277.00,
      "profitPercent": 18.41,
      "currentValue": 1782.00
    },
    "worstPerformer": {
      "symbol": "AAPL",
      "companyName": "Apple Inc.",
      "profit": 277.00,
      "profitPercent": 18.41,
      "currentValue": 1782.00
    },
    "sectorDistribution": [
      { "name": "Technology", "value": 1782.00, "percentage": 100 }
    ]
  }
}
```
