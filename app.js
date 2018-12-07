const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookie = require('cookie');
const logger = require('morgan');
const bodyParser = require('body-parser');



//router
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const recoverpwRouter = require('./routes/recoverpw');
const resendconfirmmailRouter = require('./routes/resendconfirmmail');
const folderRouter = require('./routes/folder');
const fileRouter = require('./routes/file');
const trashRouter = require('./routes/trash');
const loveRouter = require('./routes/love');
const shareRouter = require('./routes/share');
const pdfRouter = require('./routes/pdf');
const adminRouter = require('./routes/admin');


const app = express();


//mysql
const mysql      = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'filesmanager'
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//other setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//connect mysql
connection.connect((err) => {
    app.locals.connection = connection;
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    app.use('/admin', adminRouter);
    app.use(checkUser);

    app.use('/trash', trashRouter);
    app.use('/love', loveRouter);
    app.use('/users', usersRouter);
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);
    app.use('/resendconfirmmail', resendconfirmmailRouter);
    app.use('/recoverpw', recoverpwRouter);
    app.use('/folder', folderRouter);
    app.use('/file', fileRouter);
    app.use('/share', shareRouter);
    app.use('/pdf', pdfRouter);
    app.use('/', indexRouter);


    // catch 404 and forward to error handler
    app.use( (req, res, next) => {
        next(createError(404));
    });

    // error handler
    app.use((err, req, res, next) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error/error');
    });

});



function checkUser(req,res,next){
    let cookies = cookie.parse(req.headers.cookie || '');
    if (!cookies.name) {
        req.user=false;
        next();
    }
    else {
        connection.query(`SELECT id, RootID, username FROM account WHERE cookie = "${cookies.name}"AND activate="1"`, (err, result, field) => {
            // console.log(result);
            if (result.length){
                req.user = result[0];
                next();
            }
            else{
                req.user=false;
                next();
            }
        })
    }
}

module.exports = app;

