const express = require('express')
const router = express.Router()

const postsController = require('../controllers/posts.controller') 
const usersController = require('../controllers/users.controller') 
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')

router.use(verifyJWT);
router.use(verifyRoles('admin'));


router.get('/posts', postsController.getAllPostsAdmin);
router.get('/users', usersController.getAllUsersAdmin);


module.exports = router