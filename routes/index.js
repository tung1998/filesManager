var express = require('express');
var router = express.Router();
const cookie = require('cookie');

const path =require("path");

/* GET home page. */
router.get('/', (req, res, next) => {
    if(req.user){
        res.redirect(`/${req.user.username}`);
    }else res.render('userPage/loginPage');
});

router.get('/:user/*', (req, res, next) => {
    let user = req.params.user;
    let Path = req.originalUrl.substr(1);
    connection = res.app.locals.connection;
    if (req.user) {
        let data = {
            userInfo: req.user,
            path:Path
        }
        connection.query(`SELECT * FROM folder WHERE (path ='${Path}' AND Owner_id="${req.user.id}" AND onDelete='0')`,(err, result, field) => {
            if(err) throw err;
            if(result.length) {
                data.found = true;
                data.localFolder = result[0];
                // console.log(result);
                folderPath(res,data);
            }else {
                if(user=="download") {
                    downloadPath(res,data,Path);
                }else if(user=="shareWithMe") {
                    shareWithMePath(res,data,Path)
                }else falsePath(res,data);
            }
        })
    }
    else {
        res.render('userPage/loginPage');
    }
});



router.get('/:user', (req, res, next) => {
    let Path = req.originalUrl.substr(1);
    connection = res.app.locals.connection;
    if(req.user){
        let data = {
            userInfo: req.user,
            path:Path,
        }
        connection.query(`SELECT * FROM folder WHERE path ='${Path}' AND Owner_id="${req.user.id}" AND onDelete="0"`,(err, result, field) => {
            if(err) throw err;
            if(result.length) {
                data.found = true;
                data.localFolder = result[0];
                folderPath(res,data)

            }else falsePath(res,data);
        })
    }else {
        res.render('userPage/loginPage');
    }
});


function folderPath(res,data) {
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
}


function downloadPath(res,data,Path){
    let codeName = Path.substr(9);
    connection.query(`SELECT file_name FROM file WHERE codeName ='${codeName}' AND Owner_id="${data.userInfo.id}" AND onDelete = '0'`, (err, result, field) => {
        if (err) throw err;
        if(result.length) {
            try {
                res.download(path.join(__dirname, "../", "public", "userFile", codeName), result[0].file_name, function (err) {
                    if (err) falsePath(res,data);
                    else {
                        console.log("download : " + Path);
                    }
                })
            }catch (e) {
                console.log(":)")
            }
        }else falsePath(res,data);
    })
}



function shareWithMePath(res,data,path) {
    let Path = path.substr(12);
    connection.query(`SELECT * FROM folder WHERE path ='${Path}' AND onDelete = '0'`, (err, result, field) => {
        if (err) throw err;
        if(result.length) {
            connection.query(`SELECT * FROM folder_share WHERE id ='${result[0].id}' AND user_id = '${data.userInfo.id}'`, (err, result, field) => {
                if (err) throw err;
                if(result.length) {
                    data.found = true;
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
                }else falsePath(res,data);
            })
        }else falsePath(res,data);
    })
}

function falsePath(res,data){
    data.found = false;
    data.localFolder = {};
    data.childrenFolder = [];
    data.childrenFile = [];
    res.render("filePage", {folderData: data})
}
module.exports = router;


