var $           = require('$');
var Widget      = require('com/mobile/lib/widget/widget.js');
var NativeAPI   = require('app/client/common/lib/native/native.js');
var Service     = require('app/client/app/fenqi/service/fenqi_api.js');
var BasePage    = require('app/client/app/fenqi/view/base_page.js');
var dateParse   = require('app/client/app/fenqi/util/date_parse.js');

var tpl         = require('app/client/app/fenqi/template/order/order_detail.tpl');
require('../style/style.css');

var $body       = $('body');

var User = BasePage.user;

exports.init = function (config) {
    $body.removeClass('loading');

    NativeAPI.invoke('updateTitle', {'text': '账单详情'} );

    User.getUserInfo(function (err, userInfo) {
        if (!userInfo) {
            $body.append( tpl({data : null}) );
            return;
        }
        Service.getOrderDetail(
            {
                user_id: userInfo.user_id,
                apply_no: config.apply_no
            },
            function (err, data) {
                if (data) {
                    var time_str = '';
                    if (parseInt(data.repayment_begin, 10)) {
                        time_str = dateParse.parseToYMD(data.repayment_begin);
                    }
                    if (parseInt(data.repayment_end, 10)) {
                        time_str += ' - ' + dateParse.parseToYMD(data.repayment_end);
                    }
                    data.repayment_time = time_str;
                    if (data.block_repayment) {
                        data.block_repayment.forEach(function (item) {

                            item.time_str = dateParse.parseToYMD(item.repayment_date);
                        });
                    }
                    if (data.block_order && data.block_order.ship_list) {
                        data.block_order.ship_list.forEach(function (item) {
                            item.time_str = dateParse.parseToYMD(item.create_time);
                            item.time_str += ' ' + dateParse.parseToHMS(item.create_time);
                        });
                    }
                }
                $body.append( tpl({data : data}) );
                BasePage.bindNativeA();
                Widget.initWidgets();
            });
    });
};

