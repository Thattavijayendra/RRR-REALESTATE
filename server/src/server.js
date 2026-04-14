import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import propertyRoutes from './routes/propertyRoutes.js'
import dealerRoutes from './routes/dealerRoutes.js'
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

// Load env vars
dotenv.config()

// Connect to database
connectDB()

const app = express()
const PORT = process.env.PORT || 5001

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api', limiter)

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Luxe Estates API is running' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/dealer', dealerRoutes)
app.use('/api/uploads', uploadRoutes)

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
