var express = require('express');
var router = express.Router();
const cookie = require('cookie');



/* GET home page. */
router.get('/', (req, res, next) => {
    var cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    console.log(cookies.name);
    if (!cookies.name) {
        res.render('loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, username, activate FROM account WHERE cookie = "${cookies.name}"`, (err, result, field) => {
            console.log(result);
            if (result.length) {
                if (result[0].activate) {
                    res.redirect(`/${result[0].username}`);
                }
            }
            else res.render('loginPage');
        })
        // res.setHeader('Set-Cookie', cookie.serialize('name', String('hello'), {
        //     httpOnly: true,
        //     maxAge: 60 * 60 * 24 * 7 // 1 week
        // }));
    }

});



router.post('/search',(req,res,next)=>{
    let text = req.body.text;
    let id = req.body.Owner_id
    connection = res.app.locals.connection;
    let data={};
    connection.query(`SELECT * FROM folder WHERE FolderName COLLATE UTF8_GENERAL_CI LIKE '%${text}%' and Owner_id ="${id}" limit 20 `, (err, result, field) => {
        if (err) throw err;
        data.folderInfor = result;
        connection.query(`SELECT * FROM file WHERE file_name COLLATE UTF8_GENERAL_CI LIKE '%${text}%'and Owner_id ="${id}" limit 20`, (err, result, field) => {
            if (err) throw err;
            data.fileInfor = result;
            res.send(data);
            res.end();
        })
    })
})

//
// router.get('/:user/*', (req, res, next) => {
//     var path = req.originalUrl.substr(1);
//
//     var cookies = cookie.parse(req.headers.cookie || '');
//     // console.log(req.headers.cookie);
//     // console.log(cookies.name);
//
//     connection = res.app.locals.connection;
//
//
//     if (!cookies.name) {
//         res.redirect('/login');
//     }
//     else {
//         connection.query(`SELECT id, RootID,userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
//             if (err) throw err;
//
//             if (result.length) {
//                 let data = {
//                     userInfo: result[0]
//                 }
//                 connection.query(`SELECT * FROM folder WHERE path = "${path}"`, (err, result, field) => {
//                     if (err) throw err;
//                     if (result.length) {
//                         data.localFolder = result[0]
//                         connection.query(`SELECT * FROM folder WHERE In_folder = "${data.localFolder.id}" AND onDelete = '0'`, (err, result, field) => {
//                             if (err) throw err;
//                             data.childrenFolder = result;
//                             connection.query(`SELECT * FROM file WHERE In_folder = "${data.localFolder.id}" AND onDelete = '0'`, (err, result, field) => {
//                                 if (err) throw err;
//                                 data.childrenFile = result;
//                                 res.render('filePage', {folderData: data});
//                                 // console.log(data)
//                                 res.end();
//                             })
//                         })
//
//                     }
//                 })
//             }
//         })
//     }
//
// });
router.get('/verify/:code', (req, res, next) => {
    res.render('filePage');
});

router.get('/*', (req, res, next) => {
    var path = req.originalUrl.substr(1);
    var cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    // console.log(cookies.name);
    if (!cookies.name) {
        // res.redirect('/login');
        res.render('loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if(err) throw err;
            let data = {
                userInfo: result[0],
                path:path
            }
            if (result.length){
                data.found = true;
                connection.query(`SELECT * FROM folder WHERE path ='${path}' AND Owner_id="${result[0].id}"`,(err, result, field) => {
                    if(err) throw err;
                    if(result.length) {
                        data.localFolder = result[0];
                        // console.log(result);
                        connection.query(`SELECT * FROM folder WHERE In_folder ='${data.localFolder.id}' AND onDelete = '0'`, (err, result, field) => {
                            if (err) throw err;
                            data.childrenFolder = result;
                            connection.query(`SELECT * FROM file WHERE In_folder ='${data.localFolder.id}' AND onDelete = '0'`, (err, result, field) => {
                                if (err) throw err;
                                data.childrenFile = result;
                                console.log(result)
                                res.render('filePage', {folderData: data});
                                res.end();
                            })
                        })
                    }else {
                        data.found=false;
                        data.localFolder="";
                        data.childrenFolder =[];
                        data.childrenFile = [];
                        res.render("filePage",{folderData:data})
                    }
                })
            }
            // else res.redirect('/login');
            else res.render('loginPage');
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