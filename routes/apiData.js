var express = require('express');
var router = express.Router();

/* GET file page. */

router.get('/file', function(req, res, next) {
    res.render('filePage');
});

module.exports = router;
