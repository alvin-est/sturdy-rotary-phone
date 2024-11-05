const { default: mongoose } = require('mongoose');
const { Thought } = require('../models');

// GET all thoughts
async function getAllThoughts(req, res) {
    try {
        const thoughts = await Thought.find({});
        res.json(thoughts);
    } catch (err) {
        res.status(400).json(err);
    }
}

// GET a single thought by its ID
async function getThoughtById(req, res) {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    } catch (err) {
        res.status(400).json(err);
    }
}

// POST a new thought
async function createThought(req, res) {
    try {
        console.log(`Created new thought:`);
        console.log(req.body);

        // For seed purposes. If an array of thoughts is sent, create each one
        if(Array.isArray(req.body)) {
        /* Comment out in production */
            const thoughts = [];
            for (let thoughtData of req.body) {
                if (!thoughtData.userId) {
                    return res.status(400).json({ message: 'User ID is required for each thought in the array.' });
                }
                const thought = await Thought.create(thoughtData);
                thoughts.push(thought);
            }
            
            return res.status(201).json(thoughts);
        }

        /* For production */
        // Ensure userId is included in the request body
        if(!req.body.userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // Create new thought
        const thought = await Thought.create({
            ...req.body,
            userId: req.body.userId // Use userId from the request
        });

        res.status(201).json(thought); // Status for successful POST operation
    } 
    catch (err) {
        console.log('Error:', err);
        res.status(400).json(err);
    }
}

// PUT to update a thought by its ID
async function updateThought(req, res) {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    } catch (err) {
        res.status(400).json(err);
    }
}

// DELETE to remove a thought by its ID
async function deleteThought(req, res) {
    try {
        // Trigger middleware function to remove thought from user's thoughts array
        const thought = await Thought.findOneAndDelete({ _id: req.params.id });
        
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }

        res.json({ message: 'Thought deleted!', thought: thought });
    } catch (err) {
        console.error('Error deleting thought:', err);
        res.status(400).json(err);
    }
}

// POST to add a reaction to a thought
async function addReaction(req, res) {
    try {
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;

        // Check if required fields are provided
        if (!reactionBody || !username) {
            return res.status(400).json({ message: 'Reaction body and username are required.' });
        }

        const thought = await Thought.findById(thoughtId);
        
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }

        // Create a new reaction object
        const newReaction = {
            reactionBody,
            username
        };

        // Create the subdocument and set reactionId to _id
        const subdoc = thought.reactions.create(newReaction);
        subdoc.reactionId = subdoc._id; // Set reactionId to _id

        // Push the new reaction to the thought's reactions array
        thought.reactions.push(subdoc);

        // Save the thought to update it with the new reaction
        const updatedThought = await thought.save();

        // Send the updated thought with the new reaction
        res.status(200).json(updatedThought);
    } catch (err) {
        console.error('Error adding reaction:', err);
        res.status(400).json({ message: err.message });
    }
}

// DELETE to remove a reaction from a thought
async function removeReaction(req, res) {
    try {
        const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { new: true });
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thought);
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
};