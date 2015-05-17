var Util    = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_restful_api.js');
var async   = require('com/mobile/lib/async/async.js');


var BaseAPI = new HttpAPI({
    path: '/api/common/shop/'
});

var resultWraper = function (callback) {
    return function (err, data) {
        if (err) {
            return callback(err);
        }

        return callback(null, data);
    };
};

var post = function (interfaceName, data, callback) {
    BaseAPI.request(
        'POST',
        {
            'X-Ganji-Agent': 'H5'

        },
        interfaceName || '',
        data,
        callback
    );
};

var get = function (interfaceName, data, callback) {
    BaseAPI.request(
        'GET',
        {
            'X-Ganji-Agent': 'H5'
        },
        interfaceName || '',
        data,
        callback
    );
};

/*var put = function (interfaceName, data, callback) {
    BaseAPI.request(
        'PUT',
        {
            'X-Ganji-Agent': 'H5',
            'Content-Type':'application/json'

        },
        interfaceName || '',
        data,
        callback
    );
};*/



/*
  摇奖次数
 * get /api/common/shop/lottery/用户Id/
*/
exports.getLotteryTimes = Util.promisify(function (params, callback) {
    get('lottery/' + params.user_id + '/', null, resultWraper(callback));
});

/*
 * 中奖数据
 * GET /api/common/shop/lottery/prize/winners/
*/
exports.getWinnersData = Util.promisify(function (params, callback) {
    get('lottery/prize/winners/', null, resultWraper(callback));
});

exports.getIndexData = function (params, callback) {
    async.parallel({
        times : function (cb) {
            exports.getLotteryTimes(params, function (err, data) {
                cb(null, data);
            });
        },
        list: function (cb) {
            exports.getWinnersData(params, function (err, data) {
                cb(null, data);
            });
        }
    }, function (err, result) {
        callback(err, result);
    });
};
/*
 * 摇奖
 * POST http://mobds.ganjistatic3.com/api/common/operation/lottery/1000145962/products/
*/
exports.lottery = Util.promisify(function (params, callback) {
    post('lottery/' + params.user_id + '/', params, resultWraper(callback));
});

/*
 * 创建订单
 * post
*/
exports.createOrder = Util.promisify(function (params, callback) {
    post('usercredit/'+ params.user_id +'/orders/', {product_id: params.product_id, pay_code: params.pay_code}, callback);
});


