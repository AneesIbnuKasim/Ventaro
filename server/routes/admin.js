const express = require('express')
const AdminController = require('../controllers/adminController')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')
const ProductController = require('../controllers/ProductController')
const { default:upload } = require('../config/multer')

const router = express.Router()

router.post('/login', AdminController.login)

//category api handlers
router.post('/category', CategoryController.addCategory)
router.get('/category', authenticateAdmin, CategoryController.getAllCategories)
router.put('/category/:id',authenticateAdmin ,CategoryController.updateCategory)
router.delete('/category/:id', authenticateAdmin, CategoryController.deleteCategory)

//products api
router.post('/products', upload.array('images',4), authenticateAdmin, ProductController.addProduct)
router.put('/products/:id', upload.array('images',4), authenticateAdmin , ProductController.editProduct)
router.delete('/products/:id', authenticateAdmin, ProductController.deleteProduct)

module.exports = router