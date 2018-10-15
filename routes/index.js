var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/home');
});

router.get('/home', function(req, res, next) {
    res.render('homePage');
});
router.get('/file', function(req, res, next) {
    res.render('filePage');
});

module.exports = router;
