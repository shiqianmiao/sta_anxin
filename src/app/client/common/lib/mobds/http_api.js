var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');

function MobdsAPI (config) {
    this.config = config;
}

MobdsAPI.prototype.request = function(type, headers, query, data, callback) {
    var defer = $.Deferred();
    var config = this.config;

    if (typeof data === 'function') {
        callback = data;
        data = undefined;
    }

    if (callback) {
        defer
            .done(function (result) {
                callback(null, result);
            })
            .fail(function (err) {
                callback(err);
            });
    }

    HybridAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
        var server = 'http://mobds.ganji.cn';
        if (err) {
            defer.reject(new Error('无法获取设备信息!'));
            return;
        }

        if (deviceInfo.env === 'test1') {
            server = 'http://mobds.ganjistatic3.com';
        } else if (deviceInfo.env === 'web6') {
            server = 'http://mobtestweb6.ganji.com';
        }

        $.ajax({
            type: type,
            url: server + config.path + (query || ''),
            data: data,
            dataType: 'json',
            headers: $.extend({
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
            }, headers)
        })
            .done(function (data) {
                var err = null;
                if (!data) {
                    return defer.resolve(data);
                }
                if ('Code' in data && 'Data' in data && 'Message' in data) {
                    if (data.Code) {
                        err = new Error(data.Message);
                        err.code = data.Code;

                        defer.reject(err);
                    } else {
                        defer.resolve(data.Data);
                    }
                } else if ('data' in data && 'msg' in data && 'success' in data) {
                    if (data.success === 1) {
                        defer.resolve(data.data);
                    } else {
                        err = new Error(data.msg);

                        defer.reject(err);
                    }
                } else {
                    defer.resolve(data);
                }
            })
            .fail(function () {
                defer.reject(new Error('网络异常'));
            });
    });

    return defer.promise();
};

module.exports = MobdsAPI;