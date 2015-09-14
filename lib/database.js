/**
 * A custom library to establish a database connection
 */
'use strict';

var db = function () {
    return {

        /**
         * Open a connection to the database
         * @param conf
         */
        config: function (conf) {

            if("path" in conf){
                require('tungus');
                var mongoose = require('mongoose');

                mongoose.connect('tingodb://' + conf.path);
                global.TUNGUS_DB_OPTIONS =  { nativeObjectID: true, searchInArray: true };
            }else {
                var mongoose = require('mongoose');
                mongoose.connect('mongodb://' + conf.host + '/' + conf.database);
            }

            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();