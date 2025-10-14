const express = require('express')
const dotEnv = require('dotenv')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const path = require('path')
const dbConnection = require('./database/connection')

dotEnv.config()

const app = express()
const PORT = process.env.PORT || 3001

dbConnection()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
]

app.use(cors({
  origin: function (origin, callback) {

    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

// Request payload middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Handle custom routes
app.use('/api/v1/user', require('./routes/userRoutes'))

// Swagger avec chemin absolu
const swaggerPath = path.join(__dirname, '../swagger.yaml')
try {
  const swaggerDocs = yaml.load(swaggerPath)
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  }
} catch (error) {
  console.warn('Swagger file not found, skipping API docs')
}

app.get('/', (req, res) => {
  res.json({ 
    message: 'Argent Bank API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'connected' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})