const { mapUser } = require('./userMapper')
const { mapCategory } = require('./categoryMapper')

const mapPost = (post) => {
  if (!post) return null

  return {
    id: post._id.toString(),
    user: mapUser(post.user),
    postCategory: mapCategory(post.postCategory),
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