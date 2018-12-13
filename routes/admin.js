const express = require('express');
const router = express.Router();
const cookie = require('cookie');
const md5 = require('md5');
const fs = require('fs');
const path =require('path');


router.use('/',checkAdmin)

router.get('/', (req, res, next) => {
    if(req.admin){
        res.redirect(`/admin/${req.admin.username}`);
    }else {
        res.render('adminPage/loginPage');
    }
});

router.get('/*',(req, res, next) => {
    let path = req.originalUrl.substr(7);
    if(req.admin){
        if(path==req.admin.username) res.render('adminPage/adminPage',{userName:req.admin.username})
        else res.redirect(`/admin/${req.admin.username}`);
    }else {
        res.render('adminPage/loginPage');
    }
});


router.post('/userManager/activate', function(req, res, next) {
    if(req.admin){
         let data = req.body;
         if(data.activate){
             connection.query(`UPDATE account SET activate = '1' WHERE id = '${data.id}'`, (err, result, field) => {
                res.send({status:1});
             })
         }else {
             connection.query(`UPDATE account SET activate = '0' WHERE id = '${data.id}'`, (err, result, field) => {
                 res.send({status:1});
             })
         }
    }else res.send({status:0})
})

router.post('/userManager/resetPass', function(req, res, next) {
    if(req.admin){
        let data = req.body;
        let newSalt = md5(Math.random().toString());
        let newPass = md5(data.newPass+newSalt);
        let newCookie = md5(Math.random().toString());
        connection.query(`UPDATE account SET password = '${newPass}',salt='${newSalt}',cookie ='${newCookie}' WHERE id = '${data.id}'`, (err, result, field) => {
            if (err) throw res.send({status:0});
            res.send({status:1});
        })
    }else res.send({status:0})
})

router.post('/userManager/delete', function(req, res, next) {
    if(req.admin){
        let id = req.body.id;
        connection.query(`SELECT codeName FROM file WHERE  Owner_id = '${id}'`, (err, result, field) => {
            if (err) throw err;
            if (result.length){
                result.forEach((item)=>{
                    let Path = path.join(__dirname,"../","public","userFile",item.codeName);
                    fs.unlink(Path, (err) => {
                        if (err) throw err;
                        console.log('was deleted');
                    });
                })
            }
            deleteUser(id, res)
        })
    }else res.send({status:0})
})



router.post('/adminManager/delete', function(req, res, next) {
    if(req.admin){
        let id = req.body.id;
        connection.query(`SELECT * FROM admin WHERE  id = '${id}'`, (err, result, field) => {
            if (err) throw err;
            if(req.admin.level<result[0].level){
                connection.query(`DELETE FROM admin WHERE id = '${id}'`, (err, result, field) => {
                    if (err) throw res.send({status: 0});
                    res.send({status: 1});
                })
            }else res.send({status:0})
        })
    }else res.send({status:0})
})

router.post('/login', function(req, res, next) {
    const data = req.body;
    const loginID = data.id;

    connection = res.app.locals.connection;
    connection.query(`SELECT * FROM admin WHERE  userName = '${loginID}'`, (err, result, field) => {
        if(err) throw err;
        // console.log(pass);
        // console.log(result[0].password);
        if (result.length==0) res.send('0');
        else {
            const pass = md5(data.pass+result[0].salt);
            console.log(pass,result[0].password)
            if (pass == result[0].password) {
                res.setHeader('Set-Cookie', cookie.serialize('admin', result[0].cookie, {
                    httpOnly: true,
                    path:'/',
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                }));
                res.send('2');
            }
            else res.send('3')
        }
    })
});

router.post('/getUserData', function(req, res, next) {
    if(req.admin){
        connection.query(`select account.id as id,activate, username,email,folderCount,fileCount,dataUsed,time_create from account 
                                    left join (select count(*) as folderCount,Owner_id from folder group by Owner_id) as folder
                                     on  account.id = folder.Owner_id 
                                    left join (select count(*) as fileCount, SUM(size) as dataUsed,Owner_id from file group by Owner_id) as file 
                                     on  account.id = file.Owner_id;`, (err, result, field) => {
            if (err) throw err;
            if (result.length) res.send(result);
            else res.send('0');
        })
    }else res.send('0');
});

router.post('/getFileData', function(req, res, next) {
    if(req.admin){
        connection.query(`SELECT * FROM folder WHERE In_folder IS NULL`, (err, result, field) => {
            if (err) throw err;
            if (result.length) res.send(result);
            else res.send('0');
        })
    }else res.send('0');
});

router.post('/getAdminData', function(req, res, next) {
    if(req.admin){
        connection.query(`SELECT * FROM admin`, (err, result, field) => {
            if (err) throw err;
            if (result.length) res.send(result);
            else res.send('0');
        })
    }else res.send('0');
});




router.post('/createAdmin', function(req, res, next) {
    if(req.admin){
        let data = req.body;
        connection.query(`SELECT * FROM admin WHERE username = '${data.username}'`, (err, result, field) => {
            if (err) throw err;
            if (result.length) res.send({status:0});
            else {
                let newSalt = md5(Math.random().toString());
                let newPass = md5(data.pass+newSalt);
                let newCookie = md5(Math.random().toString());
                connection.query(`INSERT INTO admin SET username = '${data.username}',password='${newPass}',salt ='${newSalt}',level ='${req.admin.level+1}',cookie='${newCookie}',fullName ='${data.fullName}',time_create=NOW(),id_create='${req.admin.id}' `, (err, result, field) => {
                    if (err) throw err;
                    res.send({status:1})
                })
            }
        })
    }else res.send({status:0});
});


router.post('/logout',(req,res,next) => {
    console.log('admnlogout')
    res.clearCookie("admin");
    res.send('success');
})

function deleteUser(id,res) {
    connection.query(`DELETE FROM file_share WHERE user_id = '${id}' OR file_id IN(select file_id from file where Owner_id = '${id}')`, (err, result, field) => {
        if (err) throw res.send({status: 0});
        connection.query(`DELETE FROM folder_share WHERE user_id = '${id}' OR id IN(select id from folder where Owner_id ='${id}')`, (err, result, field) => {
            if (err) throw res.send({status: 0});
            console.log("1");
            connection.query(`DELETE FROM file WHERE Owner_id = '${id}'`, (err, result, field) => {
                if (err) throw res.send({status: 0});
                console.log("1");
                connection.query(`DELETE FROM folder WHERE Owner_id = '${id}'`, (err, result, field) => {
                    if (err) throw res.send({status: 0});
                    connection.query(`DELETE FROM account WHERE id = '${id}'`, (err, result, field) => {
                        if (err) throw res.send({status: 0});
                        res.send({status: 1});
                    })
                })
            })
        })
    })
}

function checkAdmin(req,res,next){
    connection = res.app.locals.connection;
    let cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.admin) {
        res.admin=false;
        next();
    }
    else {
        connection.query(`SELECT id,username,level FROM admin WHERE cookie = "${cookies.admin}"`, (err, result, field) => {
            if (err) throw err;
            if(result.length) {
                req.admin=result[0];
                next();
            }else{
                res.admin=false;
                next();
            }
        })
    }
}

module.exports = router;