var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var HybridAPI = require('app/client/common/lib/api/index.js');
var XicheAPI = require('../lib/xiche_api.js');
var template = require('../template/choose_payment.tpl');
var pageConfig = {};
var BasePage = require('./base_page.js');

require('../style/style.jcss');

var wxToAlipay = false;

// 小米黄页api
function callNative(fn) {
    (function(e) {
        var t = 'MiuiYellowPageApi',
            n = function(t) {
                e(t);
            },
            r = window,
            i = r[t];
        i ? n(i) : document.addEventListener('yellowpageApiReady', function() {
            setTimeout(function() {
                n(r[t]);
            }, 1);
        });
    })
    (function(api) {
        fn(api);
    });
}
var initConfig = {};

exports.init = function(config) {
    BasePage.init();

    initConfig = config;

    if (config.payUrl) {
        window.location.href = config.payUrl;
    }

    pageConfig = config;
    var $body = $('body');

    HybridAPI.invoke('getDeviceInfo')
        .done(function(deviceInfo) {
            if (BasePage.getSearch().ca_s === 'longhu') {
                if (deviceInfo.customerId === '1001') {
                    deviceInfo.customerId = '1000';
                    wxToAlipay = true;
                }
            }

            $body
                .removeClass('loading')
                .append(template({
                    orderId: config.order_id,
                    amount: config.amount,
                    puid: config.puid,
                    appId: deviceInfo.customerId
                }));

            Widget.initWidgets();

            BasePage.afterInitWidget();
        })
        .fail(function() {
            $body
                .removeClass('loading')
                .addClass('offline');
        });

};
exports.form = function(config) {
    config.$submit.on('click', function() {
        var form = config.$el.serializeObject();
        var isXmhy = false;
        if (form.payType === 'alipay') {
            if (BasePage.getSearch().ca_s === 'xmhy') {
                isXmhy = true;
                form.clientType = 3;
            }
        }
        XicheAPI.getThirdpartPayUrl(form)
            .done(function(data) {
                if ($('[name=payType]:checked').val() === 'weixin') {
                    window.WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        JSON.parse(data.payUrl),
                        function(res) {
                            if (res.err_msg === 'get_brand_wcpay_request:ok') {
                                Util.redirect('app/client/app/xiche/pub_page/view/order_detail.js?id=' + pageConfig.order_id);
                            } else if (res.err_msg !== 'get_brand_wcpay_request:cancel') {
                                window.alert('出错啦！');
                            }
                        }
                    );
                } else {
                    if (isXmhy) {
                        callNative(function(api) {
                            if (!api.call('isAliMSPayExist')) {
                                return;
                            }
                            var params = {
                                orderInfo: data.payUrl
                            };
                            api.callAsync('startAliMSPay', params, function() {
                                Util.redirect('app/client/app/xiche/pub_page/view/order_detail.js?id=' + initConfig.puid);
                            });
                        });
                    } else if (wxToAlipay) {
                        $('.qd-mask').show();
                        window.location.href = window.location.href + '&payUrl=' + encodeURIComponent(data.payUrl);
                    } else {
                        window.location.href = data.payUrl;
                    }
                }
            })
            .fail(function(err) {
                Util.toast(err.message || '网络异常，请稍后再试', 1500);
            });
    });
};