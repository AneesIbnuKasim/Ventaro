
const authRoutes = require('./auth')
const adminRoutes = require('./admin')
const productRoutes = require('./product')
const userRoutes = require('./user')

const setupRoutes = (app)=>{
    app.use('/api/auth', authRoutes)
    app.use('/api/admin', adminRoutes)
    app.use('/api/user', userRoutes)
    app.use('/api/product',productRoutes)

}

module.exports = {
    setupRoutes
}