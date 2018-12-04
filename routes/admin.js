var express = require('express');
var router = express.Router();
const cookie = require('cookie');


router.get('/login', (req, res, next) => {
    res.render("adminPage/login")
});


router.get('/:adminName',(req, res, next) => {
    // let name = req.params.adminName;
    // console.log(adminName);
    res.render("adminPage/adminPage")
});




module.exports = router;