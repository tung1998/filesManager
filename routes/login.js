const express = require('express');
const router = express.Router();
const md5 = require('md5');
const cookie = require('cookie');
/* GET users listing. */


router.get('/', (req, res, next) => {
    res.render('loginPage');
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
    connection.query("SELECT email, userName, salt, password, activate FROM account WHERE  userName = '"+loginID+"'", (err, result, field) => {
        // console.log(pass);
        // console.log(result[0].password);
        if (result.length==0) res.send('0');
        else if (result[0].activate==0) res.send('1');
        else {
            const pass = md5(data.pass+result[0].salt);
            if (pass == result[0].password) res.send('2');
            else res.send('3')
        }
    })
});



module.exports = router;

