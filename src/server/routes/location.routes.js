var router = require('express').Router();
var locationDao = require('./../dao/location.dao');
var auth = require('./../middlewares/jwt-parser');

module.exports = function () {

    router.get('/', getAllCitiesAndDistricts);

    function getAllCitiesAndDistricts(req, res, next){
        locationDao.getAllCitiesAndDistricts(function(err, response){
            if (err) next(err);
            else res.send(response);
        });
    }

    return router;
}