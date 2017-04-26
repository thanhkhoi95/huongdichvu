var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
    "name": {
        type: String,
        required: true
    },
    "email": {
        type: String
    },
    "content": {
        type: String,
        required: true
    },
});

var Feedback = mongoose.model('Feedback', feedbackSchema)

module.exports = Feedback;