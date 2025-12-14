
const authRoutes = require('./auth')
const adminRoutes = require('./admin')
const productRoutes = require('./product')
const categoryRoutes = require('./category')
const userRoutes = require('./user')
const searchRoutes = require('./search')

const setupRoutes = (app)=>{
    app.use('/api/auth', authRoutes)
    app.use('/api/admin', adminRoutes)
    app.use('/api/user', userRoutes)
    app.use('/api/products',productRoutes)
    app.use('/api/category',categoryRoutes)
    app.use('/api/search',searchRoutes)

}

module.exports = {
    setupRoutes
}