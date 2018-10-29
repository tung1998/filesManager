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

/* GET registerPage listing. */

router.get('/', (req, res, next) => {
    res.render('registerPage');
});


// api register
router.post('/', function(req, res, next) {
    connection = res.app.locals.connection;
    //set register data
    const data = req.body;
    const email = data.email;
    const username = data.id;
    const salt = md5(Math.random().toString());
    const pass = md5(data.pass+salt);
    const cookie =md5(Math.random().toString());
    console.log(md5(email+salt));
    //set email
    var userMail = {
        from: 'filemanager.blackbird@gmail.com',
        to: email,
        subject: 'confirm email filesmanager account',
        text: 'That was easy!',
        html: '<h1>filesmanager</h1>' +
              '<img src="cid:logo@filesmanager.com">' +
              '<h5> quý khách xác nhận tài khoản filesmanager' +
              '    <a href="http://localhost:3000/users/verify/'+ md5(email+salt) +'"> tại đây </a></h5>',
        attachments: [{
            filename: 'logo.png',
            path: __dirname + '/../public/images/logo.png',
            cid: 'logo@filesmanager.com' //same cid value as in the html img src
        }]
    };


    // check user accout
    // status = 1 : success
    // status = 2 : mail had been used
    // status = 3 : mail hadn't been activated
    // status = 4 : user had been used
    connection.query("SELECT email,activate FROM account WHERE email = '"+email+"'",(err, result, field) => {
        console.log(result[0]);
        if(!result.length) {
            console.log("email can be use");
            connection.query("SELECT userName FROM account WHERE userName = '" + username + "'", (err, result1, field) => {
                console.log(result1);
                if (!result1.length) {
                    console.log("username can be use");
                    connection.query("INSERT INTO `account` (`email`, `userName`, `password`, `salt`, `cookie`) VALUES ('" + email + "', '" + username + "', '" + pass + "', '" + salt + "', '" + cookie + "');", (err, result, field) => {
                        //console.log(result);
                        //send mail confirm
                        transporter.sendMail(userMail, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.send('1');
                    });
                } else res.send('4');
            })
        }
        else if(result[0].activate) res.send('2');
        else res.send('3');
    });


});


module.exports = router;

