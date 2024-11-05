const router = require('express').Router();
const { User } = require('../../models');

// GET, POST, PUT, and DELETE routes for /api/users endpoint
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

// Friends routes
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

/* Add route handlers below */

module.exports = router;