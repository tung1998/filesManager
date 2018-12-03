var express = require('express');
var router = express.Router();
const cookie = require('cookie');

const path =require("path");

/* GET home page. */
router.get('/', (req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.name) {
        res.render('loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, username FROM account WHERE cookie = "${cookies.name}"AND activate="1"`, (err, result, field) => {
            // console.log(result);
            if (result.length) res.redirect(`/${result[0].username}`);
            else res.render('loginPage');
        })
    }

});



// router.post('/search',(req,res,next)=>{
//     let text = req.body.text;
//     let id = req.body.Owner_id;
//     let localID =req.body.localFolder;
//     connection = res.app.locals.connection;
//     let data={};
//     connection.query(`SELECT * FROM folder WHERE FolderName COLLATE UTF8_GENERAL_CI LIKE '%${text}%' and Owner_id ="${id}" and In_folder ="${localID}" and onDelete="0" limit 20 `, (err, result, field) => {
//         if (err) throw err;
//         data.folderInfor = result;
//         connection.query(`SELECT * FROM file WHERE file_name COLLATE UTF8_GENERAL_CI LIKE '%${text}%'and Owner_id ="${id}" and In_folder ="${localID}" and onDelete="0" limit 20`, (err, result, field) => {
//             if (err) throw err;
//             data.fileInfor = result;
//             res.send(data);
//             res.end();
//         })
//     })
// })

// router.get('/verify/:code', (req, res, next) => {
//     res.render('filePage');
// });

router.get('/:user/*', (req, res, next) => {
    let user = req.params.user;
    let Path = req.originalUrl.substr(1);
    let cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    // console.log(cookies.name);
    if (!cookies.name) {
        // res.redirect('/login');
        res.render('loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, RootID, username FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if(err) throw err;
            let data = {
                userInfo: result[0],
                path:Path
            }
            if (result.length){
                data.found = true;
                connection.query(`SELECT * FROM folder WHERE (path ='${Path}' AND Owner_id="${result[0].id}" AND onDelete='0')`,(err, result, field) => {
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
                                // console.log(result)
                                res.render('filePage', {folderData: data});
                                res.end();
                            })
                        })
                    }else {
                        if(user=="download") {
                            let codeName = Path.substr(9);
                            console.log(codeName);
                            connection.query(`SELECT file_name FROM file WHERE codeName ='${codeName}' AND Owner_id="${data.userInfo.id}" AND onDelete = '0'`, (err, result, field) => {
                                if (err) throw err;
                                if(result.length) {
                                    try {
                                        res.download(path.join(__dirname, "../", "public", "userFile", codeName), result[0].file_name, function (err) {
                                            if (err) {
                                                data.found = false;
                                                data.localFolder = {};
                                                data.childrenFolder = [];
                                                data.childrenFile = [];
                                                res.render("filePage", {folderData: data})
                                            } else {
                                                console.log("download : " + path);
                                            }
                                        })
                                    }catch (e) {
                                        console.log(":)")
                                    }
                                }else {
                                    data.found = false;
                                    data.localFolder = {};
                                    data.childrenFolder = [];
                                    data.childrenFile = [];
                                    res.render("filePage", {folderData: data})
                                }
                            })

                        }else if(user=="shareWithMe") {
                            Path = Path.substr(12);
                            console.log(Path);
                            connection.query(`SELECT * FROM folder WHERE path ='${Path}' AND onDelete = '0'`, (err, result, field) => {
                                if (err) throw err;
                                if(result.length) {
                                    connection.query(`SELECT * FROM folder_share WHERE id ='${result[0].id}' AND user_id = '${data.userInfo.id}'`, (err, result, field) => {
                                        if (err) throw err;
                                        if(result.length) {
                                            data.localFolder = result[0];
                                            data.localFolder.path=`${data.userInfo.username}/Share With Me/${Path}`
                                            connection.query(`SELECT * FROM folder WHERE In_folder ='${data.localFolder.id}' AND onDelete = '0'`, (err, result, field) => {
                                                if (err) throw err;
                                                data.childrenFolder = result;
                                                connection.query(`SELECT * FROM file WHERE In_folder ='${data.localFolder.id}' AND onDelete = '0'`, (err, result, field) => {
                                                    if (err) throw err;
                                                    data.childrenFile = result;
                                                    data.localFolder.id=-7;
                                                    res.render("filePage", {folderData: data})
                                                    res.end()
                                                })
                                            })
                                        }else {
                                            data.found = false;
                                            data.localFolder = {};
                                            data.childrenFolder = [];
                                            data.childrenFile = [];
                                            res.render("filePage", {folderData: data})
                                        }
                                    })


                                }else {
                                    data.found = false;
                                    data.localFolder = {};
                                    data.childrenFolder = [];
                                    data.childrenFile = [];
                                    res.render("filePage", {folderData: data})
                                }
                            })

                        }else {
                            data.found = false;
                            data.localFolder = {};
                            data.childrenFolder = [];
                            data.childrenFile = [];
                            res.render("filePage", {folderData: data})
                        }
                    }
                })
            }
            // else res.redirect('/login');
            else res.render('loginPage');
        })

    }

});



router.get('/:user', (req, res, next) => {
    let Path = req.originalUrl.substr(1);
    let cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.name) {
        res.render('loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, RootID, username FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if(err) throw err;
            let data = {
                userInfo: result[0],
                path:Path
            }
            if (result.length){
                data.found = true;
                connection.query(`SELECT * FROM folder WHERE path ='${Path}' AND Owner_id="${result[0].id}" AND onDelete="0"`,(err, result, field) => {
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
                        data.found = false;
                        data.localFolder = {};
                        data.childrenFolder = [];
                        data.childrenFile = [];
                        res.render("filePage", {folderData: data})
                    }
                })
            }
            // else res.redirect('/login');
            else res.render('loginPage');
        })

    }

});

// function getTreeData(id,tree){
//     connection.query(`SELECT * FROM folder WHERE id ='${id}' AND onDelete="0"`,(err, result, field) => {
//         if(err) throw err;
//         tree=result;
//         connection.query(`SELECT id FROM folder WHERE Owner_id ='${id}' AND onDelete="0"`,(err, result, field) => {
//             if (err) throw err;
//             tree.childrenFolder=result;
//             for (let i = 0; i<tree.childrenFolder.length;i++){
//                 getTreeData(re.childrenFolder[i].id,tree.childrenFolder[i])
//             }
//         })
//
//     })
//     return tree;
// }

//
// router.get('/verify/:code', (req, res, next) => {
//     res.render('filePage');
// });

module.exports = router;




//
// Object.prototype.isEmpty = function() {
//     for(var key in this) {
//         if(this.hasOwnProperty(key))
//             return false;
//     }
//     return true;
// }
// function checkCookie(req,res,next) {
//     let cookies = cookie.parse(req.headers.cookie || '');
//     // console.log(req.headers.cookie);
//     console.log(cookies.name);
//     if (!cookies.name) {
//         res.render('loginPage');
//     }
//     else {
//         connection = res.app.locals.connection;
//         connection.query(`SELECT id, RootID, username FROM account WHERE cookie = "${cookies.name}" `, (err, result, field) => {
//             // console.log(result);
//             if (result.length) {
//                 req.body.user=result[0];
//                 next();
//             }
//             else {
//                 if(req.method=='GET') res.render('loginPage');
//                 else res.send({status:0})
//             }
//         })
//     }
// }


function f() {

}