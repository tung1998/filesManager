var express = require('express');
var router = express.Router();
const cookie = require('cookie');




router.post('/addNewFolder', (req, res, next) => {
    let data = req.body;
    // console.log(data);
    connection = res.app.locals.connection;
    if(req.user){
        connection.query(`INSERT INTO folder (FolderName, In_folder, path, Owner_id, time_create) VALUES ('${data.FolderName}', '${data.In_folder}', '${data.path}','${req.user.id}', NOW());`, (err, result, field) => {
            if (err) throw err;
            data.id = result.insertId;
            data.size = 0;
            let date = new Date();
            data.time_create = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            res.send(data);
            res.end();
        })
    }else res.send({status:0});
});


router.post('/getTreeData', (req, res, next) => {
    // console.log(path,idFolder);
    connection = res.app.locals.connection;
    if(req.user){
        connection.query(`SELECT id,FolderName,In_folder FROM folder WHERE Owner_id="${req.user.id}" AND onDelete='0' `, (err, result, field) => {
            if (err) throw err;
            if (result.length){
                res.send(result);
            }else res.send('0')
        })
    }else res.send("0");
});


router.post('/getFolderData', (req, res, next) => {
    let idFolder = req.body.id;
    let path = req.body.path;
    connection = res.app.locals.connection;
    if(req.user){
        connection.query(`SELECT * FROM folder WHERE id ='${idFolder}' AND Owner_id="${req.user.id}" OR path ='${path}' `, (err, result, field) => {
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
});





router.post('/renameFolder', (req, res, next) => {
    const data = req.body;
    connection = res.app.locals.connection;
    if(req.user){
        connection.query(`SELECT * FROM folder WHERE id='${data.id}' AND Owner_id = '${req.user.id}';`, (err, result, field) => {
            if (err) throw err;
            if(result.length) {
                connection.query(`UPDATE folder SET FolderName='${data.FolderName}' WHERE id='${data.id}';`, (err, result, field) => {
                    if (err) throw err;
                })
                renameFolder(data, data.path);
                res.send({status: 1});
                res.end();
            }else res.send({status:0});
        })
    }else res.send({status:0});
});



router.post('/deleteFolder', (req,res,next) => {
    if(req.user){
        connection.query(`SELECT * FROM folder WHERE id='${req.body.id}' AND Owner_id = '${req.user.id}';`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                deleteFolder(req.body.id);
                res.send({status: 1})
                res.end();
            }else res.send({status:0});
        })
    }else res.send({status:0});
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
    if(req.user){
        connection.query(`SELECT * FROM folder WHERE id='${req.body.id}' AND Owner_id = '${req.user.id}';`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
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
            }
        })
    }
})

router.post('/cutFolder', (req,res,next) => {
    if(req.user){
        let data = req.body;
        connection.query(`UPDATE folder SET In_folder='${data.pasteId}' WHERE id='${data.cutFolderId}';`, (err, result, field) => {
            if (err) throw err;

            connection.query(`SELECT * FROM folder WHERE id='${data.cutFolderId}';`, (err, result, field) => {
                if (err) throw err;
                if (result.length) {
                    let name =result[0].FolderName;
                    connection.query(`SELECT * FROM folder WHERE id='${data.pasteId}';`, (err, result, field) => {
                        if (err) throw err;
                        if (result.length) {
                            let path = result[0].path;
                            updatePath(data.cutFolderId,path,name)
                        }else res.send({status: 0})

                    })
                } else res.send({status: 0})
                res.send(result[0])
                res.end();
            })

        })
    }else res.send({status:0})
})

router.post('/copyFolder', (req,res,next) => {
    if(req.user){
        let data = req.body;
        console.log(data);
        connection.query(`SELECT FolderName,path,Owner_id,size,time_create FROM folder WHERE id='${data.pasteId}';`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                copyFolder(data.copyFolderId,data.pasteId,result[0].path)
            }
        })
    }else res.send({status:0})
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


function updatePath(id,path,name){
    let newPath =path+"/"+name;
    connection.query(`UPDATE folder SET path='${newPath}' WHERE id='${id}';`, (err, result, field) => {
        if (err) throw err;
    })
    connection.query(`SELECT * FROM folder WHERE In_folder='${id}';`, (err, result, field) => {
        if (err) throw err;
        if (result.length) {
            result.forEach( (item)=> {
                updatePath(item.id,newPath,item.FolderName);
            })
        }
    })
}


function copyFolder(copyFolderId,pasteId,path){
    console.log(copyFolderId,pasteId,path)
    connection.query(`SELECT FolderName,size,Owner_id,time_create FROM folder WHERE id='${copyFolderId}';`, (err, result, field) => {
        if (err) throw err;
        let newData =result[0];
        newData.path=path+"/"+newData.FolderName;
        newData.In_folder=pasteId;
        connection.query(`INSERT INTO folder SET ?`,newData, (err, result, field) => {
            if (err) throw err;
            let newid =result.insertId;
            connection.query(`SELECT * FROM folder WHERE In_folder='${copyFolderId}';`, (err, result, field) => {
                result.forEach((item)=>{
                    copyFolder(item.id,newid,newData.path)
                })
            })
            connection.query(`SELECT file_name,type,timeUpload,Owner_id,codeName,size FROM file WHERE In_folder='${copyFolderId}';`, (err, result, field) => {
                if (err) throw err;
                result.forEach((item)=>{
                    let newFileData=item;
                    newFileData.In_folder=newid;
                    connection.query(`INSERT INTO file SET ?`,newFileData, (err, result, field) => {
                        if (err) throw err;
                    })
                })
            })
        })
    })
}
module.exports = router;