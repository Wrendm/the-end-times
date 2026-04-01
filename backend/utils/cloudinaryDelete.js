const cloudinary = require('../config/cloudinary')

const deleteFromCloudinary = async (url) => {
  if (!url) return 

  const parts = url.split('/') 
  const fileName = parts[parts.length - 1]  // abc123.jpg
  const publicId = `posts/${fileName.split('.')[0]}`  // posts/abc123

  try {
    await cloudinary.uploader.destroy(publicId) 
  } catch (err) {
    console.error('Cloudinary delete error:', err) 
  }
} 

module.exports = { deleteFromCloudinary }