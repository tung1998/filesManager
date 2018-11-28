var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const path = require('path');
const fs = require("fs");

router.get('/:name', (req, res, next) => {
    let Path = req.originalUrl.substr(1);
    let name =req.params.name;
    let cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    // console.log(cookies.name);
    if (!cookies.name) {
        // res.redirect('/login');
        res.render('loginPage');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT id, RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if(err) throw err;
            let data = {
                userInfo: result[0],
                path:Path
            }
            if (result.length){
                data.found = true;
                connection.query(`SELECT * FROM file WHERE codeName ='${name}' AND Owner_id="${result[0].id}"`,(err, result, field) => {
                    if(err) throw err;
                    if(result.length) {
                        res.render("pdfPage",{name:name})
                    }else {
                        data.found = false;
                        data.localFolder = {};
                        data.childrenFolder = [];
                        data.childrenFile = [];
                        res.render("filePage", {folderData: data})
                    }
                        // console.log(result);
                })
            }
            // else res.redirect('/login');
            else res.render('loginPage');
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