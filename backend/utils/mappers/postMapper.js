const { mapUser } = require('./userMapper')
const { mapCategory } = require('./categoryMapper')

const mapPost = (post) => {
  if (!post) return null

  return {
    id: post._id.toString(),
    user: mapUser(post.user),                 
    postCategory: post.postCategory._id.toString(),
    category: mapCategory(post.postCategory),
    postType: post.postCategory.type,        
    title: post.title,
    imgSrc: post.imgSrc,
    audioSrc: post.audioSrc,
    videoSrc: post.videoSrc,
    postContent: post.postContent,
    published: post.published,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}

const mapPosts = (posts = []) => posts.map(mapPost)

module.exports = { mapPost, mapPosts }