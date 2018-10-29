var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.redirect('/login');
});


router.get('/recoverpw', (req, res, next) => {
    res.render('recoverpw');
});
router.get('/file', (req, res, next) => {
    res.render('filePage');
});
router.get('/verify/:code', (req, res, next) => {
    res.render('filePage');
});

module.exports = router;
