var Util = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_restful_api.js');
var BaseAPI = new HttpAPI({
    path: '/api/common/operation/lottery/'
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
 * 保存用户收货地址信息
 * POST /api/common/operation/lottery/:id/userinfo/
 *  express_consignee    string      Y   用户称呼
    express_phone   Int     Y   手机
    express_address string      Y   地址
*/
exports.saveAddress = Util.promisify(function (isMod, params, callback) {
    post(params.user_id + '/userinfo/', params, resultWraper(callback));
});

/*
 * 获取用户收货地址信息
 * GET /api/common/operation/lottery/:id/userinfo/
 *  {"code":0,"message":"\u6210\u529f","data":{"express_consignee":"111","express_phone":"0","express_address":""}}
*/
exports.getAddress = Util.promisify(function (params, callback) {
    get(params.user_id + '/userinfo/', null, resultWraper(callback));
});
/*
 * 群主福利报名
 * "benefits_type": 1
 * POST /api/common/operation/lottery/:id/register/
*/
exports.regWelfare = Util.promisify(function (params, callback) {
    post(params.user_id + '/register/', {benefits_type: params.type}, resultWraper(callback));
});
/*
 * 摇奖首页数据
 * GET /api/common/operation/lottery/:user_id/
*/
exports.getIndexData = Util.promisify(function (params, callback) {
    get(params.user_id + '/', null, resultWraper(callback));
});

/*
 * 获取用户奖品列表据
 * GET http://mobds.ganjistatic3.com/api/common/operation/lottery/1000145962/products/?page=1
*/
exports.getPrizeList = Util.promisify(function (params, callback) {
    get(params.user_id + '/products/', {page: params.page}, resultWraper(callback));
});

/*
 * 摇奖
 * POST http://mobds.ganjistatic3.com/api/common/operation/lottery/1000145962/products/
*/
exports.lottery = Util.promisify(function (params, callback) {
    post(params.user_id + '/products/', params, resultWraper(callback));
});




