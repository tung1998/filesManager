var express = require('express');
var router = express.Router();
const cookie = require('cookie');




router.post('/', (req, res, next) => {
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