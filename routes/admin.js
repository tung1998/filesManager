const express = require('express');
const router = express.Router();
const cookie = require('cookie');
const md5 = require('md5');


router.get('/', (req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.admin) {
        res.render('adminPage/loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT * FROM admin WHERE cookie = "${cookies.admin}"`, (err, result, field) => {
            // console.log(result);
            if (result.length) res.redirect(`/admin/${result[0].username}`);
            else res.render('adminPae/loginPage');
        })
    }

});


router.get('/*',(req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '');
    let path = req.originalUrl.substr(7);
    // console.log(path)
    if (!cookies.admin) {
        res.render('adminPage/loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT * FROM admin WHERE cookie = "${cookies.admin}"`, (err, result, field) => {
            if(err) throw err;
            if (result.length){
                if(path==result[0].username) res.render('adminPage/adminPage',{userName:result[0].username})
                else res.redirect(`/admin/${result[0].username}`);
            }
            else res.render('adminPage/loginPage');
        })

    }

});


router.post('/addNewAdmin', function(req, res, next) {
    const data = req.body;
})



router.post('/login', function(req, res, next) {
    const data = req.body;
    const loginID = data.id;

    connection = res.app.locals.connection;
    connection.query(`SELECT * FROM admin WHERE  userName = '${loginID}'`, (err, result, field) => {
        if(err) throw err;
        // console.log(pass);
        // console.log(result[0].password);
        if (result.length==0) res.send('0');
        else {
            const pass = md5(data.pass+result[0].salt);
            console.log(pass,result[0].password)
            if (pass == result[0].password) {
                res.setHeader('Set-Cookie', cookie.serialize('admin', result[0].cookie, {
                    httpOnly: true,
                    path:'/',
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }));
                res.send('2');
            }
            else res.send('3')
        }
    })
});


router.post('/getUserData', function(req, res, next) {
    let cookies = cookie.parse(req.headers.cookie || '');
    // console.log(path)
    if (!cookies.admin) {
        res.render('adminPage/loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT * FROM admin WHERE cookie = "${cookies.admin}"`, (err, result, field) => {
            if (err) throw err;
            if (result.length == 0) res.send('0');
            else {
                connection.query(`SELECT * FROM account`, (err, result, field) => {
                    if (err) throw err;
                    // console.log(pass);
                    // console.log(result[0].password);
                    if (result.length == 0) res.send('0');
                    else {
                        res.send(result);
                    }
                })
            }
        })
    }
});

router.post('/getFileData', function(req, res, next) {
    let cookies = cookie.parse(req.headers.cookie || '');
    // console.log(path)
    if (!cookies.admin) {
        res.render('adminPage/loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT * FROM admin WHERE cookie = "${cookies.admin}"`, (err, result, field) => {
            if (err) throw err;
            if (result.length == 0) res.send('0');
            else {
                connection.query(`SELECT * FROM folder WHERE In_folder IS NULL`, (err, result, field) => {
                    if (err) throw err;
                    if (result.length == 0) res.send('0');
                    else {
                        res.send(result);
                    }
                })
            }
        })
    }
});



router.post('/getAdminData', function(req, res, next) {
    let cookies = cookie.parse(req.headers.cookie || '');
    // console.log(path)
    if (!cookies.admin) {
        res.render('adminPage/loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT * FROM admin WHERE cookie = "${cookies.admin}"`, (err, result, field) => {
            if (err) throw err;
            if (result.length == 0) res.send('0');
            else {
                connection.query(`SELECT * FROM admin`, (err, result, field) => {
                    if (err) throw err;
                    if (result.length == 0) res.send('0');
                    else {
                        res.send(result);
                    }
                })
            }
        })
    }
});



router.post('/logout',(req,res,next) => {
    console.log('admnlogout')
    res.clearCookie("admin");
    res.send('success');
})



module.exports = router;