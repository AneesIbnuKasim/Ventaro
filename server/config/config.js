module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Ventaro',
    NODE_ENV: process.env.NODE_ENV || 'production',

    BCRYPT_ROUND: 12,
    
    EMAIL: process.env.EMAIL,
    APP_PASSWORD: process.env.APP_PASSWORD,

    JWT: {
        USER_SECRET: process.env.JWT_USER_SECRET || 'your_super_secret_user_jwt_key',
        ADMIN_SECRET: process.env.JWT_ADMIN_SECRET || 'your_super_secret_admin_jwt_key',
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    }
}