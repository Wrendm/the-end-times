const cloudinary = require('../config/cloudinary') 
const streamifier = require('streamifier') 

function uploadToCloudinary(file, folder = 'posts') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error) 
        else resolve(result?.secure_url || '') 
      }
    ) 

    // pipe multer file buffer into cloudinary
    streamifier.createReadStream(file.buffer).pipe(stream) 
  }) 
}

module.exports = { uploadToCloudinary } 