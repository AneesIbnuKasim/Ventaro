const express = require('express')
const ProductController = require('../controllers/ProductController')
const { default:upload } = require('../config/multer')
const { authenticateAdmin, authenticateUser } = require('../middlewares/auth')

const router = express.Router()

//admin product routes
router.get('/', ProductController.getProducts)
// router.get('/',()=> console.log('get products'))

//admin product routes
router.post('/', upload.array('images',6), authenticateAdmin, ProductController.addProduct)
router.put('/:id', upload.array('images',6), authenticateAdmin , ProductController.editProduct)
router.delete('/:id', authenticateAdmin, ProductController.deleteProduct)

//USER PRODUCT ROUTES

router.get('/details/:id',ProductController.getProduct)
router.post('/details/:id', authenticateUser,ProductController.submitReview) //submit product reviews
router.get('/suggestions',ProductController.searchSuggestions)
router.get('/:category',ProductController.getProductsByCategory)

module.exports = router