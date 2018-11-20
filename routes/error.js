var express = require('express');
var router = express.Router();
const cookie = require('cookie');


router.get('/404', (req, res, next) => {
    res.render("filePageNotLogin")
});


router.post('/:user', (req, res, next) => {

});




module.exports = router;