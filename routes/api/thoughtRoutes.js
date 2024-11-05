const router = require('express').Router();
const { Thought } = require('../../models');

// GET, POST, PUT, and DELETE routes for /api/thoughts endpoint
router.route('/').get(getAllThoughts).post(createThought);
router.route('/:id').get(getThoughtById).put(updateThought).delete(deleteThought);

// Reaction routes
router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

/* Add route handlers below */

module.exports = router;