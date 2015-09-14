'use strict';

var mongoose = require('mongoose');

var personModel = function () {

    //Define a super simple schema for our products.
    var personSchema = mongoose.Schema({
        first_name: {type: String, index: true},
        last_name: {type: String, index: true},
        drk: {type: String, index: true},
        lang: {type: String},
        origin: {type: String},
        notes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }]
    });

    return mongoose.model('Person', personSchema);

};

module.exports = new personModel();