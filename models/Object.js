'use strict';

var mongoose = require('mongoose');

var objectModel = function () {

    //Define a super simple schema for our products.
    var objectSchema = mongoose.Schema({
        name: {type: String, index: true},
        quantity: {type: Number},
        notes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }]
    });

    return mongoose.model('Object', objectSchema);

};

module.exports = new objectModel();