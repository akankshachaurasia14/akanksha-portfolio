require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const profileRoutes = require('./routes/profile')
const contactRoutes = require('./routes/contact')

const app = express()

// --- CORS ---
// Allow your deployed frontend (Vercel) plus localhost for development.
// Set ALLOWED_ORIGINS as a comma-separated list in your environment,
// e.g. "https://your-portfolio.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, server-to-server) and
      // any origin explicitly listed in ALLOWED_ORIGINS.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true
  })
)

app.use(express.json({ limit: '2mb' }))

// --- Routes ---
app.use('/api/profile', profileRoutes)
app.use('/api/contact', contactRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    dbConnected: mongoose.connection.readyState === 1
  })
})

app.get('/', (req, res) => {
  res.send('Portfolio API is running. Try /api/health, /api/profile, or /api/contact.')
})

// --- Database connection ---
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

async function start() {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI)
      console.log('Connected to MongoDB.')
    } catch (error) {
      console.error('Could not connect to MongoDB. Falling back to static profile data.', error.message)
    }
  } else {
    console.warn('MONGODB_URI not set — running with static fallback profile data only. Saving edits will be disabled until you add a database.')
  }

  app.listen(PORT, () => {
    console.log(`Portfolio API listening on port ${PORT}`)
  })
}

start()
