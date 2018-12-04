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
        res.render('userPage/loginPage');
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
                connection.query(`SELECT * FROM file WHERE codeName ='${name}'`,(err, result, field) => {
                    if(err) throw err;

                    if(result.length) {
                        if(result[0].Owner_id == data.userInfo.id){
                            res.render("pdfPage",{name:name})
                        }
                        else {
                            connection.query(`SELECT * FROM file_share WHERE file_id ='${result[0].file_id}' AND user_id="${data.userInfo.id}"`,(err, result, field) => {
                                if (err) throw err;
                                console.log();
                                if (result.length) {
                                    res.render("pdfPage",{name:name})
                                }else {
                                    data.found = false;
                                    data.localFolder = {};
                                    data.childrenFolder = [];
                                    data.childrenFile = [];
                                    res.render("filePage", {folderData: data})
                                }
                            })
                        }
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
            else res.render('userPage/loginPage');
        })

    }

});

module.exports = router;