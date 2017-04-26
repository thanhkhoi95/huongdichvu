exports.paging = function (data, count, pageIndex, pageSize) {
    var res = {};
    res.currentPage = parseInt(pageIndex);
    res.pageSize = parseInt(pageSize);
    if (count == 0) res.totalPage = 0;
    else res.totalPage = (count % pageSize == 0)?(count/pageSize):((count - count%pageSize)/pageSize + 1);
    res.totalResult = count;
    res.items = [];

    for (var i in data){
        res.items.push(data[i]);
    }

    return res;
}