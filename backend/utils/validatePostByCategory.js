const createError = require('./createError')

const validatePostByCategory = (category, data, file) => {
  const { imgSrc, postContent, audioSrc, videoSrc } = data

  switch (category.type) {
    case 'Text':
      if (!postContent) {
        throw createError('Text posts require postContent', 400)
      }
      break

    case 'Image':
      if (!imgSrc && !file) {
        throw createError('Image posts require imgSrc or uploaded file', 400);
      }
      break

    case 'Audio':
      if (!audioSrc) {
        throw createError('Audio posts require audioSrc', 400)
      }
      break

    case 'Video':
      if (!videoSrc) {
        throw createError('Video posts require videoSrc', 400)
      }
      break

    default:
      throw createError('Invalid category type', 400)
  }
}

module.exports = validatePostByCategory