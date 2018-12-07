var express = require('express');
var router = express.Router();




router.post('/', (req, res, next) => {
    if(req.user){
        connection.query(`SELECT * FROM folder WHERE Owner_id ='${req.user.id}' AND onDelete = '2'`,(err, result, field) => {
            if(err) throw err;
            let data= {
                childrenFolder : result
            }
            connection.query(`SELECT * FROM file WHERE Owner_id ='${req.user.id}' AND onDelete = '2'`,(err, result, field) => {
                if(err) throw err;
                data.childrenFile = result;
                res.send(data);
                res.end();
            })
        })
    }else res.send({status:0})
});




module.exports = router;