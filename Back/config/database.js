var mongoose = require('mongoose');

var mongoDB = process.env.MONGO_URL || null;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));