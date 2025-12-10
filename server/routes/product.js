const express = require('express')
const ProductController = require('../controllers/ProductController')
const { default:upload } = require('../config/multer')
const { authenticateAdmin } = require('../middlewares/auth')

const router = express.Router()

//admin product routes
router.get('/',ProductController.getProducts)
router.get('/:id',ProductController.getProduct)

//admin product routes
router.post('/', upload.array('images',4), authenticateAdmin, ProductController.addProduct)
router.put('/:id', upload.array('images',4), authenticateAdmin , ProductController.editProduct)
router.delete('/:id', authenticateAdmin, ProductController.deleteProduct)


//USER PRODUCT ROUTES




module.exports = router