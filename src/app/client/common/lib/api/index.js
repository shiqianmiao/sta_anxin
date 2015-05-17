var Util = require('app/client/common/lib/util/util.js');

var map = {
    'getDeviceInfo': './get_device_info.js',
    'getUserInfo': './get_user_info.js',
    'getCityInfo': './get_city_info.js'
};

exports.invoke = Util.promisify(function (name, params, callback) {
    var api = map[name];

    if (!api) {
        return callback(new Error('API NOT FOUND'));
    }

    if (typeof params === 'function' && !callback) {
        callback = params;
        params = null;
    }

    require.async(api, function (api) {
        api(params, callback);
    });
});
