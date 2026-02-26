const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')

// @desc -> all users
// @route GET /users 
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean()
        if (!users?.length) return res.status(400).json({ message: 'No users found' })
        res.json(users)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc -> single user
// @route GET /users/:id 
const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password').lean()
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json(user)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc -> create user
// @route POST /users 
const createNewUser = async (req, res) => {
    try {
        const { username, name, email, password, roles } = req.body;

        const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean()
        if (duplicate) return res.status(409).json({ message: 'Duplicate username or email not allowed' })

        const hashedPwd = await bcrypt.hash(password, 10)

        const user = await User.create({ username, name, email, "password": hashedPwd, roles })
        res.status(201).json({ message: `New user ${user.username} created` })
    } catch (err) {
        console.error(err);
        console.error('POST /users error:', err); // <--- add this
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc -> update user entirely
// @route PUT /users/:id 
const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { username, name, email, password, roles } = req.body;

        const user = await User.findById(id)
        if (!user) return res.status(400).json({ message: 'User not found' })

        const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean()
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: 'Duplicate username or email' })
        }

        user.username = username
        user.name = name
        user.email = email
        user.roles = roles
        if (password) user.password = await bcrypt.hash(password, 10)

        const updatedUser = await user.save()
        res.json({ message: `${updatedUser.username} updated` })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc -> update user in part
// @route PATCH /users/:id 
const updateUserPartial = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (updates.username || updates.email) {
            const duplicate = await User.findOne({
                $or: [{ username: updates.username }, { email: updates.email }]
            }).lean();
            if (duplicate && duplicate._id.toString() !== id) return res.status(409).json({ message: 'Duplicate username or email' });
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });

        const updatedUser = await user.save();

        res.json({ message: `${updatedUser.username} updated`, user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc -> delete user
// @route DELETE /users/:id 
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findOne({ user: id }).lean()
        if (post) return res.status(400).json({ message: 'User has posts that need to be deleted first' })

        const user = await User.findById(id)
        if (!user) return res.status(400).json({ message: 'User not found' })

        const result = await user.deleteOne()

        res.json(`User deleted`)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports = {
    getAllUsers,
    getSingleUser,
    createNewUser,
    updateUser,
    updateUserPartial,
    deleteUser
}