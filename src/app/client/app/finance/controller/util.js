var Cookie = require('com/mobile/lib/cookie/cookie.js');

exports.saveOpenId = function(open_id) {
    Cookie.set('gj-weixin-openid', open_id, {
        domain: '.ganji.com',
        expires: 86400 * 14,
        path: '/'
    });
};