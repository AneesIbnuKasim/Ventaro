const express = require('express')
const AdminController = require('../controllers/adminController')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')

const router = express.Router()

router.post('/login', AdminController.login)

//category api handlers
router.post('/category', CategoryController.addCategory)
router.put('/category/:id',authenticateAdmin ,CategoryController.updateCategory)
router.delete('/category/:id', authenticateAdmin, CategoryController.deleteCategory)

module.exports = router