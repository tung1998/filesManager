var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const path = require('path');
const fs = require("fs");

router.post('/', (req, res, next) => {
    let idFile =req.body.id;
    let cookies = cookie.parse(req.headers.cookie || '');
    console.log(idFile);
    if (!cookies.name) {
        res.end();
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if(err) throw err;
            if (result.length){
                connection.query(`SELECT file_name,In_folder FROM file WHERE file_id ="${idFile}" and onDelete ="0"`,(err, result, field) => {
                    if (err) throw err;
                    let Owner_id =result[0].In_folder;
                    let fileName = result[0].file_name;
                    if(result.length) {
                        connection.query(`SELECT path FROM folder WHERE id ="${Owner_id}"`, (err, result, field) => {
                            if (err) throw err;
                            let Path=result[0].path;
                            let downloadPath = path.join("/",Path,fileName);
                            console.log(downloadPath);
                            res.send({path:downloadPath});
                        })

                    }else res.send(false)
                })
            }
        })

    }

});

//
//
// router.get('/', (req, res, next) => {
//     let path="D:\\data\\filesManager\\public\\userFile\\tung16021221\\mp3\\CHẠY NGAY ĐI (ONIONN REMIX)- RUN NOW (ONIONN REMIX) - SƠN TÙNG M-TP - Official Music Video.mp3";
//     res.download(path);
// })
//

module.exports = router;