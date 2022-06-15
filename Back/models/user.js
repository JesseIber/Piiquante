const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// rajouter plugin pour vérifier l'unicité de l'addr email
// plugin pour signaler les erreurs de la bdd
// l'user ajoute 
const User = mongoose.model('User', {
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
})

mySchema.plugin(uniqueValidator);

module.exports = { User }