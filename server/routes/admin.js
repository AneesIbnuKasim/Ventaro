const express = require('express')
const AdminController = require('../controllers/adminController')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')
const ProductController = require('../controllers/ProductController')

const router = express.Router()

router.post('/login', AdminController.login)

//category api handlers
router.post('/category', CategoryController.addCategory)
router.put('/category/:id',authenticateAdmin ,CategoryController.updateCategory)
router.delete('/category/:id', authenticateAdmin, CategoryController.deleteCategory)

//products api
router.post('/products', authenticateAdmin, ProductController.addProduct)
router.put('/products/:id',authenticateAdmin , ProductController.editProduct)
router.delete('/category/:id', authenticateAdmin, ProductController.deleteProduct)

module.exports = router