const { User } = require('../models');

// GET all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
}

// GET a single user by its ID
async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// POST to create a new user
async function createUser(req, res) {
    // console.log(`Created user:`);
    // console.log(req.body);
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// PUT to update user info by its ID
async function updateUser(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

// DELETE to remove a user by its ID
async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// POST to add a new friend to a user's friend list
async function addFriend(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $push: { friends: req.params.friendId } }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

// DELETE to remove a friend from a user's friend list
async function removeFriend(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { $pull: { friends: req.params.friendId } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
}