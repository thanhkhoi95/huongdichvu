var House = require('./../models/house.model');
var userDao = require('./../dao/user.dao');
var pageConfig = require('./../config/pagination.conf');
var pagination = require('./../services/pagination');

module.exports = {
    createHouse: createHouse,
    searchHouse: searchHouse,
    findHouseById: findHouseById,
    updateHouseInfo: updateHouseInfo,
    deleteHouseByCuid: deleteHouseByCuid
}

function createHouse(house, callback) {
    var houseNew = new House(house);
    // house.location = sanitizeHtml(house.location);
    houseNew.cuid = cuid();
    // house.img_Link = sanitizeHtml(house.img_Link);
    houseNew.floor_No = sanitizeHtml(houseNew.floor_No);
    houseNew.basement_No = sanitizeHtml(houseNew.basement_No);
    houseNew.square = sanitizeHtml(houseNew.square);
    houseNew.price = sanitizeHtml(houseNew.price);
    houseNew.bathroom_No = sanitizeHtml(houseNew.bathroom_No);
    houseNew.bedroom_No = sanitizeHtml(houseNew.bedroom_No);
    houseNew.livingroom_No = sanitizeHtml(houseNew.livingroom_No);
    houseNew.kitchen = sanitizeHtml(houseNew.kitchen);
    houseNew.contact.name = sanitizeHtml(houseNew.contact.name);
    houseNew.contact.phone = sanitizeHtml(houseNew.contact.phone);
    houseNew.contact.company = sanitizeHtml(houseNew.contact.company);
    houseNew.contact.email = sanitizeHtml(houseNew.contact.email);
    houseNew.onSale = true;
    House.findOne().sort({ 'stt': -1 }).exec(function (err, item) {
        if (err || item === null) {
            houseNew.stt = 1;
            houseNew.save(function (err, saved) {
                if (err) {
                    callback(err);
                } else callback(null, { data: saved });
            });
        } else {
            houseNew.stt = item.toObject().stt + 1;
            houseNew.save(function (err, saved) {
                if (err) {
                    callback(err);
                } else callback(null, { data: saved });
            });
        }
    });
}

function searchHouse(url, callback) {
    var city = new String(url.city);
    city = city.replace(/-/g, " ");
    city = url.city ? new RegExp("^" + url.city, "i") : new RegExp();
    var district = new String(url.district);
    district = district.replace(/-/g, " ");
    district = url.district ? new RegExp("^" + url.district, "i") : new RegExp();
    var fNo = url.fno ? url.fno : 0;
    var bno = url.bno ? url.bno : 0;
    var bthno = url.bthno ? url.bthno : 0;
    var bedno = url.bedno ? url.bedno : 0;
    var lno = url.lno ? url.lno : 0;
    var kno = url.kno ? url.kno : 0;
    var price = url.price ? url.price : 0;
    var square = url.square ? url.square : 0;
    // dung de phan trang
    var pageSize = url.pagesize ? parseInt(url.pagesize) : pageConfig.maxPageSize;
    var pageIndex = url.pageindex ? parseInt(url.pageindex) : 1;

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
        House.count({
            'location.city': city,
            'location.district': district,
            'floorNo': { $gte: fNo },
            'basementNo': { $gte: bno },
            'bathroomNo': { $gte: bthno },
            'bedroomNo': { $gte: bedno },
            'livingroomNo': { $gte: lno },
            'kitchenNo': { $gte: kno },
            'price': { $gte: price },
            'square': { $gte: square },
            'onSale': true
        }, function (err, count) {
            if (err) callback(err);
            else {
                if (pageSize < 0) {
                    pageSize = count;
                    pageIndex = 1;
                }
                House.find({
                    'location.city': city,
                    'location.district': district,
                    'floorNo': { $gte: fNo },
                    'basementNo': { $gte: bno },
                    'bathroomNo': { $gte: bthno },
                    'bedroomNo': { $gte: bedno },
                    'livingroomNo': { $gte: lno },
                    'kitchenNo': { $gte: kno },
                    'price': { $gte: price },
                    'square': { $gte: square },
                    'onSale': true
                }).skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
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

function findHouseById() {
    House.find({ _id: id }, function (err, response) {
        if (err) callback(err);
        else callback(null, {
            data: response
        });
    });
}

function updateHouseInfo(user, house, callback) {
    userDao.getUserByEmail(user.email, function (err, userFromDatabase) {
        if (err) callback(err);
        else {
            var updateInfo = house;
            var oldInfo = {};
            House.findOne({
                _id: req.body._id,
                poster_id: userFromDatabase._id
            }, function (err, old) {
                if (err) callback(err);
                else if (!old) {
                    var err = {
                        statusCode: 400,
                        "message": "House does not exist"
                    }
                }
                else oldInfo = old;
            }).then(function () {
                if (!updateInfo.hasOwnProperty('location')) updateInfo.location = oldInfo.location;
                if (!updateInfo.hasOwnProperty('img_Link')) updateInfo.img_Link = oldInfo.img_Link;
                if (!updateInfo.hasOwnProperty('floor_No')) updateInfo.floor_No = oldInfo.floor_No;
                if (!updateInfo.hasOwnProperty('basement_No')) updateInfo.basement_No = oldInfo.basement_No;
                if (!updateInfo.hasOwnProperty('square')) updateInfo.square = oldInfo.square;
                if (!updateInfo.hasOwnProperty('price')) updateInfo.price = oldInfo.price;
                if (!updateInfo.hasOwnProperty('bathroom_No')) updateInfo.bathroom_No = oldInfo.bathroom_No;
                if (!updateInfo.hasOwnProperty('bedroom_No')) updateInfo.bedroom_No = oldInfo.bedroom_No;
                if (!updateInfo.hasOwnProperty('livingroom_No')) updateInfo.livingroom_No = oldInfo.livingroom_No;
                if (!updateInfo.hasOwnProperty('kitchen')) updateInfo.kitchen = oldInfo.kitchen;
                if (!updateInfo.hasOwnProperty('contact')) updateInfo.contact = oldInfo.contact;
                if (!updateInfo.hasOwnProperty('onSale')) updateInfo.sold = oldInfo.onSale;
                House.update({ '_id': req.body._id }, {
                    "location": updateInfo.location,
                    "img_Link": updateInfo.img_Link,
                    "floor_No": updateInfo.floor_No,
                    "basement_No": updateInfo.basement_No,
                    "square": updateInfo.square,
                    "price": updateInfo.price,
                    "bathroom_No": updateInfo.bathroom_No,
                    "bedroom_No": updateInfo.bedroom_No,
                    "livingroom_No": updateInfo.livingroom_No,
                    "kitchen": updateInfo.kitchen,
                    "contact": updateInfo.contact,
                    "onSale": updateInfo.onSale
                }, function (err, response) {
                    if (err)
                        callback(err);
                    else {
                        callback(null, { data: response });
                    }
                });
            });
        }
    });
}

function deleteHouseByCuid(user, cuid, callback) {
    userDao.getUserByEmail(user.email, function (err, userFromDatabase) {
        if (err) callback(err);
        else {
            House.remove({
                cuid: req.body.cuid,
                poster_id: userFromDatabase._id
            }, function (err, response) {
                if (err)
                    callback(err);
                else {
                    callback(null, {
                        data: response
                    });
                }
            });
        }
    });
}