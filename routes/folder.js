var express = require('express');
var router = express.Router();
const cookie = require('cookie');




router.post('/addNewFolder', (req, res, next) => {
    let data = req.body;
    // console.log(data);
    connection = res.app.locals.connection;
    connection.query(`INSERT INTO folder (FolderName, In_folder, path, Owner_id, time_create) VALUES ('${data.FolderName}', '${data.In_folder}', '${data.path}','${data.Owner_id}', NOW());`, (err, result, field) => {
        if(err) throw err;
        data.id = result.insertId;
        res.send(data);
        res.end();
    })
});


router.post('/updateTree', (req, res, next) => {
    const idFolder = req.body.id;
    connection = res.app.locals.connection;
    connection.query(`SELECT id, FolderName FROM folder WHERE In_folder ='${idFolder}' AND onDelete = '0'`,(err, result, field) => {
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
        if(result[0].onDelete==0) {
            let data = {
                localFolder: result[0]
            }
            // console.log(idFolder)
            connection.query(`SELECT * FROM folder WHERE In_folder ='${idFolder}' AND onDelete = '0'`, (err, result, field) => {
                if (err) throw err;
                data.childrenFolder = result;
                res.send(data);
                res.end()
            })
        }else res.send('0');
    })
});



router.post('/trash', (req, res, next) => {
    connection = res.app.locals.connection;
    connection.query(`SELECT * FROM folder WHERE onDelete ='1'`,(err, result, field) => {
        res.send(result);
        res.end()
    })
});




router.post('/renameFolder', (req, res, next) => {
    const data = req.body;
    console.log(data);
    connection = res.app.locals.connection;
    connection.query(`UPDATE folder SET FolderName='${data.FolderName}' WHERE id='${data.id}';`, (err, result, field) => {
        if(err) throw err;
    })
    renameFolder(data,data.path);
    res.send(true)
    res.end();
});

router.post('/deleteFolder', (req,res,next) => {
    connection = res.app.locals.connection;
    deleteFolder(req.body.id);
    //
    res.send(true)
    res.end();
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