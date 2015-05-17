require('app/client/app/finance/style/loan.jcss');
var template = require('../template/manage_edit.tpl');
var $ = require('$');
var HybridAPI = require('app/client/common/lib/api/index.js');
var Util = require('app/client/common/lib/util/util.js');
// var HTTPApi = require('app/client/common/lib/mobds/http_api.js');
var Widget = require('com/mobile/lib/widget/widget.js');


exports.init = function(config) {
    HybridAPI.invoke('getUserInfo', null, function(err, userInfo) {
        if (!userInfo) {
            // 去登录页
            var url = 'app/client/common/view/account/login.js?back_url=' + encodeURIComponent('app/client/app/finance/controller/landing.js') + '&target_url=' + encodeURIComponent(window.location.hash.slice(1));
            Util.redirect(url);
        } else {

            $('body')
                .removeClass('loading')
                .append(template({
                    user_id: userInfo.user_id,
                    case_id: config.case_id
                }));

            $('#validatorConfig2').data('config', {
                send_loan_time: {
                    rules: [
                        ['required', true, '忘记选择放款日期啦']
                    ]
                },
                send_loan_money: {
                    rules: [
                        ['required', true, '忘记填写放款金额啦'],
                        ['regexp', '\\d+', '要填写数字哦'],
                        ['min', 1, '放款金额不能小于1'],
                        ['max', 10000, '放款金额不能大于10000']
                    ]
                },
                send_loan_count: {
                    rules: [
                        ['required', true, '忘记填写放款期数啦'],
                        ['regexp', '\\d+', '要填写数字哦'],
                        ['min', 1, '放款期数不能小于1'],
                        ['max', 360, '放款期数不能大于360']
                    ]
                }
            });

            $('#validatorConfig1').data('config', {
                allow_loan_time: {
                    rules: [
                        ['required', true, '忘记选择通过日期啦']
                    ]
                },
                allow_loan_money: {
                    rules: [
                        ['required', true, '忘记填写通过金额啦'],
                        ['regexp', '\\d+', '要填写数字哦'],
                        ['min', 1, '通过金额不能小于1'],
                        ['max', 10000, '通过金额不能大于10000']
                    ]
                },
                allow_loan_count: {
                    rules: [
                        ['required', true, '忘记填写通过期数啦'],
                        ['regexp', '\\d+', '要填写数字哦'],
                        ['min', 1, '通过期数不能小于1'],
                        ['max', 360, '通过期数不能大于360']
                    ]
                }
            });

            $('body').css('height', $(window).height());
            Widget.initWidgets();
        }
    });
};