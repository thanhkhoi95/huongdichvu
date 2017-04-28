var router = require('express').Router();
var userDao = require('./../dao/user.dao');
var auth = require('./../middlewares/jwt-parser');

module.exports = function () {

    router.put('/', auth.parser('user', 'admin'), updateUser);
    router.get('/:pageSize/:pageIndex', auth.parser('admin'), getAllUsers);
    router.delete('/:id', auth.parser('admin'), deleteUserById);
    router.post('/adminLogin', adminLogin);
    router.post('/login', login);
    router.post('/signup', signup);
    router.put('/ban/:id', auth.parser('admin'), banUser);
    router.put('/unban/:id', auth.parser('admin'), unbanUser)

    function login(req, res, next) {
        if (!req.body.email || !req.body.password) {
            next({
                "message": "Fields empty",
                statusCode: 400
            });
        } else {
            var user = {
                email: req.body.email,
                password: req.body.password
            };

            userDao.validateUser(user, function (err, response) {
                if (err) next(err);
                else res.send(response);
            })
        }
    }

    function signup(req, res, next) {
        var user = req.body.user;
        if (!user.name || !user.email || !user.password || !user.phone) {
            var err = {
                "message": "Fields empty",
                statusCode: 400
            };
            next(err);
        } else {
            userDao.createUser(user, function (err, response) {
                if (err) next(err);
                else res.send(response);
            });
        }
    }

    function updateUser(req, res, next) {
        if (!req.body.user.email) {
            var err = {
                "message": "Fields empty",
                statusCode: 400
            };
            next(err);
        } else {
            userDao.updateUser(req.body.user, function (err, response) {
                if (err) next(err);
                else res.send(response);
            });
        }
    }

    function adminLogin(req, res, next) {
        if (!req.body.email || !req.body.password) {
            next({
                "message": "Fields empty",
                statusCode: 400
            });
        } else {
            var user = {
                email: req.body.email,
                password: req.body.password
            };

            userDao.validateAdmin(user, function (err, response) {
                if (err) next(err);
                else res.send(response);
            })
        }
    }

    function getAllUsers(req, res, next) {
        var pageSize = parseInt(req.params.pageSize);
        var pageIndex = parseInt(req.params.pageIndex);
        if (!pageSize || !pageIndex) {
            var err = {
                statusCode: 400,
                "message": "Invalid page size or page index"
            }
            next(err);
        } else {
            userDao.getAllUsers(pageSize, pageIndex, function (err, response) {
                if (err) next(err);
                else res.send(response);
            });
        }
    }

    function deleteUserById(req, res, next) {
        userDao.deleteUserById(req.params.id, function (err, response) {
            if (err) { next(err); }
            else { res.send(response); }
        });
    }

    function banUser(req, res, next) {
        userDao.banUser(req.params.id, function (err, response) {
            if (err) { next(err); }
            else { res.send(response); }
        });
    }

    function unbanUser(req, res, next){
        userDao.unbanUser(req.params.id, function (err, response) {
            if (err) { next(err); }
            else { res.send(response); }
        });
    }

    return router;
};