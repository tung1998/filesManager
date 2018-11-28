var express = require('express');
var router = express.Router();
const cookie = require('cookie');


// router.get('/:user', (req, res, next) => {
//
//     var cookies = cookie.parse(req.headers.cookie || '');
//     // console.log(req.headers.cookie);
//     // console.log(cookies.name);
//     if (!cookies.name) {
//         res.render('loginPage');
//     }
//     else {
//         connection = res.app.locals.connection;
//         connection.query(`SELECT RootID, userName FROM account WHERE cookie = "${cookies.name}" AND activate ='1'`, (err, result, field) => {
//             if(err) throw err;
//             var data = {
//                 userInfo: result[0]
//             }
//             if (result.length){
//                 connection.query(`SELECT * FROM folder WHERE id ='${result[0].RootID}'`,(err, result, field) => {
//                     if(err) throw err;
//                     data.localFolder = result[0];
//                     // console.log(result);
//                     connection.query(`SELECT * FROM folder WHERE onLove = '1'`,(err, result, field) => {
//                         if(err) throw err;
//                         data.localFolder.id='-1';
//                         data.childrenFolder = result;
//                         connection.query(`SELECT * FROM file WHERE onLove = '1'`,(err, result, field) => {
//                             if(err) throw err;
//                             data.childrenFile = result;
//                             console.log(result)
//                             res.render('filePage',{folderData:data});
//                             res.end();
//                         })
//                     })
//                 })
//             }
//             else res.render('loginPage');
//         })
//
//     }
//
// });


router.post('/', (req, res, next) => {
    // console.log(req.headers.cookie);
    let id =  req.body.userID;
    console.log(id)
    // console.log(cookies.name);
    connection.query(`SELECT * FROM folder WHERE Owner_id ='${id}' AND onLove = '1' AND onDelete = '0'`,(err, result, field) => {
        if(err) throw err;
        let data= {
            childrenFolder : result
        }
        connection.query(`SELECT * FROM file WHERE Owner_id ='${id}' AND onLove = '1' AND onDelete = '0'`,(err, result, field) => {
            if(err) throw err;
            data.childrenFile = result;
            res.send(data);
            res.end();
        })
    })
});




module.exports = router;