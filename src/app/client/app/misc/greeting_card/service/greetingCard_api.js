var Util = require('app/client/common/lib/util/util.js');
var HttpAPI = require('app/client/common/lib/mobds/http_restful_api.js');
var BaseAPI = new HttpAPI({
    path: '/api/common/operation/'
});

exports.post = function (interfaceName, data, callback) {
    BaseAPI.request(
        'POST',
        {
            // 'X-Ganji-token': '4d34385a6b354559376652582f492f554d34684e677a3343',
            'X-Ganji-Agent': 'H5'

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
            'X-Ganji-Agent': 'H5'
        },
        interfaceName || '',
        data,
        callback
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

        return callback(null, data.data ? data.data : data);
    };
}

/*
 * createGreetingCard
 * @description 创建贺卡
 * POST /api/common/operation/greetingcards/
*/
exports.createGreetingCard = Util.promisify(function (params, callback) {
    var data = {
        tplId : params.tplId,
        hasMusic : params.hasMusic,
        toWho : params.toWho,
        greetingArea : params.greetingArea,
        fromWho : params.fromWho,
        hasRecord : params.hasRecord,
        recordUrl : params.recordUrl,
        recordLength : params.recordLength
    };
    exports.post('greetingcards/', {card_info: JSON.stringify(data)}, resultWraper(callback));
});

exports.getCardInfo = Util.promisify(function (params, callback) {
    exports.get('greetingcards/'+ params + '/', null, resultWraper(callback));
});