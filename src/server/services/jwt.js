var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

var cert = fs.readFileSync(path.join(__dirname, '../key.pem'));
var pub = fs.readFileSync(path.join(__dirname, '../key.pub'));

exports.sign = function (obj, callback) {
    jwt.sign(obj, cert, { algorithm: 'RS256' }, function (err, token) {
        if (err) callback(err);
        else callback(null, token);
    });
}

exports.verify = function (token, callback) {
    jwt.verify(token, pub, function (err, decoded) {
        if (err) callback(err);
        else callback(null, decoded);
    });
};
