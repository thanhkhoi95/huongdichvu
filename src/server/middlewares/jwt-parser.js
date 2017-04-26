var jwt = require('./../services/jwt');
var userDao = require('./../dao/user.dao');

exports.parser = function () {
    var role = Array.prototype.slice.call(arguments);
    return function (req, res, next) {
        var token = req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, function (err, decodedData) {
                if (err) {
                    res.status(401).json({
                        message: 'Invalid User or Token'
                    });
                } else {
                    var email = decodedData.email;
                    if (decodedData.role === 'user' && role.indexOf('user') > -1) {
                        userDao.getUserByEmail(email, function (err, response) {
                            if (err) {
                                res.status(err.statusCode || 500).json({
                                    message: err.message
                                });
                            } else if (!response) {
                                res.status(401).json({
                                    message: 'Invalid user or token'
                                });
                            } else if (req.body.user.email !== response.email) {
                                res.status(550).json({
                                    message: 'Permission denied'
                                });
                            } else {
                                next();
                            }
                        });
                    } else if (decodedData.role === 'admin' && role.indexOf('admin') > -1) {
                        next();
                    } else {
                        res.status(550).json({
                            message: 'Permission denied'
                        });
                    }
                }
            })
        } else {
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
}