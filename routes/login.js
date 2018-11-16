const express = require('express');
const router = express.Router();
const md5 = require('md5');
const cookie = require('cookie');
/* GET users listing. */


router.get('/', (req, res, next) => {
    var cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);

    console.log(cookies.name);
    if (!cookies.name) {
        res.render('loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, username FROM account WHERE cookie = "${cookies.name}" AND activate="1"`, (err, result, field) => {
            if(err) throw err;
            // console.log(result);
            if (result.length){
                res.redirect(`/${result[0].username}`);
            }
            else res.render('loginPage');
        })
    }
});


//  api login
// status = 0 : can't found account
// status = 1 : account not activate
// status = 2 : success
// status = 3 : wrong pass
router.post('/', function(req, res, next) {
    const data = req.body;
    const loginID = data.id;

    // console.log(data);

    connection = res.app.locals.connection;
    connection.query(`SELECT email, userName, salt, password, cookie, activate FROM account WHERE  userName = '${loginID}' OR email='${loginID}'`, (err, result, field) => {
        if(err) throw err;
        // console.log(pass);
        // console.log(result[0].password);
        if (result.length==0) res.send('0');
        else if (result[0].activate==0) res.send('1');
        else {
            const pass = md5(data.pass+result[0].salt);
            if (pass == result[0].password) {
                res.setHeader('Set-Cookie', cookie.serialize('name', result[0].cookie, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }));
                res.send(result[0].userName);
            }
            else res.send('3')
        }
    })
});



module.exports = router;

