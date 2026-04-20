// server.js — TheKawaiiCollection Backend Entry Point
require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

// ─── Import Routes ────────────────────────────────────────
const authRoutes       = require('./routes/auth');
const productRoutes    = require('./routes/products');
const cartRoutes       = require('./routes/cart');
const orderRoutes      = require('./routes/orders');
const paymentRoutes    = require('./routes/payment');
const adminRoutes      = require('./routes/admin');
const newsletterRoutes = require('./routes/newsletter');

// ─── Initialize DB connection (runs on require) ───────────
require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ──────────────────────────────────
app.use(helmet());

// CORS — allow only your frontend
app.use(cors({
    origin:      process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ────────────────────────────────────────
// Global limiter: 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      200,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: 'Too many requests. Please slow down.' },
});
app.use(globalLimiter);

// Tighter limiter for auth routes (10 per 15 min)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      10,
    message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});

// ─── Health Check ─────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'TheKawaiiCollection API is running 🌸',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// ─── API Routes ───────────────────────────────────────────
app.use('/api/auth',       authLimiter, authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/payment',    paymentRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', require('./routes/contact'))

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message,
    });
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🌸 TheKawaiiCollection API running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📖 Health check: http://localhost:${PORT}/health\n`);
    
});

module.exports = app;
