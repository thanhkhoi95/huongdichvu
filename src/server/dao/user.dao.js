var User = require('./../models/user.model');
var jwt = require('./../services/jwt');
var crypto = require('./../services/crypto');
var administrator = require('./../config/administrator.conf');
var pageConfig = require('./../config/pagination.conf');
var pagination = require('./../services/pagination');

module.exports = {
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers,
    validateUser: validateUser,
    createUser: createUser,
    updateUser: updateUser,
    validateAdmin: validateAdmin,
    deleteUserById: deleteUserById,
    setRoleById: setRoleById
};

function convertUserModelToUserResponse(userModel) {
    var userObj = userModel.toObject();
    delete userObj.password;
    delete userObj.salt;
    return userObj;
}

function validateUser(user, callback) {
    User.findOne({
        email: user.email
    }, function (err, userInDatabase) {
        if (err) {
            callback(err);
        } else if (!userInDatabase) {
            callback({
                'message': 'Wrong email or password',
                statusCode: 400
            });
        } else {
            var password = crypto.hashWithSalt(user.password, userInDatabase.salt);
            if (password !== userInDatabase.password) {
                callback({
                    'message': 'Wrong email or password',
                    statusCode: 400
                });
            } else if (userInDatabase.role === 'banned') {
                callback({
                    statusCode: 401,
                    "message": "This User has been banned"
                });
            } else {
                jwt.sign(convertUserModelToUserResponse(userInDatabase), function (err, token) {
                    if (err) callback(err);
                    else {
                        callback(null, {
                            data: {
                                token: token,
                                user: convertUserModelToUserResponse(userInDatabase)
                            }
                        });
                    }
                });
            }
        }
    });
}

function createUser(user, callback) {
    var userNew = new User();

    var salt = crypto.genSalt();

    userNew.salt = salt;
    userNew.password = crypto.hashWithSalt(user.password, salt);
    userNew.role = 'user';
    userNew.email = user.email;
    userNew.name = user.name;
    userNew.phone = user.phone;

    userNew.save(function (err, response) {
        if (err) callback(err);
        else {
            var userObj = convertUserModelToUserResponse(response);
            callback(null, {
                data: userObj
            });
        }
    })
}

function updateUser(user, callback) {
    console.log(user);
    User.findOne({ 'email': user.email }, function (err, userFromDatabase) {
        if (err) callback(err);
        else if (!userFromDatabase) {
            var err = {
                statusCode: 400,
                "message": "User does not exist"
            };
            callback(err);
        } else {
            userFromDatabase.name = user.name || userFromDatabase.name;
            if (user.password) {
                var salt = crypto.genSalt();
                userFromDatabase.salt = salt;
                userFromDatabase.password = crypto.hashWithSalt(user.password, salt);
            }
            User.update({ 'email': userFromDatabase.email }, {
                "name": userFromDatabase.name,
                "password": userFromDatabase.password,
                "salt": userFromDatabase.salt
            }, function (err, response) {
                if (err) callback(err);
                else callback(null, {
                    data: convertUserModelToUserResponse(userFromDatabase)
                });
            });
        }
    });
}

function getUserByEmail(email, callback) {
    User.findOne({ email: email }, function (err, userFromDatabase) {
        if (err) callback(err);
        else if (!userFromDatabase) {
            var err = {
                statusCode: 400,
                "message": "User does not exist"
            }
        } else {
            callback(null, userFromDatabase);
        }
    });
}

function validateAdmin(user, callback) {
    if (user.email !== administrator.email || user.password !== administrator.password) {
        var err = {
            statusCode: 400,
            "message": "Wrong email or password"
        };
        callback(err);
    } else {
        user.role = 'admin';
        jwt.sign(user, function (err, token) {
            if (err) callback(err);
            else callback(null, {
                data: {
                    token: token
                }
            });
        });
    }
}

function getAllUsers(pageSize, pageIndex, callback) {
    if (pageSize > pageConfig.maxPageSize) {
        var err = {
            statusCode: 400,
            "message": "Page size limtitation exceeded"
        };
        callback(err);
    } else {
        User.count({}, function (err, count) {
            if (err) callback(err);
            else {
                if (pageSize < 0) {
                    pageSize = count;
                    pageIndex = 1;
                }
                User.find({})
                    .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                    .limit(pageSize)
                    .exec(function (err, response) {
                        if (err) callback(err);
                        else {
                            var result = pagination.paging(response, count, pageIndex, pageSize);
                            callback(null, {
                                data: result
                            });
                        }
                    });
            }
        });
    }
}

function deleteUserById(id, callback) {
    User.remove({ _id: id }, function (err, response) {
        if (err) { callback(err) }
        else {
            callback(null, {
                data: response
            });
        }
    });
}

function setRoleById(id, role, callback) {
    User.findOne({ _id: id }, function (err, response) {
        if (err) { callback(err); }
        else if (!response) {
            var err = {
                statusCode: 400,
                "message": "User does not exist"
            };
            callback(err);
        } else {
            User.update({ _id: id }, {
                role: role
            }, function (err, reponse) {
                if (err) { callback(err); }
                else {
                    callback(null, {
                        data: response
                    });
                }
            });
        }
    });
}