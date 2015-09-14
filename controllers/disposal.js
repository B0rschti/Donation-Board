'use strict';

var Person = require('../models/Person');
var ObjectModel = require('../models/Object');
var Disposal = require('../models/Disposal');
var async = require('async');


module.exports = function (router) {

    router.get('/', function (req, res) {

        var query = req.query.name;

        Person.find({
            $or: [
                {"first_name": new RegExp(query, "i")},
                {"last_name": new RegExp(query, "i")}
            ]
        }).sort({first_name: 'ascending'}).exec(function (err, persons) {

            res.render('disposal', {
                persons: persons
            });
        });

    });

    router.get('/new/:_id', function (req, res) {

        Person.findOne({_id: req.params._id}).populate('notes').exec(function (err, person) {
            ObjectModel.find({}).sort({name: 'ascending'}).exec(function (err, objects) {

                var objectList = [];

                objects.forEach(function (object) {
                    objectList.push({
                        item: object,
                        quantity: 0
                    });
                });

                res.render('disposal_new', {
                    person: person,
                    objects: objectList,
                    messages: []
                });
            });
        });
    });

    router.get('/checkout/:_id', function(req, res){

        Disposal.findOne({_id: req.params._id})
            .populate('person')
            .populate('items.item')
            .exec(function(err, disposal){

                res.render('disposal_checkout', {
                    'disposal': disposal
                });
        });

    });

    router.post('/new/:_id', function (req, res) {

        var disposal = null;
        var items = req.body.items;

        // check if the item values are allowes


        Person.findOne({_id: req.params._id}, function (err, person) {
            ObjectModel.find({}).sort({name: 'ascending'}).exec(function (err, objects) {

                var disposal = new Disposal({
                    person: person._id,
                    items: [],
                });

                var objectList = [];
                var messages = [];

                objects.forEach(function (object) {
                    objectList.push({
                        item: object,
                        quantity: 0
                    });
                });

                objects.forEach(function (value) {

                    if (parseInt(items[value._id]) <= value.quantity) {

                        if(parseInt(items[value._id]) != 0) {
                            disposal.items.push({
                                item: value._id,
                                name: value.name,
                                quantity: items[value._id]
                            });
                        }
                    } else {
                        messages.push({
                            text: 'Es gibt nur ' + value.quantity + ' ' + value.name + ' im Bestand.'
                        });
                        console.log('Es gibt nur ' + value.quantity + ' ' + value.name + ' im Bestand.');
                    }
                });

                if (messages.length == 0) {

                    // remove the objects from the objects list
                    async.forEachOf(disposal.items, function (value, key, callback) {

                        var quantity = value.quantity;
                        console.log(value);
                        if (quantity != 0) {
                            ObjectModel.findOne({_id: value.item}, function (err, object) {

                                object.quantity = object.quantity - quantity;

                                object.save(function (err, object) {
                                    callback(null, null);
                                });
                            });
                        } else {
                            callback(null, null);
                        }


                    }, function (err) {
                        disposal.save(function (err, disposal) {
                            res.redirect('/disposal/checkout/' + disposal._id);
                        });
                    });
                } else {

                    res.render('disposal_new', {
                        'person': person,
                        'messages': messages,
                        'objects': objectList
                    });
                }
            });
        });
    });
};
