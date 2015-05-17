var Cookie = require('com/mobile/lib/cookie/cookie.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

module.exports = function (params, callback) {
    NativeAPI.invoke('getCityInfo', null, function(err, cityInfo) {
        if (err) {
            if (err.code !== -32603) {
                return callback(err);
            } else {
                cityInfo = {
                    city_id: null,
                    city_domain: Cookie.get('cityDomain') || null
                };

                if (cityInfo.city_domain) {
                    err = null;
                } else {
                    err = new Error('无法获取城市信息');
                    err.code = -32001;
                }
            }
        }

        return callback(err, cityInfo);
    });
};