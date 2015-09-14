'use strict';

var mongoose = require('mongoose');

var disposalModel = function () {

    //Define a super simple schema for our products.
    var disposalSchema = mongoose.Schema({
        person: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Person',
            index: true
        },
        items: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Object'
            },
            quantity: Number
        }],
        date: {type: Date, index: true, default: Date.now}
    });

    return mongoose.model('Disposal', disposalSchema);

};

module.exports = new disposalModel();