const express = require('express')
const AdminController = require('../controllers/adminController')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')

const router = express.Router()

router.post('/login', AdminController.login)

//category api handlers
router.post('/category', CategoryController.addCategory)

module.exports = router