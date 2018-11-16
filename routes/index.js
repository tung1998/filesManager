var express = require('express');
var router = express.Router();
const cookie = require('cookie');



/* GET home page. */
router.get('/', (req, res, next) => {
    var cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    console.log(cookies.name);
    if (!cookies.name) {
        res.redirect('/login');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, username, activate FROM account WHERE cookie = "${cookies.name}"`, (err, result, field) => {
            console.log(result);
            if(result.length)
            if (result[0].activate){
                res.redirect(`/${result[0].username}`);
            }
            else res.redirect('/login');
        })
        // res.setHeader('Set-Cookie', cookie.serialize('name', String('hello'), {
        //     httpOnly: true,
        //     maxAge: 60 * 60 * 24 * 7 // 1 week
        // }));
    }

});

//
router.get('/:user/*', (req, res, next) => {
    var path = req.originalUrl.substr(1);

    var cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    // console.log(cookies.name);

    connection = res.app.locals.connection;


    if (!cookies.name) {
        res.redirect('/login');
    }
    else {
        connection.query(`SELECT RootID,userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if (err) throw err;

            if (result.length) {
                let data = {
                    userInfo: result[0]
                }
                connection.query(`SELECT * FROM folder WHERE path = "${path}"`, (err, result, field) => {
                    if (err) throw err;
                    if (result.length) {
                        data.localFolder = result[0]
                        connection.query(`SELECT * FROM folder WHERE In_folder = "${result[0].id}"`, (err, result, field) => {
                            if (err) throw err;
                            data.childrenFolder = result;
                            res.render('filePage', {folderData: data});
                            console.log(data)
                            res.end();
                        })
                    }
                })
            }
        })
    }

});


router.get('/:user', (req, res, next) => {

    var cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    // console.log(cookies.name);
    if (!cookies.name) {
        res.redirect('/login');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if(err) throw err;
            var data = {
                userInfo: result[0]
            }
            if (result.length){
                connection.query(`SELECT * FROM folder WHERE id ='${result[0].RootID}'`,(err, result, field) => {
                    if(err) throw err;
                    data.localFolder = result[0];
                    // console.log(result);
                    connection.query(`SELECT * FROM folder WHERE In_folder ='${result[0].id}'`,(err, result, field) => {
                        if(err) throw err;
                        data.childrenFolder = result;
                        res.render('filePage',{folderData:data});
                        res.end();
                    })
                })
            }
            else res.redirect('/login');
        })

    }

});

router.get('/verify/:code', (req, res, next) => {
    res.render('filePage');
});

module.exports = router;

//
// Object.prototype.isEmpty = function() {
//     for(var key in this) {
//         if(this.hasOwnProperty(key))
//             return false;
//     }
//     return true;
// }