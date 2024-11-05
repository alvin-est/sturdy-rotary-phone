const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/sturdy-rotary-phone');

module.exports = mongoose.connection;