module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Ventaro',
    NODE_ENV: process.env.NODE_ENV || 'development',

    BCRYPT_ROUND: 12,

    JWT: {
        USER_SECRET: process.env.JWT_USER_SECRET || 'your_super_secret_user_jwt_key',
        ADMIN_SECRET: process.env.JWT_ADMIN_SECRET || 'your_super_secret_admin_jwt_key',
        RESET_SECRET: process.env.JWT_RESET_SECRET || 'your_super_secret_reset_jwt_key',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
        RESET_EXPIRES_IN: process.env.JWT_RESET_EXPIRES_IN || '10m'
    },
    
    CORS: {
        ORIGIN: process.env.FRONTEND_URL || 'http://localhost:3000',
        CREDENTIALS: true,
        METHODS: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With']
    },

    EMAIL: process.env.EMAIL,
    APP_PASSWORD: process.env.APP_PASSWORD,

    DEFAULT_ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL || 'admin@admin.com',
    PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    NAME: 'Administrator'
    },

    LOGGING: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    MAX_FILES: 5,
    MAX_SIZE: '20m'
  }
}