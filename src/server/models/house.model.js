var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var houseSchema = new Schema({
    "stt": {
        type: Number
    },
    "cuid": {
        type: String,
        required: true
    },
    "location": {
        "city": {
            type: String
        },
        "district": {
            type: String
        },
        "address": {
            type: String
        }
    },
    "img_Link": [String],
    "floorNo": {
        type: Number
    },
    "basementNo": {
        type: Number
    },
    "square": {
        type: Number
    },
    "price": {
        type: Number
    },
    "bathroomNo": {
        type: Number
    },
    "bedroomNo": {
        type: Number
    },
    "livingroomNo": {
        type: Number
    },
    "kitchenNo": {
        type: Number
    },
    "contact": {
        "name": {
            type: String
        },
        "phone": {
            type: String
        },
        "email": {
            type: String
        }
    },
    "poster_id": {
        type: String,
        required: true
    },
    "onSale": {
        type: Boolean,
        default: true
    }
});


var House = mongoose.model('house', houseSchema);

module.exports = House;
