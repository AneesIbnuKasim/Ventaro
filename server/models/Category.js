const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [30, 'Name cannot exceed 30 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [2, 'Description must be at least 2 characters long'],
    },
    image: {
        type: [String],
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Category', CategorySchema)