var Cookie = require('com/mobile/lib/cookie/cookie.js');
var Storage = require('com/mobile/lib/storage/storage.js');
var NativeAPI = require('app/client/common/lib/native/native.js');
var Util = require('app/client/common/lib/util/util.js');

var storage = new Storage('GANJI_UUID');

module.exports = function (params, callback) {
    params = params || {};

    NativeAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
        if (err) {
            if (err.code !== -32603) {
                return callback(err);
            } else {
                var token = (Cookie.get('ssid') || '').split('').map(function (l) {
                    return l.charCodeAt(0).toString(16);
                }).join('');

                var uuid = Cookie.get('hybrid-uuid') || storage.get('uuid') || Util.generateUUIDV4().replace(/-/g, '');
                var customerId = '1000';

                Cookie.set('hybrid-uuid', uuid, {
                    domain: '.ganji.com',
                    expires: 86400 * 365, // 1 year
                    path: '/'
                });

                storage.set('uuid', uuid);

                if (/micromessenger/i.test(window.navigator.userAgent)) {
                    customerId = '1001';
                } else if (window.location.search.indexOf('ca_s=baidu') !== -1) {
                    customerId = '1002';
                }

                deviceInfo = {
                    'customerId': customerId,
                    'clientAgent': 'sdk#320*480',
                    'GjData-Version': '1.0',
                    'versionId': '5.10.0',
                    'model': 'Generic/AnyPhone',
                    'agency': 'agencydefaultid',
                    'contentformat': 'json2',
                    'userId': uuid,
                    'token': token,
                    'mac': uuid,
                    'os': /android/i.test(window.navigator.userAgent) ? 'android' : 'ios',
                    'env': 'online'
                };
            }
        }

        return callback(null, deviceInfo);
    });
};
