var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    "city": {type: String},
    "districts": [String]
});

var Location = mongoose.model('locations', locationSchema);

module.exports = Location;