var HttpAPI = require('app/client/common/lib/mobds/http_restful_api.js');
var BaseAPI = new HttpAPI({
    path: '/api/common/msactive/dingdong/qunzu/'
});

exports.post = function (interfaceName, data, callback) {
    BaseAPI.request(
        'POST',
        {
            'X-Ganji-Agent': 'H5'

        },
        interfaceName || '',
        data,
        resultWraper(callback)
    );
};

exports.get = function (interfaceName, data, callback) {
    BaseAPI.request(
        'GET',
        {
            'X-Ganji-Agent': 'H5'
        },
        interfaceName || '',
        data,
        resultWraper(callback)
    );
};

function resultWraper (callback) {
    return function (err, data) {
        if (err) {
            return callback(err);
        }

        if (!data) {
            return callback(new Error('网络异常请稍后再试'));
        }

        return callback(null, data.data);
    };
}