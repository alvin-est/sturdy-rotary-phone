const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');
const User = require('./User');

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timeStamp => dateFormat(timeStamp)
    },
    username: {
        type: String,
        required: true
    },
    userId: { 
        // link thought with the user
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reactions: [reactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// Pre-save hook to add thought to user's thoughts array automatically
ThoughtSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            await User.findByIdAndUpdate(
                this.userId,
                { $push: { thoughts: this._id } }
            );
        } catch (error) {
            // Log error if failed
            console.error('Failed to add thought to user:', error);
        }
    }
    next();
});

// Post middleware for when a Thought is deleted
ThoughtSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await User.findByIdAndUpdate(
            doc.userId,
            { $pull: { thoughts: doc._id } }
        );
    }
});


const Thought = mongoose.model('Thought', ThoughtSchema);

module.exports = Thought;