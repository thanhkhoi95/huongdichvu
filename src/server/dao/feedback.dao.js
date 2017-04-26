var Feedback = require('./../models/feedback.model');
var pageConfig = require('./../config/pagination.conf');
var pagination = require('./../services/pagination');

module.exports = {
    getAllFeedback: getAllFeedback,
    getFeedbackById: getFeedbackById,
    createFeedback: createFeedback,
    deleteFeedbackById: deleteFeedbackById
};

function getAllFeedback(pageSize, pageIndex, callback) {
    pageSize = parseInt(pageSize);
    pageIndex = parseInt(pageIndex);
    if (!pageSize || !pageIndex) {
        var err = {
            statusCode: 400,
            "message": "Invalid page size or page index"
        }
        callback(err);
    } else if (pageSize > pageConfig.maxPageSize) {
        var err = {
            statusCode: 400,
            "message": "Page size limtitation exceeded"
        }
        callback(err);
    } else {
        Feedback.count({}, function (err, count) {
            if (err) callback(err);
            else {
                if (pageSize < 0) {
                    pageSize = count;
                    pageIndex = 1;
                }
                Feedback.find({})
                    .skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
                    .limit(pageSize)
                    .exec(function (err, response) {
                        if (err) { callback(err); }
                        else {
                            var result = pagination.paging(response, count, pageIndex, pageSize);
                            callback(null, {
                                data: result
                            });
                        }
                    });
            }
        });
    }
}

function createFeedback(feedback, callback) {
    var feedbackNew = new Feedback();

    feedbackNew.name = feedback.name;
    feedbackNew.email = feedback.email;
    feedbackNew.content = feedback.content;

    feedbackNew.save(function (err, response) {
        if (err) next(err);
        else callback(null, {
            data: response
        });
    });
}

function getFeedbackById(id, callback) {
    Feedback.findOne({ _id: id }, function (err, response) {
        if (err) callback(err);
        else if (!response) {
            var err = {
                statusCode: 400,
                "message": "Feedback does not exist"
            }
            callback(err);
        } else callback(null, {
            data: response
        });
    });
}

function deleteFeedbackById(id, callback) {
    Feedback.remove({ _id: id }, function (err, response) {
        if (err) { callback(err) }
        else {
            callback(null, {
                data: response
            });
        }
    });
}