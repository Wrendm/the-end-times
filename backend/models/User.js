const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 25,
        lowercase: true,
        trim: true
    },
    bio: {
        type: String,
        required: false,
        unique: false,
        minlength: 0,
        maxlength: 90
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    roles: {
        type: [String],
        enum: ['Contributor', 'Admin', 'Editor'],
        default: ['Contributor']
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)