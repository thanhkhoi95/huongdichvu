var Location = require('./../models/location.model');

module.exports = {
    getAllCitiesAndDistricts: getAllCitiesAndDistricts,
}

function getAllCitiesAndDistricts(callback) {
    Location.find({}, function (err, response){
        if (err) callback(err);
        else callback(null, {
            data: response
        });
    });
}