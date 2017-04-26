var router = require('express').Router();
var houseDao = require('./../dao/house.dao');
var auth = require('./../middlewares/jwt-parser');

module.exports = function () {

    router.get('/*', searchHouse);
    router.post('/', auth.parser('user'), createHouse);
    router.get('/:id', findHouseById);
    router.put('/', auth.parser('user'), updateHouseInfo);
    router.delete('/:cuid', auth.parser('user', 'admin'), deleteHouse);

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
            houseDao.createHouse(req.body.house, function (err, response) {
                if (err) next(err);
                else res.send(null, response);
            });
        }
    }

    function findHouseById(req, res, next) {
        houseDao.getFeedbackById(req.params.id, function (err, response) {
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