var Util = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');

var BaseAPI = new HttpAPI({
    path: '/webapp/jr/fenqi/'
});

exports.put = function (interfaceName, data, callback) {
    BaseAPI.request(
        'PUT',
        {
            'interface': data.interfaceName

        },
        interfaceName || '',
        data,
        callback
    );
};

exports.post = function (interfaceName, data, callback) {
    BaseAPI.request(
        'POST',
        {
            'interface': data.interfaceName
        },
        interfaceName || '',
        data,
        callback
    );
};

exports.get = function (interfaceName, data, callback) {
    BaseAPI.request(
        'GET',
        {
            'interface': data.interfaceName
        },
        interfaceName || '',
        data,
        callback
    );
};
exports.del = function (interfaceName, data, callback) {
    BaseAPI.request(
        'DELETE',
        {
            'interface': data.interfaceName
        },
        interfaceName || '',
        data,
        callback
    );
};

function resultWraper (callback) {
    if (!callback) {
        return null;
    }
    return function (err, data) {
        if (err) {
            return callback(err);
        }

        if (!data) {
            return callback(new Error('网络异常请稍后再试'));
        }
        if (data.status !== 0) {
            callback(new Error(data.message));
        }
        return callback(null, data.data);
    };
}

/*
 * getOrderList
 * @description 账单列表
 * @params {user_id:0}
 * POST http://mobds.ganjistatic3.com/webapp/jr/fenqi/user/applyList
*/
exports.getOrderList = Util.promisify(function (params, callback) {
    exports.post('user/applyList', params, resultWraper(callback));
});

/*
 * getOrderDetail
 * @description 账单详情
 * @params {user_id: 0, apply_id: 1}
 * POST http://mobds.ganjistatic3.com/webapp/jr/fenqi/user/applyDetail
*/
exports.getOrderDetail = Util.promisify(function (params, callback) {
    exports.post('user/applyDetail', params, resultWraper(callback));
});
