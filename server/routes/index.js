
const authRoutes = require('./auth')
const adminRoutes = require('./admin')

const setupRoutes = (app)=>{
    app.use('/api/auth', authRoutes)
    app.use('/api/admin', adminRoutes)
}

module.exports = {
    setupRoutes
}