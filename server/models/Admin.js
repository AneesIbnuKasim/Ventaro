const mongoose = require('mongoose')
const jwt = require('jwt')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
        type: true,
        enum: ['admin'],
        default: 'admin'
    },
    permissions: {
        type: String,
        enum: ['fullAccess', 'viewOnly'],
        default: 'fullAccess'
    },
    status: {
        type: String,
        enum: ['active', 'banned'],
        default: 'active'
    },
    lastLogin: {
        type: Date,
        default: null
    },
    banReason: {
        type: String,
        default: null,
    },
    bannedAt: {
        type: Date,
        default: null
    },
    bannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
}, {timestamps: true})



module.exports = mongoose.model('Admin', adminSchema)