var NativeAPI = require('app/client/common/lib/native/native.js');
var $ = require('$');

exports.init = function () {
    if (!window.navigator.onLine) {
        $('body').removeClass('loading').addClass('offline');
        return;
    }

    NativeAPI.invoke('getCityInfo', null, function (err, cityInfo) {
        var query = {
            height: $('body').height()
        };

        if (err) {
            query.city = '北京';
        } else {
            query.city = cityInfo.city_name || '北京';
        }

        window.location.href = 'http://sta.ganji.com/ng/app/client/common/view/subway/subway.html?' + $.param(query);
    });
};