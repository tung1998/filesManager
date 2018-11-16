const express = require('express');
const router = express.Router();
const md5 = require('md5');
const cookie = require('cookie');
const nodemailer = require('nodemailer');



/* GET users listing. */


//api recover pass
//status = 1: sucsess
//status = 2 : wrongemail

//url confirm mail



router.get('/verify/:code', function(req, res, next) {
    const code = req.params.code;
    connection = res.app.locals.connection;
    connection.query("SELECT email, salt FROM account WHERE activate = '0'", (err, result, field) => {
        if(err) throw err;
        console.log(result);
        for (var i = 0; i <result.length; i++){
            if( code == (md5(result[i].email+result[i].salt))){
                console.log(code);
                console.log( md5(result[i].email+result[0].salt));
                connection.query("UPDATE `account` SET `activate`='1' WHERE `email`='"+result[i].email+"';", (err, result, field) => {
                    if(err) throw err;
                })
                break;
            }
        }
    })
    res.redirect("../../login");
});



router.post('/logout',(req,res,next) => {
    console.log('2')
    res.clearCookie("name");
    res.send('success');
})
module.exports = router;


//
// function makeRandomPass() {
//     var pass = "";
//     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//     for (var i = 0; i < 8; i++)
//         pass += possible.charAt(Math.floor(Math.random() * possible.length));
//
//     return pass;
// }
