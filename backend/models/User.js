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
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
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
    }
},{ timestamps: true })

module.exports = mongoose.model('User', userSchema)