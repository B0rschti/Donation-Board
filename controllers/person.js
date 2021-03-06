'use strict';

var Person = require('../models/Person');
var Note = require('../models/Note');
var Disposal = require('../models/Disposal');

module.exports = function (router) {

    router.get('/', function (req, res) {

        Person.find().sort({first_name: 'ascending'}).exec(function(err, persons){

            res.render('person', {
                persons: persons
            });
        });
    });

    router.get('/show/:_id', function (req, res) {

        var id = req.params._id;

        Person.findOne({_id: id}).populate('notes').exec(function(err, person){

            Disposal.find({person: person._id}).sort({date: 'descending'}).populate('person').populate('items.item').exec(function(err, disposals){
                res.render('person_show', {
                    person: person,
                    disposals: disposals
                });
            });
        });
    });

    router.get('/edit', function(req, res){

        var person = new Person();
        person._id = null;

        res.render('person_edit', {
            person: person
        });
    });

    router.get('/edit/:_id', function(req, res){

        var id = req.params._id;

        Person.findOne({_id: id}, function(err, person){
            res.render('person_edit', {
                person: person
            });
        });
    });

    router.post('/edit', function(req, res){

        if(req.body._id){

            Person.findOne({_id: req.body._id}, function(err, person){
                person.first_name = req.body.first_name;
                person.last_name = req.body.last_name;
                person.drk = req.body.drk;
                person.age = req.body.age;
                person.lang = req.body.lang;
                person.origin = req.body.origin;

                person.save(function(err, person){
                    res.redirect('/person/show/'+person._id);
                });
            });

        }else{
            var person = new Person({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                drk: req.body.drk,
                age: req.body.age,
                lang: req.body.lang,
                origin: req.body.origin
            });

            person.save(function(err, person){
                res.redirect('/person');
            });
        }
    });

    router.get('/delete/:_id', function(req, res){
        var id = req.params._id;

        Person.findOne({_id: id}, function(err, person){
            res.render('person_delete', {
                person: person
            });
        });
    });

    router.post('/delete', function(req, res){

        var id = req.body._id;

        Person.remove({_id: id}, function(err, person){
            res.redirect('/person');
        });
    });

    router.post('/note/add', function(req, res){
        var _id = req.body._id;
        var text = req.body.text;

        if(!text || text == ''){
            res.redirect('/person/show/'+_id);
            return;
        }

        Person.findOne({_id: _id}, function(err, person){
            var note = new Note({
                text: text
            });

            note.save(function(err, note){
                person.notes.push(note._id);
                person.save(function(err, person){
                    res.redirect('/person/show/'+_id);
                });
            });
        });
    });

    router.get('/note/remove/:_pid/:_nid', function(req, res){
        var _pid = req.params._pid;
        var _nid = req.params._nid;

        Person.findOne({_id: _pid}, function(err, person){
            Note.findOne({_id: _nid}, function(err, note){
                person.notes.pull({_id: _nid});
                note.remove();
                person.save(function(err, data){
                    res.redirect('/person/show/'+_pid);
                });
            });
        });
    });
};
