var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var Service     = require('app/client/app/fenqi/service/fenqi_api.js');
var BasePage    = require('app/client/app/fenqi/view/base_page.js');
// var Util        = require('app/client/common/lib/util/util.js');
var dateParse   = require('app/client/app/fenqi/util/date_parse.js');
var tpl         = require('app/client/app/fenqi/template/order/order_list.tpl');
require('../style/style.css');

var $body       = $('body');

var User = BasePage.user;

exports.init = function () {
    $body.removeClass('loading');
    NativeAPI.invoke( 'updateTitle', {'text': '账单列表'} );

    User.getUserInfo(function (err, userInfo) {
        if (!userInfo) {
            $body.addClass('nothing');
            return;
        }
        Service.getOrderList(
            {
                user_id: userInfo.user_id,
                interfaceName: 'FenqiUserApplyList'
            },
            function (err, data) {
                if (data && data.length > 0) {
                    data.forEach(function (item) {
                        var time_str = '';
                        if (!!parseInt(item.repayment_begin, 10)) {
                            time_str = dateParse.parseToYMD(item.repayment_begin);
                        }
                        if (!!parseInt(item.repayment_begin, 10)) {
                            time_str += ' - ' + dateParse.parseToYMD(item.repayment_end);
                        }
                        item.repayment_time = time_str;
                    });
                } else {
                    data = null;
                }
                $body.append( tpl({data: data}) );
                BasePage.bindNativeA();
                Widget.initWidgets();
            });
    });
};

