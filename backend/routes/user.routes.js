const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller') 

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)


router.route('/:id')
    .get(usersController.getSingleUser)
    .put(usersController.updateUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)


module.exports = router