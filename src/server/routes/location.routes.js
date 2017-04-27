var router = require('express').Router();
var locationDao = require('./../dao/location.dao');
var auth = require('./../middlewares/jwt-parser');

module.exports = function () {

    router.get('/', getAllCitiesAndDistricts);
    router.get('/city', getAllCities);
    router.get('/district', getAllDistricts);

    function getAllCitiesAndDistricts(req, res, next){
        locationDao.getAllCitiesAndDistricts(function(err, response){
            if (err) next(err);
            else res.send(response);
        });
    }

    function getAllCities(req, res, next){
        locationDao.getAllCities(function(err, response){
            if (err) next(err);
            else res.send(response);
        });
    }

    function getAllDistricts(req, res, next){
        locationDao.getAllDistricts(unescape(req.query.city) ,function(err, response){
            if (err) next(err);
            else res.send(response);
        });
    }

    return router;
}