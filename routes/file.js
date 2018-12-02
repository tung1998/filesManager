const express = require('express');
const router = express.Router();
const cookie = require('cookie');
const path = require('path')
const fs = require('fs');
const formidable = require('formidable');
const md5 = require("md5");




router.post('/fileUpload/*', (req, res, next) => {
    let cookies = cookie.parse(req.headers.cookie || '');
    let fileUpload = formidable.IncomingForm(),
        files = [];
    let UploadPath = path.join(__dirname,"../","public","userFile");
    // console.log(UploadPath);
    connection = res.app.locals.connection;
    if (!cookies.name) {
        res.send({status:0})
    }
    else {
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if (err) throw err;
            if(result.length){
                let idUser=result[0].id;
                fileUpload.uploadDir = UploadPath;
                fileUpload
                    .on('file', function(field, file) {
                        files.push([field, file]);
                    })
                // console.log(files)
                let uploadData={
                    status:1,
                    fileUpload:[]
                };
                fileUpload.parse(req,(err, field, file)=>{
                    if(err) throw err;
                    let length =files.length
                    // console.log(length);
                    for(let i=0;i<length;i++){
                        let data = file["fileUpload" + i];
                        // console.log(data);
                        let fileName = data.name;
                        connection.query(`INSERT INTO file (file_name, In_folder, Owner_id, timeUpload) VALUES ('${fileName}', '${field.folderID}','${idUser}', NOW());`, (err, result, field) => {
                            if (err) throw err;
                            let id=result.insertId;
                            let obj={
                                id:id,
                                file_name:data.name
                            };
                            connection.query(`UPDATE file set codeName="${md5(id)}" where file_id="${id}";`, (err, result, field) => {
                                if (err) throw err;
                            })
                            connection.query(`SELECT type FROM file where file_id="${id}";`, (err, result, field) => {
                                if (err) throw err;
                                obj.type=result[0].type;
                                fs.rename(data.path, UploadPath + "/" + md5(id), (err) => {
                                    if (err) throw err;
                                    // console.log(obj);
                                    uploadData.fileUpload.push(obj);
                                    // console.log(i);
                                    if(i+1==length){
                                        res.send(uploadData);
                                        res.end();
                                    }
                                });

                            })
                        })
                    }
                })
            }else res.send({status: 0})

        })
    }
});


router.post('/getFileData', (req, res, next) => {
    const idFolder = req.body.id;
    connection = res.app.locals.connection;
        // console.log(idFolder)
    connection.query(`SELECT * FROM file WHERE In_folder ='${idFolder}' AND onDelete = '0'`,(err, result, field) => {
        if(err) throw err;
        res.send(result);
        res.end()
    })

});





router.post('/renameFile', (req, res, next) => {
    const data = req.body;
    connection = res.app.locals.connection;
    connection.query(`UPDATE file SET file_name='${data.fileName}' WHERE file_id='${data.id}';`, (err, result, field) => {
        if(err) throw err;
        res.send(true)
        res.end();
    })

});

router.post('/deleteFile', (req,res,next) => {
    connection = res.app.locals.connection;
    connection.query(`UPDATE file SET onDelete='2' WHERE file_id='${req.body.id}';`, (err, result, field) => {
        if(err) throw err;
    })
    res.end();
})


router.post('/openRecent', (req, res, next) => {
    // console.log(req.headers.cookie);
    let id =  req.body.userID;
    connection.query(`SELECT * FROM file WHERE Owner_id ='${id}' AND DATEDIFF( NOW(), timeOpenRecent)<1`,(err, result, field) => {
        if(err) throw err;
        res.send(result);
        res.end();
    })
});

router.post('/restoreFile', (req,res,next) => {
    connection = res.app.locals.connection;
    connection.query(`UPDATE file SET onDelete='0' WHERE file_id='${req.body.id}';`, (err, result, field) => {
        if(err) throw err;
    })
    res.end();
})

router.post('/deleteFile', (req,res,next) => {
    connection = res.app.locals.connection;
    connection.query(`UPDATE file SET onDelete='2' WHERE file_id='${req.body.id}';`, (err, result, field) => {
        if(err) throw err;
    })
    res.end();
})



router.post('/getCodeName', (req,res,next) => {
    let id =req.body.id;
    connection = res.app.locals.connection;
    connection.query(`UPDATE file set timeOpenRecent =NOW() WHERE file_id='${id}';`, (err, result, field) => {
        if(err) throw err;
        connection.query(`SELECT codeName FROM file WHERE file_id='${id}';`, (err, result, field) => {
            if (err) throw err;
            console.log(result[0].codeName);
            res.send({code: result[0].codeName})
            res.end();
        })
    })
})
router.post('/getTxtData', (req,res,next) => {
    let id =req.body.id;
    let Path =path.join(__dirname,"../","public","userFile",id);
    fs.readFile(Path, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        // console.log(data);
        data=data.split("\n");
        res.send(data);
        res.end();
    });
})


router.post('/addToLove', (req,res,next) => {
    connection = res.app.locals.connection;
    connection.query(`SELECT onLove FROM file WHERE file_id='${req.body.id}';`, (err, result, field) => {
        if (err) throw err;
        if(result[0].onLove==0) {
            connection.query(`UPDATE file SET onLove='1' WHERE file_id='${req.body.id}';`, (err, result, field) => {
                if (err) throw err;
                res.send(true)
                res.end();
            })
        }else {
            connection.query(`UPDATE file SET onLove='0' WHERE file_id='${req.body.id}';`, (err, result, field) => {
                if (err) throw err;
                res.send(false)
                res.end();
            })
        }
    })

    //
})

function checkInforCookie(cookie){
    if(cookie){
        connection.query(`SELECT * FROM account  WHERE cookie='${cookie}' AND activate = "1";`, (err, result, field) => {
            if (err) throw err;
            if(result.length) return result;
        })
    }else return false;
}




module.exports = router;