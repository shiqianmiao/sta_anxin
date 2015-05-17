var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');

exports.getData = function (query, callback) {
    var defer = $.Deferred();

    callback = callback || function () {};

    defer
        .done(function (data) {
            callback(null, data);
        })
        .fail(function (err) {
            callback(err);
        });
    NativeAPI.invoke(
        'getDeviceInfo',
        null,
        function (err, deviceInfo) {
            if (err) {
                if (err.code === -32603) {
                    deviceInfo = {
                        'customerId': '801',
                        'clientAgent': 'sdk#320*480',
                        'GjData-Version': '1.0',
                        'versionId': '5.7.0',
                        'model': 'Generic/AnyPhone',
                        'agency': 'agencydefaultid',
                        'contentformat': 'json2',
                        'userId': '1615BBAAF41ABDC59CFA7EBE8C643919',
                        'token': '1615BBAAF41ABDC59CFA7EBE8C643919',
                        'mac': '787987779',
                        'os': '',
                        'env': 'online'
                    };
                } else {
                    defer.reject(new Error('无法获取设备信息!'));
                    return;
                }
            }
            var baseUrl;
            switch (deviceInfo.env) {
                case 'test1' :
                    baseUrl = 'http://mobds.ganjistatic3.com/webapp/common/';
                    break;
                case 'web6' :
                    baseUrl = 'http://mobtestweb6.ganji.com/webapp/common/';
                    break;
                default:
                    baseUrl = 'http://mobds.ganji.cn/webapp/common/';
            }

            query._rand = Math.random();
            $.ajax({
                url: baseUrl,
                data: query,
                dataType: 'json',
                headers: {
                    'customerId': deviceInfo.customerId,
                    'clientAgent': deviceInfo.clientAgent,
                    'GjData-Version': deviceInfo['GjData-Version'],
                    'versionId': deviceInfo.versionId,
                    'model': deviceInfo.model,
                    'agency': deviceInfo.agency,
                    'contentformat': deviceInfo.contentformat,
                    'userId': deviceInfo.userId,
                    'token': deviceInfo.token,
                    'mac': deviceInfo.mac
                }
            })
                .done(function (data) {
                    var err = null;
                    if (data.Code) {
                        err = new Error(data.Message);
                        err.code = data.Code;

                        defer.reject(err);
                    } else {
                        defer.resolve(data.Data);
                    }
                })
                .fail(function () {
                    defer.reject(new Error('网络异常'));
                });
        }
    );

    return defer.promise();
};