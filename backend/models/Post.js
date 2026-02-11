const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        username: {
            type: String,
            required: true
        },
        postType: {
            type: String,
            required: true
        },
        postCategory: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        imgSrc: {
            type: String,
            required: false
        },
        postContent: {
            type: String,
            required: false
        },
        published: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Post', postSchema)