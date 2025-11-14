module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/Ventaro',
    NODE_ENV: process.env.NODE_ENV || 'production',
    
}