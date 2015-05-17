var Cookie = require('com/mobile/lib/cookie/cookie.js');
var NativeAPI = require('app/client/common/lib/native/native.js');

module.exports = function (params, callback) {
    params = params || {};

    NativeAPI.invoke('getUserInfo', null, function (err, userInfo) {
        if (err) {
            if (err.code !== -32603) {
                return callback(err);
            } else {
                userInfo = JSON.parse(Cookie.get('GanjiUserInfo') || null);
                if (!userInfo) {
                    err = new Error('未登录');
                    err.code = -32001;
                } else {
                    err = null;
                    userInfo.username = userInfo.user_name;
                }
            }
        }

        return callback(err, userInfo);
    });
};
