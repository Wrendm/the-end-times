const { mapUser } = require('./userMapper');

const mapPost = (post) => {
  if (!post) return null;

  return {
    id: post._id.toString(),
    user: mapUser(post.user), // handles populated user
    postType: post.postType,
    postCategory: post.postCategory,
    title: post.title,
    imgSrc: post.imgSrc,
    postContent: post.postContent,
    published: post.published,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

const mapPosts = (posts = []) => posts.map(mapPost);

module.exports = { mapPost, mapPosts };