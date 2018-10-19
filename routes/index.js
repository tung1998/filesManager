var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/login');
});

router.get('/login', function(req, res, next) {
    res.render('loginPage');
});
router.get('/register', function(req, res, next) {
    res.render('registerPage');
});
router.get('/recoverpw', function(req, res, next) {
    res.render('recoverpw');
});
router.get('/file', function(req, res, next) {
    res.render('filePage');
});

module.exports = router;
