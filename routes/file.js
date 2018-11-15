var express = require('express');
var router = express.Router();
const cookie = require('cookie');




router.post('/add', (req, res, next) => {
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
        var data = {
            localFolder: result[0]
        }
        connection.query(`SELECT * FROM folder WHERE In_folder ='${idFolder}'`,(err, result, field) => {
            if(err) throw err;
            data.childrenFolder = result;
            res.send(data);
            res.end()
        })
    })
});


module.exports = router;