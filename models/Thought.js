const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reactionSchema = require('./Reaction');

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

module.exports = mongoose.model('Thought', ThoughtSchema);