require('dotenv').config();
const { Sequelize } = require('sequelize');

// ตรวจสอบว่ามี MYSQL_PUBLIC_URL หรือไม่
if (!process.env.MYSQL_PUBLIC_URL) {
  console.error('❌ MYSQL_PUBLIC_URL is not defined in environment variables');
  console.error('⚠️ Server will start but database operations will fail');
  // ไม่ exit ให้ server ยังทำงานได้
}

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL || 'mysql://root:@localhost:3306/odpc1', {
  dialect: "mysql",
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
  
  dialectOptions: {
    connectTimeout: 60000,
    // เพิ่ม SSL ถ้า Railway ต้องการ
    ssl: process.env.DB_SSL === 'true' ? {
      require: true,
      rejectUnauthorized: false
    } : undefined
  },

  pool: {
    max: 10,      // ลดจำนวน connection
    min: 2,
    acquire: 30000,
    idle: 10000,
    evict: 10000
  },

  retry: {
    max: 3,
    timeout: 3000
  },

  // Transaction timeout
  transactionType: 'IMMEDIATE',
  isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  
  // Query timeout
  query: {
    timeout: 30000
  }
});

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    console.log('📊 Database:', sequelize.config.database);
    console.log('🔗 Host:', sequelize.config.host);
  })
  .catch(err => {
    console.error('❌ DB Connect Error:', err.message);
    if (err.parent) {
      console.error('Parent Error Code:', err.parent.code);
      console.error('Parent Error:', err.parent.message);
    }
    // ไม่ exit ทันที ให้ retry
  });

module.exports = sequelize;
