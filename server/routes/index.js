
const authRoutes = require('./auth')
const adminRoutes = require('./admin')
const categoryRoutes = require('./category')
const productRoutes = require('./product')
const userRoutes = require('./user')

const setupRoutes = (app)=>{
    app.use('/api/auth', authRoutes)
    app.use('/api/admin', adminRoutes)
    app.use('/api/user', userRoutes)
    app.use('/api/categories',categoryRoutes)
    app.use('/api/products',productRoutes)

}

module.exports = {
    setupRoutes
}