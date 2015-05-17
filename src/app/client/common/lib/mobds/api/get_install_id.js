var $ = require('$');

module.exports = function (callback) {
    var installId = window.localStorage.getItem('insid');
    if (!installId) {
        getInstallIdFromRemote(function (err, data) {
            if (data && data.value) {
                data = data.value;
            }

            if (!err && data) {
                setTimeout(function () {
                    window.localStorage.setItem('insid', data);
                });
            }
            callback(err, data);
        });
    } else {
        callback(null, installId);
    }
};

function getInstallIdFromRemote (callback) {
    require.async(['../http_api.js'], function (HttpAPI) {
        var httpAPI = new HttpAPI({
            path: '/webapp/common/'
        });

        httpAPI.request('GET', null, '?' + $.param({ controller: 'CommonIdProcess'}))
            .done(function (data) {
                return callback(null, data);
            })
            .fail(function () {
                return callback(new Error('网络异常'));
            });
    });
}
