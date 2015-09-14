'use strict';

module.exports = function (router) {

    router.get('/', function (req, res) {
        
        // redirect to the peoples page


        res.redirect('/disposal');
    });

};
