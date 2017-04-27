var Location = require('./../models/location.model');

module.exports = {
    getAllCitiesAndDistricts: getAllCitiesAndDistricts,
    getAllCities : getAllCities,
    getAllDistricts : getAllDistricts
}

function getAllCitiesAndDistricts(callback) {
    Location.find({}, function (err, response){
        if (err) callback(err);
        else callback(null, {
            data: response
        });
    });
}

function getAllCities(callback) {
    Location.find({}, 'city' , function (err, response){
        if (err) callback(err);
        else callback(null, {
            data: response
        });
    });
}

function getAllDistricts(city, callback) {
    Location.find({'city': city}, 'districts', function (err, response){
        if (err) callback(err);
        else callback(null, {
            data: response
        });
    });
}