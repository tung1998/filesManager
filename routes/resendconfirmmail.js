const express = require('express');
const router = express.Router();
const md5 = require('md5');
const cookie = require('cookie');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'filemanager.blackbird@gmail.com',
        pass: 'filemanager'
    }
});

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.render('resendconfirmmail')
})

//api resendconfirmmail
//status = 1: sucsess
//status = 0 : wrongemail
router.post('/', function(req, res, next) {
    const email = req.body.email;
    // const pass = makeRandomPass();
    console.log(email.split('@'));
    connection = res.app.locals.connection;
    connection.query("SELECT salt FROM account WHERE email = '"+email+"'", (err, result, field) => {
        if(err) throw err;
        console.log(result);
        if(result.length==1) {
            res.send('1');
            var userMail = {
                from: 'filemanager.blackbird@gmail.com',
                to: email,
                subject: 'confirm email filesmanager account',
                text: 'That was easy!',
                html: '<h1>filesmanager</h1>' +
                    '<img src="cid:logo@filesmanager.com">' +
                    '<h5> quý khách xác nhận tài khoản filesmanager' +
                    '    <a href="http://localhost:3000/users/verify/'+ md5(email+result[0].salt) +'"> tại đây </a></h5>',
                attachments: [{
                    filename: 'logo.png',
                    path: __dirname + '/../public/images/logo.png',
                    cid: 'logo@filesmanager.com' //same cid value as in the html img src
                }]
            };


            transporter.sendMail(userMail, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

        }else res.send('0');
    })
});




module.exports = router;


