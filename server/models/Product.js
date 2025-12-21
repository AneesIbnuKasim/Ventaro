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
    basePrice: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Active'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0
    },
    // // variant: [
    // //     {
    // //         size: {
    // //             type: String,
    // //         },
    // //         stock: {
    // //             type: Number,
    // //             default: 0
    // //         }
    // //     }
    // ],
    // stock: {
    //     type: Number,
    //     required: true,
    //     min: 0
    // },
    images: {
        type: [String],
        required: true
    }
},{timestamps: true})


module.exports = mongoose.model('Products', ProductSchema)