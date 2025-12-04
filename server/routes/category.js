const express = require('express')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')

const router = express.Router()

//category api handlers
router.get('/', authenticateAdmin, CategoryController.getAllCategories)
router.post('/', authenticateAdmin, CategoryController.addCategory)
router.put('/:id',authenticateAdmin ,CategoryController.updateCategory)
router.delete('/:id', authenticateAdmin, CategoryController.deleteCategory)

module.exports = router