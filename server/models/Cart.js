const mongoose = require('mongoose')

const CartSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalQuantity: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    }
},{timestamps: true})


module.exports = mongoose.model('Cart', CartSchema)