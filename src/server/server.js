var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

var dbConfig = require('./config/db.conf');
var serverConfig = require('./config/server.conf');
var errorHandler = require('./middlewares/error-handler');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

//Routers
var houseRouter = require('./routes/house.routes');
var locationRouter = require('./routes/location.routes');
var userRouter = require('./routes/user.routes');
var feedbackRouter = require('./routes/feedback.routes');

app.use('/house', houseRouter());
app.use('/location', locationRouter());
app.use('/user', userRouter());
app.use('/feedback', feedbackRouter());

app.use(errorHandler.errorHandler());

app.listen(serverConfig.PORT);

console.log("Server is listening on port " + serverConfig.PORT);