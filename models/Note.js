'use strict';

var mongoose = require('mongoose');

var noteModel = function () {

    //Define a super simple schema for our products.
    var noteSchema = mongoose.Schema({
        text: {type: String}
    });

    return mongoose.model('Note', noteSchema);

};

module.exports = new noteModel();