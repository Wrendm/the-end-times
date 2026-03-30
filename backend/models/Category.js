const mongoose = require('mongoose')

const typesEnum = ['Text', 'Image', 'Audio', 'Video']

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    type: {
      type: String,
      enum: typesEnum,
      required: [true, 'Category type is required']
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

module.exports = mongoose.model('Category', categorySchema)