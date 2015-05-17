var $ = require('$');
var Util = require('app/client/common/lib/util/util.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');
var HttpAPI = require('app/client/common/lib/mobds/http_api.js');

var userAPI = new HttpAPI({
    path: '/users/'
});

exports.sendAuthCode = Util.promisify(function (params, callback) {
    var headers =  {
        'interface': 'UserPhoneAuth'
    };
    if (params.channel) {
        headers['X-Ganji-Channel'] = params.channel;
    }

    userAPI.request('POST', headers, '', {
        method: 'GetCode',
        getCodeType: params.getCodeType || 1,
        phone: params.phone
    })
        .done(function (data) {
            var err = null;
            if (data.status !== 0) {
                err = new Error(data.errDetail);
                err.code = data.status;
            }

            callback(err, data);
        })
        .fail(function () {
            callback(new Error('网络异常，请稍后再试'));
        });
});

exports.loginByPhoneAuthCode = Util.promisify(function (params, callback) {
    var headers = {
        'interface': 'userLogin'
    };

    if (params.channel) {
        headers['X-Ganji-Channel'] = params.channel;
    }

    userAPI.request('POST', headers, '', {
        loginType: 1,
        code: params.code,
        phone: params.phone
    })
        .done(function (data) {
            var err = null;
            if (data.status) {
                err = new Error(data.errDetail);
                err.code = data.status;
                return callback(err);
            }
            exports.saveUserInfo(data);

            require.async('app/client/common/lib/api/index.js', function (HybridAPI) {
                HybridAPI.invoke('getUserInfo', null, callback);
            })
                .fail(function () {
                    callback(new Error('网络异常，请稍后再试'));
                });
        })
        .fail(function () {
            callback(new Error('网络异常，请稍后再试'));
        });
});

exports.bindPhone = Util.promisify(function (params, callback) {
    userAPI.request('POST', {'interface': 'UserPhoneAuth'}, '', {
        'method':    'AuthCode',
        'loginId':   params.user_id,
        'phone':     params.phone,
        'code':      params.code
    }, callback);
});

exports.autoLogin = function(params, callback) {
    var cookieOptions = {
        domain: '.ganji.com',
        expires: 86400 * 7,
        path: '/'
    };

    if (!params.ssid || !params.user_id) {
        return callback(null);
    }

    Cookie.set('ssid', params.ssid, cookieOptions);

    userAPI.request('POST', {
            'interface': 'autoLogin'
        }, '', {
            loginId: params.user_id
        })
        .done(function(data) {
            if (data.status) {
                return callback(null);
            }

            exports.saveUserInfo(data);

            callback({
                ssid: params.ssid,
                username: data.LoginName,
                user_id: data.LoginId,
                phone: data.IsPhone || data.phone,
                nickname: data.nickname
            });
        })
        .fail(function() {
            callback(null);
        });
};

exports.saveUserInfo = function (data) {
    var cookieOptions = {
        domain: '.ganji.com',
        expires: 86400 * 7,
        path: '/'
    };

    Cookie.set('GanjiUserInfo', JSON.stringify({
        ssid: data.wapSessionId,
        user_name: data.LoginName,
        user_id: data.LoginId,
        phone: data.IsPhone || data.phone,
        nickname: data.nickname
    }), cookieOptions);

    Cookie.set('ssid', data.wapSessionId, cookieOptions);
};

exports.logout = exports.removeUserInfo = function () {
    Cookie.remove('GanjiUserInfo', {
        domain: '.ganji.com',
        path: '/'
    });
};

exports.goBackUrl = function (backUrl, paramsObj) {
    var url = decodeURIComponent(backUrl);
    if (url.indexOf(window.location.origin + window.location.pathname) === 0) {
        url = url.split('#')[1];
    }

    if (url.indexOf('?') === -1) {
        url += '?' + $.param(paramsObj);
    } else {
        url += '&' + $.param(paramsObj);
    }

    if (/^http/.test(url)) {
        window.location.href = url;
    } else {
        Util.redirect(url);
    }
};