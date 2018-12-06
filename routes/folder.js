var express = require('express');
var router = express.Router();
const cookie = require('cookie');




router.post('/addNewFolder', (req, res, next) => {
    let data = req.body;
    // console.log(data);
    let cookies = cookie.parse(req.headers.cookie || '');
    connection = res.app.locals.connection;
    if (!cookies.name) {
        // console.log("1234")
        res.send({status:0})
    }
    else {
        // console.log("123");
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                connection.query(`INSERT INTO folder (FolderName, In_folder, path, Owner_id, time_create) VALUES ('${data.FolderName}', '${data.In_folder}', '${data.path}','${result[0].id}', NOW());`, (err, result, field) => {
                    if (err) throw err;
                    data.id = result.insertId;
                    data.size = 0;
                    let date = new Date();
                    data.time_create = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                    res.send(data);
                    res.end();
                })
            }else res.send({status:0});
        })
    }
});


// router.post('/updateTree', (req, res, next) => {
//     const idFolder = req.body.id;
//     connection = res.app.locals.connection;
//     connection.query(`SELECT id, FolderName FROM folder WHERE In_folder ='${idFolder}' AND onDelete = '0'`,(err, result, field) => {
//         if(err) throw err;
//         res.send(result);
//         res.end()
//     })
// });

router.post('/getTreeData', (req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '');
    // console.log(path,idFolder);
    connection = res.app.locals.connection;
    if (!cookies.name) {
        res.send({status:0})
    }
    else {
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                connection.query(`SELECT id,FolderName,In_folder FROM folder WHERE Owner_id="${result[0].id}" AND onDelete='0' `, (err, result, field) => {
                    if (err) throw err;
                    if (result.length){
                        res.send(result);
                    }else res.send('0')
                })
            }else res.send("0");
        })
    }
});


router.post('/getFolderData', (req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '');
    let idFolder = req.body.id;
    let path = req.body.path;
    // console.log(path,idFolder);
    connection = res.app.locals.connection;
    if (!cookies.name) {
        res.send({status:0})
    }
    else {
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                connection.query(`SELECT * FROM folder WHERE id ='${idFolder}' AND Owner_id="${result[0].id}" OR path ='${path}' `, (err, result, field) => {
                    if (err) throw err;
                    if (result.length){
                        if (result[0].onDelete == 0) {
                            let data = {
                                localFolder: result[0]
                            }
                            // console.log(idFolder)
                            connection.query(`SELECT * FROM folder WHERE In_folder ='${data.localFolder.id}' AND onDelete = '0'`, (err, result, field) => {
                                if (err) throw err;
                                data.childrenFolder = result;
                                res.send(data);
                                res.end()
                            })
                        } else res.send('0');
                    }else res.send('1')
                })
            }else res.send("0");
        })
    }
});





router.post('/renameFolder', (req, res, next) => {
    const data = req.body;
    let cookies = cookie.parse(req.headers.cookie || '');
    connection = res.app.locals.connection;
    if (!cookies.name) {
        // console.log("1234")
        res.send({status:0})
    }
    else {
        // console.log("123");
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                connection.query(`UPDATE folder SET FolderName='${data.FolderName}' WHERE id='${data.id}';`, (err, result, field) => {
                    if (err) throw err;
                })
                renameFolder(data, data.path);
                res.send({status:1});
                res.end();
            }else res.send({status:0});
        })
    }
});

router.post('/deleteFolder', (req,res,next) => {
    let cookies = cookie.parse(req.headers.cookie || '');
    connection = res.app.locals.connection;
    if (!cookies.name) {
        // console.log("1234")
        res.send({status:0})
    }
    else {
        // console.log("123");
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                deleteFolder(req.body.id);
                res.send({status:1})
                res.end();
            }else res.send({status:0});
        })
    }
    //
})

router.post('/restoreFolder', (req,res,next) => {
    connection = res.app.locals.connection;
    restoreFolder(req.body.id);
    //
    res.send(true)
    res.end();
    //
})
router.post('/addToLove', (req,res,next) => {
    connection = res.app.locals.connection;
    connection.query(`SELECT onLove FROM folder WHERE id='${req.body.id}';`, (err, result, field) => {
        if (err) throw err;
        if(result[0].onLove==0) {
            connection.query(`UPDATE folder SET onLove='1' WHERE id='${req.body.id}';`, (err, result, field) => {
                if (err) throw err;
                res.send(true)
                res.end();
            })
        }else {
            connection.query(`UPDATE folder SET onLove='0' WHERE id='${req.body.id}';`, (err, result, field) => {
                if (err) throw err;
                res.send(false)
                res.end();
            })
        }
    })

    //
})

function renameFolder(data,path){
    let newPath = path+"/"+data.FolderName;
    connection.query(`UPDATE folder SET path='${newPath}' WHERE id='${data.id}';`, (err, result, field) => {
        if(err) throw err;
        connection.query(`SELECT id,FolderName,path FROM folder WHERE In_folder='${data.id}';`, (err, result, field) => {
            if(err) throw err;
            result.forEach((item) => {
                console.log(item)
                renameFolder(item,newPath)
            })

        })
    })

}

function deleteFolder(id, lv = 0){
    connection.query(`SELECT id FROM folder WHERE In_folder='${id}';`, (err, result, field) => {
        if(err) throw err;
        result.forEach((item) => {
            deleteFolder(item.id, lv+1)
        })

        if(lv == 0){
            connection.query(`UPDATE folder SET onDelete='2' WHERE id='${id}';`, (err, result, field) => {
                if(err) throw err;
            })
        }else {
            connection.query(`UPDATE folder SET onDelete='1' WHERE id='${id}';`, (err, result, field) => {
                if(err) throw err;
            })
        }
    })
    connection.query(`UPDATE file SET onDelete='1' WHERE In_folder='${id}';`, (err, result, field) => {
        if(err) throw err;
    })
}

function restoreFolder(id){
    connection.query(`SELECT id FROM folder WHERE In_folder='${id}';`, (err, result, field) => {
        if(err) throw err;
        result.forEach((item) => {
            restoreFolder(item.id)
        })
        connection.query(`UPDATE folder SET onDelete='0' WHERE id='${id}';`, (err, result, field) => {
            if(err) throw err;
        })
    })
    connection.query(`UPDATE file SET onDelete='0' WHERE In_folder='${id}';`, (err, result, field) => {
        if(err) throw err;
    })
}
module.exports = router;