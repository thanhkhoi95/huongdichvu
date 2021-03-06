var House = require('./../models/house.model');
var userDao = require('./../dao/user.dao');
var pageConfig = require('./../config/pagination.conf');
var pagination = require('./../services/pagination');

module.exports = {
    createHouse: createHouse,
    searchHouse: searchHouse,
    findHouseById: findHouseById,
    updateHouseInfo: updateHouseInfo,
    deleteHouseById: deleteHouseById,
    setAvailableFlag: setAvailableFlag
}

function createHouse(user, house, callback) {
    userDao.getUserByEmail(user.email, function (err, userFromDatabase) {
        if (err) callback(err);
        else {
            var houseNew = new House(house);
            // house.location = sanitizeHtml(house.location);
            // house.img_Link = sanitizeHtml(house.img_Link);
            houseNew.floorNo = (houseNew.floorNo);
            houseNew.basementNo = (houseNew.basementNo);
            houseNew.square = (houseNew.square);
            houseNew.price = (houseNew.price);
            houseNew.bathroomNo = (houseNew.bathroomNo);
            houseNew.bedroomNo = (houseNew.bedroomNo);
            houseNew.livingroomNo = (houseNew.livingroomNo);
            houseNew.kitchenNo = (houseNew.kitchenNo);
            houseNew.contact.name = (houseNew.contact.name);
            houseNew.contact.phone = (houseNew.contact.phone);
            houseNew.contact.email = (houseNew.contact.email);
            houseNew.poster_id = userFromDatabase._id;
            houseNew.onSale = true;
            houseNew.available = true;
            House.findOne().sort({ 'stt': -1 }).exec(function (err, item) {
                if (err) callback(err);
                else if (item === null) {
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
                        } else {
                            callback(null, { data: saved });
                        }
                    });
                }
            });
        }
    });
}

function searchHouse(url, callback) {
    var query = {};

    if (url.city) {
        query['location.city'] = unescape(url.city);
    }
    if (url.district) {
        query['location.district'] = unescape(url.district);
    }
    if (url.noFloor) {
        query['floorNo'] = { $gte: url.noFloor };
    }
    if (url.noBedroom) {
        query['bedroomNo'] = { $gte: url.noBedroom };
    }
    if (url.noLivingrom) {
        query['livingroomNo'] = { $gte: url.noLivingrom };
    }
    if (url.noBathroom) {
        query['bathroomNo'] = { $gte: url.noBathroom };
    }
    if (url.noKitchen) {
        query['kitchenNo'] = { $gte: url.noKitchen };
    }
    if (url.noBasement) {
        query['basementNo'] = { $gte: url.noBasement };
    }
    if (url.square) {
        query['square'] = { $lte: url.square };
    }
    if (url.price) {
        query['price'] = { $lte: url.price };
    }
    if (url.poster_id) {
        query['poster_id'] = url.poster_id;
    } else if (!url.all) {
        query['onSale'] = true;
        query['available'] = true;
    } else if (url.all !== "true") {
        query['onSale'] = true;
        query['available'] = true;
    }
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
        House.count(query, function (err, count) {
            if (err) callback(err);
            else {
                if (pageSize < 0) {
                    pageSize = count;
                    pageIndex = 1;
                }
                House.find(query).skip((pageIndex > 0) ? (pageIndex - 1) * pageSize : 0)
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

function findHouseById(id, callback) {
    House.findOne({ _id: id }, function (err, response) {
        if (err) callback(err);
        else if (!response) {
            var err = {
                statusCode: 400,
                "message": "House does not exist"
            };
            callback(err)
        } else callback(null, {
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
                _id: house._id,
                poster_id: userFromDatabase._id
            }, function (err, oldInfo) {
                if (err) callback(err);
                else if (!oldInfo) {
                    var err = {
                        statusCode: 400,
                        "message": "House does not exist"
                    }
                    callback(err);
                } else {
                    if (!updateInfo.hasOwnProperty('location')) updateInfo.location = oldInfo.location;
                    if (!updateInfo.hasOwnProperty('img_Link')) updateInfo.img_Link = oldInfo.img_Link;
                    if (!updateInfo.hasOwnProperty('floorNo')) updateInfo.floorNo = oldInfo.floorNo;
                    if (!updateInfo.hasOwnProperty('basementNo')) updateInfo.basementNo = oldInfo.basementNo;
                    if (!updateInfo.hasOwnProperty('square')) updateInfo.square = oldInfo.square;
                    if (!updateInfo.hasOwnProperty('price')) updateInfo.price = oldInfo.price;
                    if (!updateInfo.hasOwnProperty('bathroomNo')) updateInfo.bathroomNo = oldInfo.bathroomNo;
                    if (!updateInfo.hasOwnProperty('bedroomNo')) updateInfo.bedroomNo = oldInfo.bedroomNo;
                    if (!updateInfo.hasOwnProperty('livingroomNo')) updateInfo.livingroomNo = oldInfo.livingroomNo;
                    if (!updateInfo.hasOwnProperty('kitchenNo')) updateInfo.kitchenNo = oldInfo.kitchenNo;
                    if (!updateInfo.hasOwnProperty('contact')) updateInfo.contact = oldInfo.contact;
                    if (!updateInfo.hasOwnProperty('onSale')) updateInfo.onSale = oldInfo.onSale;
                    House.update({ '_id': house._id }, {
                        "location": updateInfo.location,
                        "img_Link": updateInfo.img_Link,
                        "floorNo": updateInfo.floorNo,
                        "basementNo": updateInfo.basementNo,
                        "square": updateInfo.square,
                        "price": updateInfo.price,
                        "bathroomNo": updateInfo.bathroomNo,
                        "bedroomNo": updateInfo.bedroomNo,
                        "livingroomNo": updateInfo.livingroomNo,
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
                }
            });
        }
    });
}

function deleteHouseById(user, id, callback) {
    userDao.getUserByEmail(user.email, function (err, userFromDatabase) {
        if (err) callback(err);
        else {
            House.remove({
                cuid: id,
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

function setAvailableFlag(url, callback) {
    var id = url.id;
    var flag = url.flag == 1 ? true : false;
    House.update({ '_id': id }, { available: flag }, function (err, response) {
        if (err) callback(err);
        else callback(null, {
            data: response
        });
    });
}