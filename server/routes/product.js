const express = require('express')
const ProductController = require('../controllers/ProductController')

const router = express.Router()

router.get('/',ProductController.getProducts)
router.get('/:id',ProductController.getProduct)

module.exports = router