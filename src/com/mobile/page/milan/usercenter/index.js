var BasePage = require('../base_page.js');
var $ = require('$');

$.extend(exports, BasePage);

exports.showMsgBox = function(config) {
    var $content = config.$content;

    require.async('com/mobile/lib/cookie/cookie.js', function (Cookie) {
        var userInfo = JSON.parse(Cookie.get('GanjiUserInfo') || '{}');
        if (!userInfo.user_id) {
            return;
        }

        $.ajax({
            url: 'http://webim.ganji.com/index.php?op=getnewmsgcount',
            data: {
                userId: userInfo.user_id
            },
            dataType: 'jsonp'
        })
        .done(function (data) {
            if (data.data && data.data.msgTotalNewCount && data.data.msgTotalNewCount !== '0') {
                var count = data.data.msgTotalNewCount;
                var html = '<p>消息盒子<em></em></p><p>'+ count +'条未读<i></i></p>';
                $content.html(html);
            }
        });
    });
};

exports.init = function () {
    BasePage.init();
};