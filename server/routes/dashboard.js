const express = require('express')
const { authenticateAdmin } = require('../middlewares/auth')
const DashboardController = require('../controllers/dashboardController')
const router = express.Router()

router.get('/', authenticateAdmin, DashboardController.fetchSalesReport)


module.exports = router