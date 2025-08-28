require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./mongo')

const authRoutes = require('./routes/auth')
const medicineRoutes = require('./routes/medicines')
const vitalsRoutes = require('./routes/vitals')
const toggleRoutes = require('./routes/toggles')        // 👈 add this

const app = express()
app.use(cors({ origin: "http://localhost:3000", credentials: true })) // explicit is safer
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true, at: new Date().toISOString() }))
app.use('/api/auth', authRoutes)
app.use('/api/medicines', medicineRoutes)
app.use('/api/vitals', vitalsRoutes)
app.use('/api/toggles', toggleRoutes)                  // 👈 add this

const PORT = process.env.PORT || 4000
connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`API → http://localhost:${PORT}`)))
  .catch((e) => {
    console.error('Mongo connect error:', e)
    process.exit(1)
  })
