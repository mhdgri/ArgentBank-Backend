// server/server.js
const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const dbConnection = require('./database/connection');

dotEnv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Connexion DB
dbConnection();

// CORS (autorise ton front en prod via CORS_ORIGIN)
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || CORS_ORIGIN === '*' || origin === CORS_ORIGIN) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/v1/user', require('./routes/userRoutes'));

// Healthcheck (pour Render)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, time: new Date().toISOString() });
});

// Swagger (optionnel, activable avec ENABLE_SWAGGER=true)
if (process.env.ENABLE_SWAGGER === 'true') {
  const swaggerDocs = yaml.load('./server/swagger.yaml'); // ajuste si ton fichier est ailleurs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// Root
app.get('/', (_req, res) => {
  res.send(`API ArgentBank OK (${NODE_ENV})`);
});

// Démarrage
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

module.exports = app;
