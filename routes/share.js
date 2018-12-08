var express = require('express');
var router = express.Router();
const cookie = require('cookie');






//status =0 no cookie
//status =1 no found cookie
//status =2 success
//status =3 no found folder
//status =4 no found account
router.post("/shareFolder",(req,res,next)=>{
    let idFolder = req.body.idFolder;
    let shareUser = req.body.shareUser;
    if(req.user){
        connection = res.app.locals.connection;
        connection.query(`SELECT * FROM folder WHERE id = "${idFolder}" AND Owner_id="${req.user.id}"`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                connection.query(`SELECT id FROM account where  username='${shareUser}' OR email='${shareUser}'`, (err, result, field) => {
                    if (err) throw err;
                    if(result.length){
                        let user_id = result[0].id;
                        shareFolder(idFolder,user_id);
                        res.send({status:2})
                    }else res.send({status:4});
                })
            }else res.send({status:3});
        })
    }else res.send({status:1})
})

router.post("/shareFile",(req,res,next)=>{
    let idFile = req.body.idFile;
    let shareUser = req.body.shareUser;
    if(req.user){
        connection = res.app.locals.connection;
        connection.query(`SELECT * FROM file WHERE file_id = "${idFile}" AND Owner_id="${req.user.id}"`, (err, result, field) => {
            if (err) throw err;
            if (result.length) {
                connection.query(`SELECT id FROM account where  username='${shareUser}' OR email='${shareUser}'`, (err, result, field) => {
                    if (err) throw err;
                    if(result.length){
                        let user_id = result[0].id;
                        shareFile(idFile,user_id);
                        res.send({status:2})
                    }else res.send({status:4});

                })
            }else res.send({status:3});
        })
    }else res.send({status:1})
})



router.post("/getFolderData",(req,res,next)=>{
    let idFolder = req.body.id;
    let path = req.body.path;
    // console.log(path,idFolder);
    connection = res.app.locals.connection;
    if(req.user){
        let user =req.user;
        connection.query(`SELECT * FROM folder WHERE id ='${idFolder}' OR path ='${path}' `, (err, result, field) => {
            if (err) throw err;
            if (result.length){
                console.log(idFolder,path)
                if (result[0].onDelete == 0) {
                    let data = {
                        localFolder: result[0]
                    }
                    connection.query(`SELECT * FROM folder_share WHERE id ='${data.localFolder.id}' AND user_id ='${user.id}' `, (err, result, field) => {
                        if (err) throw err;
                        console.log(idFolder,user.id)
                        if (result.length) {
                            connection.query(`SELECT * FROM folder WHERE In_folder ='${data.localFolder.id}' AND onDelete = '0'`, (err, result, field) => {
                                if (err) throw err;
                                data.childrenFolder = result;
                                connection.query(`SELECT * FROM file WHERE In_folder ='${data.localFolder.id}' AND onDelete = '0'`, (err, result, field) => {
                                    if (err) throw err;
                                    data.childrenFile = result;
                                    data.localFolder.id=-7;
                                    res.send(data);
                                    res.end()
                                })
                            })
                        }else (res.send('3'))
                    })
                } else res.send('2');
            }else res.send('1')
        })
    }else res.send("0");
});



router.post("/getShare",(req,res,next)=>{
    if(req.user){
        let id=req.user.id;
        connection.query(`SELECT * FROM folder WHERE id IN (SELECT id FROM folder_share WHERE user_id ="${id}" AND rootShare="1")  AND onDelete = '0'`,(err, result, field) => {
            if (err) throw err;
            let data = {
                childrenFolder: result
            }
            connection.query(`SELECT * FROM file WHERE file_id IN (SELECT file_id from file_share WHERE user_id='${id}' AND rootShare="1") AND onDelete = '0'`, (err, result, field) => {
                if (err) throw err;
                data.childrenFile = result;
                res.send(data);
                res.end();
            })
        })
    }else res.send({status:1})
})




function shareFolder(idFolder,idUser,level=0){
    connection.query(`SELECT * FROM folder_share where  id='${idFolder}' AND user_id='${idUser}'`, (err, result, field) => {
        if (err) throw err;
        if (result.length==0){
            if(level==0){
                connection.query(`INSERT INTO folder_share SET id = '${idFolder}',user_id="${idUser}",rootShare='1' `, (err, result, field) => {
                    if (err) throw err;
                })
            }else {
                connection.query(`INSERT INTO folder_share SET id = '${idFolder}',user_id= "${idUser}"`, (err, result, field) => {
                    if (err) throw err;
                })
            }
            connection.query(`UPDATE folder SET onShare="1" WHERE id = "${idFolder}"`, (err, result, field) => {
                if (err) throw err;
            })

        }
    })
    connection.query(`SELECT * FROM folder WHERE In_folder='${idFolder}'`, (err, result, field) => {
        if (err) throw err;
        result.forEach(function (item) {
            shareFolder(item.id,idUser,level+1)
        })
    })
    connection.query(`SELECT * FROM file WHERE In_folder='${idFolder}'`, (err, result, field) => {
        if (err) throw err;
        result.forEach(function (item) {
            connection.query(`SELECT * FROM file_share where file_id='${item.file_id}' AND user_id='${idUser}'`, (err, result, field) => {
                if (err) throw err;
                if (result.length==0){
                    connection.query(`INSERT INTO file_share SET file_id = '${item.file_id}',user_id= "${idUser}"`, (err, result, field) => {
                        if (err) throw err;
                    })
                    connection.query(`UPDATE file SET onShare="1" WHERE file_id = "${item.file_id}"`, (err, result, field) => {
                        if (err) throw err;
                    })
                }
            })
        })
    })

}


function shareFile(idFile,idUser){
    connection.query(`SELECT * FROM file_share where  file_id='${idFile}' AND user_id='${idUser}'`, (err, result, field) => {
        if (err) throw err;
        if (result.length==0){
            connection.query(`INSERT INTO file_share SET file_id = '${idFile}',user_id= "${idUser}" ,rootShare="1"`, (err, result, field) => {
                if (err) throw err;
            })
            connection.query(`UPDATE file SET onShare="1" WHERE file_id = "${idFile}"`, (err, result, field) => {
                if (err) throw err;
            })
        }else {
            if(result[0].rootShare==0){
                connection.query(`UPDATE folder_share SET rootShare="1" WHERE file_id="${idFile}" AND user_id="${idUser}"`, (err, result, field) => {
                    if (err) throw err;
                })
            }
        }
    })
}


module.exports = router;