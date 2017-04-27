var router = require('express').Router();
var houseDao = require('./../dao/house.dao');
var auth = require('./../middlewares/jwt-parser');

module.exports = function () {

    router.get('/search/*', searchHouse);
    router.post('/', auth.parser('user'), createHouse);
    router.get('/getHouse/:id', findHouseById);
    router.put('/', auth.parser('user'), updateHouseInfo);
    router.delete('/:id', auth.parser('user', 'admin'), deleteHouse);
    router.put('/setAvailableFlag', auth.parser('admin'), setAvailableFlag);

    function searchHouse(req, res, next) {
        houseDao.searchHouse(req.query, function(err, response){
            if (err) next(err);
            else res.send(response);
        });
    }

    function createHouse(req, res, next) {
        if (!req.body.house) {
            var err = {
                statusCode: 400,
                "message": "Null house object"
            }
            next(err);
        } else {
            houseDao.createHouse(req.body.user, req.body.house, function (err, response) {
                if (err) next(err);
                else res.send(response);
            });
        }
    }

    function findHouseById(req, res, next) {
        houseDao.findHouseById(req.params.id, function (err, response) {
            if (err) next(err);
            else res.send(response);
        });
    }

    function updateHouseInfo(req, res, next) {
        if (!req.body.house._id) {
            var err = {
                statusCode: 400,
                "message": "Fields Empty"
            };
            next(err);
        } else {
            houseDao.updateHouse(req.body.user, req.body.house, function (err, response) {
                if (err) next(err);
                else res.send(null, response);
            })
        }
    }

    function deleteHouse(req, res, next) {
        houseDao.deleteHouseByCuid(req.body.user, req.params.cuid, function (err, response) {
            if (err) next(err);
            else res.send(response);
        });
    }

    return router;
}

function setAvailableFlag(req, res, next){
    houseDao.setAvailableFlag(req.query, function(err, response){
        if (err) next(err);
        else res.send(response);
    });
}