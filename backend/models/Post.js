const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      type: String
    },
    postContent: {
      type: String
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