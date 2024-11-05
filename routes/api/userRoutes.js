const router = require('express').Router();
const { User } = require('../../models');

// Import route handlers from userController
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
} = require('../../controllers/userController');

// GET, POST, PUT, and DELETE routes for /api/users endpoint
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

// Friends routes
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);


module.exports = router;