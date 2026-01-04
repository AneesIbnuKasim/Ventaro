const express = require('express')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')
const { default: upload } = require('../config/multer')

const router = express.Router()

//category api handlers
router.get('/', authenticateAdmin, CategoryController.getAllCategories)
router.post('/', authenticateAdmin, upload.single('image'), CategoryController.addCategory)
router.put('/:id',authenticateAdmin ,CategoryController.updateCategory)
router.delete('/:id', authenticateAdmin, CategoryController.deleteCategory)

module.exports = router