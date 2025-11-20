const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [2, 'name must be at least 2 characters'],
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: [8, 'name must be at least 8 characters'],
    },
    brandName: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sizes: {
        type: [String],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String],
        required: true
    }
},{timestamps: true})

module.exports = mongoose.Model('Products', ProductSchema)