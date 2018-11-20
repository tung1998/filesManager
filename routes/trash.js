var express = require('express');
var router = express.Router();
const cookie = require('cookie');


router.get('/:user', (req, res, next) => {

    var cookies = cookie.parse(req.headers.cookie || '');
    // console.log(req.headers.cookie);
    // console.log(cookies.name);
    if (!cookies.name) {
        res.redirect('/login');
    }
    else {
        connection = res.app.locals.connection;
        connection.query(`SELECT RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
            if(err) throw err;
            var data = {
                userInfo: result[0]
            }
            if (result.length){
                connection.query(`SELECT * FROM folder WHERE id ='${result[0].RootID}'`,(err, result, field) => {
                    if(err) throw err;
                    data.localFolder = result[0];
                    // console.log(result);
                    connection.query(`SELECT * FROM folder WHERE In_folder ='${data.localFolder.id}' AND onDelete = '2'`,(err, result, field) => {
                        if(err) throw err;
                        data.childrenFolder = result;
                        connection.query(`SELECT * FROM file WHERE onDelete = '2'`,(err, result, field) => {
                            if(err) throw err;
                            data.childrenFile = result;
                            console.log(result)
                            res.render('filePage',{folderData:data});
                            res.end();
                        })
                    })
                })
            }
            else res.redirect('/login');
        })

    }

});


router.post('/:user', (req, res, next) => {
    // console.log(req.headers.cookie);
    let id =  req.body.userID;
    console.log(id)
    // console.log(cookies.name);
    connection.query(`SELECT * FROM folder WHERE Owner_id ='${id}' AND onDelete = '2'`,(err, result, field) => {
        if(err) throw err;
        let data= {
            childrenFolder : result
        }
        connection.query(`SELECT * FROM file WHERE Owner_id ='${id}' AND onDelete = '2'`,(err, result, field) => {
            if(err) throw err;
            data.childrenFile = result;
            res.send(data);
            res.end();
        })
    })
});




module.exports = router;