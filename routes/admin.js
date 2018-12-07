const express = require('express');
const router = express.Router();
const cookie = require('cookie');
const md5 = require('md5');



router.use('/',checkAdmin)

router.get('/', (req, res, next) => {
    if(req.admin){
        res.redirect(`/admin/${req.admin.username}`);
    }else {
        res.render('adminPae/loginPage');
    }
});


router.get('/*',(req, res, next) => {
    let path = req.originalUrl.substr(7);
    if(req.admin){
        if(path==req.admin.username) res.render('adminPage/adminPage',{userName:req.admin.username})
        else res.redirect(`/admin/${req.admin.username}`);
    }else {
        res.render('adminPae/loginPage');
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
    if(req.admin){
        connection.query(`select account.id as id, username,email,folderCount,fileCount,dataUsed from account 
                                    left join (select count(*) as folderCount,Owner_id from folder group by Owner_id) as folder
                                     on  account.id = folder.Owner_id 
                                    left join (select count(*) as fileCount, SUM(size) as dataUsed,Owner_id from file group by Owner_id) as file 
                                     on  account.id = file.Owner_id;`, (err, result, field) => {
            if (err) throw err;
            if (result.length) res.send(result);
            else res.send('0');
        })
    }else res.send('0');
});

router.post('/getFileData', function(req, res, next) {
    if(req.admin){
        connection.query(`SELECT * FROM folder WHERE In_folder IS NULL`, (err, result, field) => {
            if (err) throw err;
            if (result.length) res.send(result);
            else res.send('0');
        })
    }else res.send('0');
});



router.post('/getAdminData', function(req, res, next) {
    if(req.admin){
        connection.query(`SELECT * FROM admin`, (err, result, field) => {
            if (err) throw err;
            if (result.length) res.send(result);
            else res.send('0');
        })
    }else res.send('0');
});



router.post('/logout',(req,res,next) => {
    console.log('admnlogout')
    res.clearCookie("admin");
    res.send('success');
})

function checkAdmin(req,res,next){
    connection = res.app.locals.connection;
    let cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.admin) {
        res.admin=false;
        next();
    }
    else {
        connection.query(`SELECT id,username FROM admin WHERE cookie = "${cookies.admin}"`, (err, result, field) => {
            if (err) throw err;
            if(result.length) {
                req.admin=result[0];
                next();
            }else{
                res.admin=false;
                next();
            }
        })
    }
}

module.exports = router;