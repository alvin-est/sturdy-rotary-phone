const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/sturdy-rotary-phone');

module.exports = mongoose.connection;