const express      = require('express');
const cors         = require('cors');
const authRoutes   = require('./src/routes/authRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

/* ── Global Middleware ── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Health check ── */
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'GaavConnect Auth' }));

/* ── Routes ── */
app.use('/api/auth', authRoutes);

/* ── 404 handler ── */
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

/* ── Global error handler (must be last) ── */
app.use(errorHandler);

module.exports = app;
