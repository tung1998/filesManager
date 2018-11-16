var express = require('express');
var router = express.Router();
const cookie = require('cookie');




router.post('/addNewFolder', (req, res, next) => {
    const data = req.body;
    console.log(data);
    connection = res.app.locals.connection;
    connection.query(`INSERT INTO folder (FolderName, In_folder, path, Owner_id, time_create) VALUES ('${data.FolderName}', '${data.In_folder}', '${data.path}','${data.Owner_id}', NOW());`, (err, result, field) => {
        if(err) throw err;
        res.send("data");
        res.end()
    })
});


router.post('/updateTree', (req, res, next) => {
    const idFolder = req.body.id;
    connection = res.app.locals.connection;
    connection.query(`SELECT id, FolderName FROM folder WHERE In_folder ='${idFolder}'`,(err, result, field) => {
        if(err) throw err;
        res.send(result);
        res.end()
    })
});

router.post('/getFolderData', (req, res, next) => {
    const idFolder = req.body.id;
    connection = res.app.locals.connection;
    connection.query(`SELECT * FROM folder WHERE id ='${idFolder}'`,(err, result, field) => {
        if(err) throw err;
        let data = {
            localFolder: result[0]
        }
        // console.log(idFolder)
        connection.query(`SELECT * FROM folder WHERE In_folder ='${idFolder}'`,(err, result, field) => {
            if(err) throw err;
            data.childrenFolder = result;
            res.send(data);
            res.end()
        })
    })
});




router.post('/renameFolder', (req, res, next) => {
    const data = req.body;
    console.log(data);
    connection = res.app.locals.connection;
    connection.query(`UPDATE folder SET FolderName='${data.FolderName}', path='${data.path}' WHERE id='${data.id}';`, (err, result, field) => {
        if(err) throw err;
        res.send("data");
        res.end()
    })
});


//
// function checkName(id, folderName){
//     connection.query(`SELECT * FROM folder WHERE Owner_id ='${id}';`, (err, result, field) => {
//         if(err) throw err;
//         result.forEach((item)=>{
//             if (item.FolderName == folderName){
//                 return 0;
//             }
//             else return 1;
//         })
//
//     })
// }

module.exports = router;