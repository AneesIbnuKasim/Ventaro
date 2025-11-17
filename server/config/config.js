module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Ventaro',
    NODE_ENV: process.env.NODE_ENV || 'production',

    BCRYPT_ROUND: 12,
    
    EMAIL: process.env.EMAIL,
    APP_PASSWORD: process.env.APP_PASSWORD
}