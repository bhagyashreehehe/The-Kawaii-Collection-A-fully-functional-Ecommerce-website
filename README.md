# TheKawaiiCollection — React Frontend

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file in project root
cp .env.example .env

# 3. Run dev server
npm run dev
# → Opens at http://localhost:3000

# 4. Build for production
npm run build
```

---

## 📁 Project Structure

```
kawaii-react/
├── index.html
├── vite.config.js
├── package.json
├── .env                          ← your secrets go here
└── src/
    ├── main.jsx                  ← entry point
    ├── App.jsx                   ← root component
    ├── index.css                 ← global design system
    ├── data/
    │   └── products.js           ← product data (swap with API later)
    ├── context/
    │   ├── CartContext.jsx       ← global cart state
    │   └── ToastContext.jsx      ← notification system
    └── components/
        ├── Navbar.jsx / .module.css
        ├── Hero.jsx / .module.css
        ├── ProductCard.jsx / .module.css
        ├── ProductsSection.jsx / .module.css
        ├── CartSidebar.jsx / .module.css
        ├── AuthModal.jsx / .module.css
        ├── BrandsSection.jsx / .module.css
        ├── Newsletter.jsx / .module.css
        ├── Footer.jsx / .module.css
        └── Cursor.jsx
```

---

## 🔌 Connecting PostgreSQL + Backend

### Step 1 — Environment variables

Create `.env` in your **backend** folder:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/kawaii_db
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
JWT_SECRET=any_long_random_string_here
PORT=5000
```

Create `.env` in your **React** (frontend) folder:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### Step 2 — Backend folder structure

```
backend/
├── server.js
├── .env
├── config/
│   └── db.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── checkout.js
│   └── newsletter.js
├── controllers/
│   ├── authController.js
│   └── checkoutController.js
└── middleware/
    └── auth.js
```

### Step 3 — `backend/config/db.js`
```js
const { Pool } = require('pg')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
module.exports = pool
```

### Step 4 — `backend/server.js`
```js
require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const app     = express()

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.use('/api/auth',       require('./routes/auth'))
app.use('/api/products',   require('./routes/products'))
app.use('/api/checkout',   require('./routes/checkout'))
app.use('/api/newsletter', require('./routes/newsletter'))

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
)
```

### Step 5 — PostgreSQL Schema
```sql
-- Run this in psql or pgAdmin
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  price      INTEGER NOT NULL,
  image_url  TEXT,
  category   TEXT,
  badge      TEXT,
  section    TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id),
  razorpay_order  TEXT,
  amount          INTEGER,
  status          TEXT DEFAULT 'pending',
  items           JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE newsletter (
  id    SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 6 — Install backend dependencies
```bash
cd backend
npm init -y
npm install express pg bcrypt jsonwebtoken razorpay cors dotenv
```

### Step 7 — Uncomment the API hooks

In the React components, every API call is already written but commented out.
Search for `── Backend` comments in:
- `src/components/AuthModal.jsx`    → login & register
- `src/components/CartSidebar.jsx`  → Razorpay checkout
- `src/components/Newsletter.jsx`   → email subscribe

Uncomment the block and replace the fake `await new Promise(...)` delay.

### Step 8 — Load products from DB (optional)

In `src/data/products.js`, products are currently hardcoded.
Once your backend `/api/products` route is ready, replace the hardcoded
array in `ProductsSection.jsx` with:

```js
const [products, setProducts] = useState([])
useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/api/products`)
    .then(r => r.json())
    .then(data => setProducts(data.products))
}, [])
```

---

## 💳 Razorpay Checkout Flow

1. User clicks Checkout in cart sidebar
2. Frontend calls `POST /api/checkout/create-order` with cart items
3. Backend creates Razorpay order via SDK, returns `{ orderId, amount, currency }`
4. Frontend opens Razorpay modal
5. On payment success, frontend calls `POST /api/checkout/verify`
6. Backend verifies signature, saves order to PostgreSQL, returns success
7. Cart is cleared, user sees success toast

The entire flow is already stubbed in `CartSidebar.jsx` — just uncomment it.

---

## 🚀 Deployment

- **Frontend**: Deploy to Vercel (`vercel deploy`) or Netlify
- **Backend**: Deploy to Railway, Render, or a DigitalOcean droplet
- **Database**: Use Railway Postgres, Supabase, or Neon (all free tiers available)
- Update `VITE_API_URL` in your frontend env to point to the deployed backend URL
