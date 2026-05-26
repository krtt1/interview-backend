const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');

const employeeRoutes = require('./routes/employeeRoutes');
const jobTitleRoutes = require('./routes/jobTitleRoutes');
const positionLevelRoutes = require('./routes/positionLevelRoutes');
const positionTypeRoutes = require('./routes/positionTypeRoutes');
const jobGroupRoutes = require('./routes/jobGroupRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const commandRoutes = require('./routes/commandRoutes');
const employeeJobHistoryRoutes = require('./routes/employeeJobHistoryRoutes');
const capacityRoutes = require('./routes/capacityRoutes');

// ================= DB CONNECTION TEST =================
async function initializeDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    await sequelize.sync({ alter: false, force: false });
    console.log('✅ Tables synced successfully');
  } catch (error) {
    console.error('⚠️ DB Connect Error:', error.message);
    console.warn('⚠️ Server running in offline mode - database operations will fail');
  }
}

// ไม่ต้อง await ให้ server start ได้เลย
initializeDB();

// ================= APP INIT =================
const app = express();

// ================= CORS CONFIG =================
// Parse ALLOWED_ORIGINS from environment variable (comma-separated)
const envOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://hrodpc1.ddc.moph.go.th',
  ...envOrigins
].filter(Boolean);

console.log('🌍 Allowed CORS Origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      console.log('✅ CORS: No origin (allowed)');
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowed origin: ${origin}`);
      return callback(null, true);
    }

    // Check if origin matches wildcard patterns (for Vercel preview deployments)
    const isVercelPreview = origin.match(/^https:\/\/.*\.vercel\.app$/);
    if (isVercelPreview) {
      console.log(`✅ CORS: Allowed Vercel preview: ${origin}`);
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked: ${origin}`);
    console.warn(`   Allowed origins:`, allowedOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browsers
};

// ================= MIDDLEWARE =================
app.use(cors(corsOptions));
app.use(express.json());

// ================= STATIC FILES =================
app.use('/uploads', express.static('uploads'));
app.use('/api/uploads', express.static('uploads'));

// ================= API ROUTES =================
const apiRouter = express.Router();

apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/job-title', jobTitleRoutes);
apiRouter.use('/position-level', positionLevelRoutes);
apiRouter.use('/position-type', positionTypeRoutes);
apiRouter.use('/jobgroup', jobGroupRoutes);
apiRouter.use('/meeting', meetingRoutes);
apiRouter.use('/command', commandRoutes);
apiRouter.use('/capacity', capacityRoutes);

app.use('/api', apiRouter);

// job history
app.use('/api', employeeJobHistoryRoutes);

// ================= PUBLIC ROUTES =================
app.use('/employees', employeeRoutes);
app.use('/job-title', jobTitleRoutes);
app.use('/position-level', positionLevelRoutes);
app.use('/position-type', positionTypeRoutes);
app.use('/jobgroup', jobGroupRoutes);
app.use('/meeting', meetingRoutes);
app.use('/command', commandRoutes);
app.use('/capacity', capacityRoutes);

app.use('/', employeeJobHistoryRoutes);

// ================= HEALTHCHECK (Railway ใช้ตรงนี้) =================
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ODPC1 Backend Running',
    timestamp: new Date().toISOString()
  });
});

// ================= API ROOT =================
app.get('/api', (req, res) => {
  res.json({
    message: 'API running',
    version: '1.0.0'
  });
});

// ================= HEALTH CHECK DB =================
app.get('/api/health', async (req, res) => {

  const health = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: 'unknown'
    }
  };

  try {

    await sequelize.authenticate();
    health.database.status = 'connected';

    res.json(health);

  } catch (error) {

    health.status = 'error';
    health.database.status = 'disconnected';
    health.database.error = error.message;

    res.status(503).json(health);

  }

});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {

  console.error('❌ Error:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });

});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {

  console.log(`🚀 Server running on port ${PORT}`);

  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  console.log(`📡 Health Check: /`);

  console.log(`📡 API Base: /api`);

});

// ================= EXPORT =================
module.exports = {
  sequelize,
  app
};