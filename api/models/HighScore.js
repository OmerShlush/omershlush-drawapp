const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const highscoreSchema = new Schema({
    score: {
        type: Number,
        required: true
    },
    playerA: {
        type: String,
        required: true
    },
    playerB: {
        type: String,
        required: true
    }

});


module.exports = mongoose.model('HighScore', highscoreSchema);

