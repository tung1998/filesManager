const express = require('express');
const router = express.Router();
const cookie = require('cookie');
const path = require('path')
const fs = require('fs');
const formidable = require('formidable');
const mkdirp = require('mkdirp');




router.post('/fileUpload/*', (req, res, next) => {
    let fileUpload = formidable.IncomingForm(),
        files = [];
    let localPath = req.originalUrl.substr(17);
    let UploadPath = path.join(__dirname,"../","public","userFile",localPath);
    // console.log(UploadPath);
    connection = res.app.locals.connection;

    if(!fs.existsSync(UploadPath)) {
        mkdirp(UploadPath,(err)=>{
            if (err) throw err;
        })
        // fs.mkdirSync(UploadPath);
    }
    fileUpload.uploadDir = UploadPath;
    fileUpload
        .on('file', function(field, file) {
            files.push([field, file]);
        })
    // console.log(files)
    let fileData=[];
    fileUpload.parse(req,(err, field, file)=>{
        if(err) throw err;
        let i=0;
        while (i<files.length) {
            let data = file["fileUpload" + i];
            i++;
            connection.query(`SELECT file_id FROM file WHERE file_name ='${data.name}' AND In_folder='${field.OwnerID}'`,(err, result) => {
                if (err) throw err;
                if(result.length==0) {
                    connection.query(`INSERT INTO file (file_name, In_folder, Owner_id, timeUpload) VALUES ('${data.name}', '${field.folderID}','${field.OwnerID}', NOW());`, (err, result, field) => {
                        if (err) throw err;
                        let id=result.insertId;
                        connection.query(`SELECT type FROM file where file_id="${id}";`, (err, result, field) => {
                            if (err) throw err;
                            fileData.push({
                                id:id,
                                type:result[0].type,
                                name:data.name
                            })

                            if(i==files.length){
                                res.send(fileData);
                            }

                        })
                    })

                }

            })
            fs.rename(data.path, UploadPath + "/" + data.name, (err) => {
                if (err) throw err;
            });

        }
    })
});


router.post('/getFileData', (req, res, next) => {
    const idFolder = req.body.id;
    connection = res.app.locals.connection;
        // console.log(idFolder)
    connection.query(`SELECT file_id, file_name,type FROM file WHERE In_folder ='${idFolder}' AND onDelete = '0'`,(err, result, field) => {
        if(err) throw err;
        res.send(result);
        res.end()
    })

});

// router.post('/getFile', (req, res, next) => {
//     const idFile = req.body.id;
//     connection = res.app.locals.connection;
//     // console.log(idFolder)
//     connection.query(`SELECT In_folder,onDelete FROM file WHERE file_id ='${idFile}'`,(err, result, field) => {
//         if(err) throw err;
//         if(!result[0].onDelete){
//             connection.query(`SELECT In_folder,type,onDelete FROM file WHERE file_id ='${idFile}'`,(err, result, field) => {
//                 if (err) throw err;
//
//             })
//             res.send(result);
//         }
//         else res.send(result[0].onDelete)
//     })
// });


router.post('/renameFile', (req, res, next) => {
    const data = req.body;
    console.log(data);
    let Path = path.join(__dirname,"../","public","userFile",data.path);
    console.log(Path)
    connection = res.app.locals.connection;
    connection.query(`SELECT file_name FROM file WHERE file_id='${data.id}';`, (err, result, field) => {
        if(err) throw err;
        console.log(result);
        let oldPath = path.join(Path,result[0].file_name);
        let newPath = path.join(Path,data.fileName)
        console.log(oldPath);
        console.log(newPath);
        fs.rename(oldPath,newPath, (err) => {
            if (err) throw err;
            connection.query(`UPDATE file SET file_name='${data.fileName}' WHERE file_id='${data.id}';`, (err, result, field) => {
                if(err) throw err;
                res.send(true)
                res.end();
            })
        });
    })

});

router.post('/deleteFile', (req,res,next) => {
    connection = res.app.locals.connection;
    connection.query(`UPDATE file SET onDelete='2' WHERE file_id='${req.body.id}';`, (err, result, field) => {
        if(err) throw err;
    })
    res.end();
})


module.exports = router;