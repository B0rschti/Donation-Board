'use strict';

var ObjectModel = require('../models/Object');

module.exports = function (router) {

    router.get('/', function (req, res) {

        ObjectModel.find().sort({name: 'ascending'}).exec(function(err, objects){

            res.render('object', {
                objects: objects
            });
        });
    });

    router.get('/show/:_id', function (req, res) {

        var id = req.params._id;

        ObjectModel.findOne({_id: id}, function(err, stockObject){
            res.render('object_show', {
                stockObject: stockObject
            });
        });
    });

    router.get('/edit', function(req, res){

        var stockObject = new ObjectModel();
        stockObject._id = null;

        res.render('object_edit', {
            stockObject: stockObject
        });
    });

    router.get('/edit/:_id', function(req, res){

        var id = req.params._id;

        ObjectModel.findOne({_id: id}, function(err, stockObject){
            res.render('object_edit', {
                stockObject: stockObject
            });
        });
    });

    router.post('/edit', function(req, res){

        if(req.body._id){

            ObjectModel.findOne({_id: req.body._id}, function(err, stockObject){
                stockObject.name = req.body.name;
                stockObject.quantity = req.body.quantity;

                stockObject.save(function(err, stockObject){
                    res.redirect('/object');
                });
            });

        }else{
            var stockObject = new ObjectModel({
                name: req.body.name,
                quantity: req.body.quantity
            });

            stockObject.save(function(err, stockObject){
                res.redirect('/object');
            });
        }
    });

    router.get('/delete/:_id', function(req, res){
        var id = req.params._id;

        ObjectModel.findOne({_id: id}, function(err, stockObject){
            res.render('object_delete', {
                stockObject: stockObject
            });
        });
    });

    router.post('/delete', function(req, res){

        var id = req.body._id;

        ObjectModel.remove({_id: id}, function(err, stockObject){
            res.redirect('/object');
        });
    });
};
