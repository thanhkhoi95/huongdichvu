var router = require('express').Router();
var feedbackDao = require('./../dao/feedback.dao');
var auth = require('./../middlewares/jwt-parser');

module.exports = function () {

    router.get('/:pageSize/:pageIndex', auth.parser('admin'), getAllFeedback);
    router.get('/:id', auth.parser('admin'), getFeedbackById);
    router.delete('/:id', auth.parser('admin'), deleteFeedbackById);
    router.post('/', sendFeedback);

    function getAllFeedback(req, res, next) {
        feedbackDao.getAllFeedback(req.params.pageSize, req.params.pageIndex, function (err, response) {
            if (err) next(err);
            else res.send(response);
        });
    }

    function getFeedbackById(req, res, next) {
        feedbackDao.getFeedbackById(req.params.id, function (err, response) {
            if (err) next(err);
            else res.send(response);
        });
    }

    function deleteFeedbackById(req, res, next) {
        feedbackDao.deleteFeedbackById(req.params.id, function (err, response) {
            if (err) next(err);
            else res.send(response);
        });
    }

    function sendFeedback(req, res, next) {
        if (!req.body.name || !req.body.content) {
            var err = {
                statusCode: 400,
                "message": "Empty fields"
            };
            next(err);
        } else {
            var feedback = {};
            feedback.name = req.body.name;
            feedback.content = req.body.content;
            feedback.email = req.body.email || "";

            feedbackDao.createFeedback(feedback, function (err, response) {
                if (err) next(err);
                else res.send(response);
            });
        }
    }

    return router;
}