var $ = require('$');
var template = require('../template/payment.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var async = require('com/mobile/lib/async/async.js');
var BRANDS = require('../data/models.jjson');
var XicheAPI = require('../lib/xiche_api.js');
var HybridAPI = require('app/client/common/lib/api/index.js');
var BasePage = require('./base_page.js');
var Cookie = require('com/mobile/lib/cookie/cookie.js');

require('../style/style.jcss');
var series = {};
var payPrice;

// 是否使用红包余额，0不使用, 1使用
var useRedPackage = 0;

var businessCode = BasePage.getSearch().businessCode || '';

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

exports.init = function(config) {
    BasePage.init();

    if (config.payUrl) {
        window.location.href = config.payUrl;
    }

    var STANDARD_CODE = '1030991000007';
    config.productCode = config.productCode || STANDARD_CODE;

    var couponFlag = true;
    var redPacketFlag = true;

    if (config.brand && config.seriesId && BRANDS[config.brand]) {
        series = BRANDS[config.brand].seriesList[config.seriesId] || {};
    }

    async.auto({
        deviceInfo: function(next) {
            HybridAPI.invoke('getDeviceInfo')
                .done(function(deviceInfo) {
                    next(null, deviceInfo);
                })
                .fail(function(err) {
                    next(err);
                });
        },
        priceInfo: function(next) {
            if (String(config.productCode) === STANDARD_CODE && (config.price === 1 || config.price === 0)) {
                couponFlag = false;
                redPacketFlag = false;
            }

            XicheAPI.getPrice({
                    couponPuid: config.couponPuid || '',
                    useRedPackage: useRedPackage,
                    carNumber: config.province + config.carNumber,
                    carCategory: series.auto_type || '',
                    productCode: config.productCode,
                    businessCode: businessCode
                })
                .done(function(priceInfo) {
                    next(null, priceInfo);
                })
                .fail(function(err) {
                    next(err);
                });
        }
    }, function(err, result) {
        var $body = $('body');
        var priceInfo = result.priceInfo;
        var deviceInfo = result.deviceInfo;
        var customPayType = '';

        payPrice = priceInfo ? priceInfo.payAmount : config.price;

        if (BasePage.getSearch().ca_s === 'longhu') {
            if (config.price === 0) {
                customPayType = '千丁管家用户独享首单0元，无需支付';
            }
            if (deviceInfo.customerId === '1001') {
                deviceInfo.customerId = '1000';
                wxToAlipay = true;
            }
        }


        $body
            .removeClass('loading')
            .append(template({
                selectedDiscount: config.couponPuid ? 'coupon' : 'none',
                couponName: config.couponName,
                couponPrice: config.couponPrice,
                redPackageTotalAmount: priceInfo && priceInfo.accountInfo.redPackageTotalAmount,
                redPackageUsableAmount: priceInfo && priceInfo.accountInfo.redPackageUsableAmount,
                couponFlag: couponFlag,
                redPacketFlag: redPacketFlag,
                title: config.title,
                price: config.price,
                payAmount: payPrice,
                params: config,
                customPayType: customPayType,
                appId: deviceInfo.customerId
            }));

        Widget.initWidgets();

        BasePage.afterInitWidget();
    });
};

exports.main = Widget.define({
    events: {
        'click [data-role="back"]': 'back',
        'change [data-role="redPacket"]': 'selectRedPacket',
        'click [data-role="select"]': function(e) {
            var url = $(e.currentTarget).data('url');
            this.redirect(url);
        },
        'click [data-role="submit"]': 'submit'
    },
    init: function(config) {
        this.config = config;
    },
    back: function() {
        Util.redirect(
            (this.config.backUrl || 'app/client/app/xiche/pub_page/view/index.js') +
            '?' + $.param(this.config.params)
        );
    },
    redirect: function(url) {
        var params = this.config.params;

        Util.redirect(url +
            (url.indexOf('?') === -1 ? '?' : '&') + $.param(params));
    },
    selectRedPacket: function(e) {
        var $cur = $(e.currentTarget);
        var config = this.config;

        if ($cur.find('input').prop('checked')) {
            $('#red-packet-on-off')
                .removeClass('status-close')
                .addClass('status-open')
                .find('em')
                .text('开');
            $('.js-coupon-row').removeClass('active');
            $('.js-coupon').hide();
            $('.js-coupon-disable').show();

            var redPrice = $('.js-red-can-use').text();
            config.$discount.html('<em>优</em>惠：红包抵扣<b>' + redPrice + '</b>元');

            var params = config.params;
            useRedPackage = 1;

            XicheAPI.getPrice({
                    couponPuid: params.couponPuid || '',
                    useRedPackage: useRedPackage, // 是否使用红包余额，0不使用, 1使用
                    carNumber: params.province + params.carNumber,
                    carCategory: series.auto_type || '',
                    productCode: params.productCode,
                    businessCode: businessCode
                })
                .done(function(priceInfo) {
                    payPrice = priceInfo.payAmount;
                    config.$orderPrice.text(payPrice);
                })
                .fail(function(err) {
                    throw err;
                });
        } else {
            $('#red-packet-on-off')
                .removeClass('status-open')
                .addClass('status-close')
                .find('em')
                .text('关');
            $('.js-coupon-row').addClass('active');
            $('.js-coupon').hide();
            $('.js-coupon-enable').show();
            config.$discount.html('<em>优</em>惠：未使用');

            var params = config.params;
            useRedPackage = 0;

            XicheAPI.getPrice({
                    couponPuid: params.couponPuid || '',
                    useRedPackage: useRedPackage, // 是否使用红包余额，0不使用, 1使用
                    carNumber: params.province + params.carNumber,
                    carCategory: series.auto_type || '',
                    productCode: params.productCode,
                    businessCode: businessCode
                })
                .done(function(priceInfo) {
                    payPrice = priceInfo.payAmount;
                    config.$orderPrice.text(payPrice);
                })
                .fail(function(err) {
                    throw err;
                });
        }
    },
    submit: function() {
        var config = this.config;
        var params = config.params;

        XicheAPI.createNeeds({
            cityId: params.cityId,
            address: params.addressName,
            latlng: params.latlng,
            addressComment: params.addressComment,
            isWashInterior: params.isWashInterior,
            jobTime: params.jobTime,
            payPrice: payPrice,
            carNumber: params.province + params.carNumber,
            carCategory: series.auto_type || '',
            carColorId: params.colorId || '',
            carModelId: series.series_id || '',
            couponPuid: params.couponPuid || '',
            useRedPackage: useRedPackage,
            productCode: params.productCode,
            inviteCode: params.inviteCode,
            businessCode: businessCode,
            third_user_info: Cookie.get('third_user_info') || ''
        }, function(err, data) {
            var needData = data;
            if (err) {
                Util.toast(err.message, 1500);
                return;
            }

            if (data.amount === 0) {
                return Util.redirect('app/client/app/xiche/pub_page/view/order_list.js');
            }
            var payType = $('[name=pay-type]:checked').val();
            var isXmhy = false;
            if (payType === 'alipay') {
                if (BasePage.getSearch().ca_s === 'xmhy') {
                    isXmhy = true;
                }
            }
            XicheAPI.getThirdpartPayUrl({
                    orderId: data.order_id,
                    amount: data.amount,
                    payType: payType,
                    clientType: isXmhy ? 3 : 2
                })
                .done(function(data) {
                    if ($('[name=pay-type]:checked').val() === 'weixin') {
                        window.WeixinJSBridge.invoke(
                            'getBrandWCPayRequest',
                            JSON.parse(data.payUrl),
                            function(res) {
                                if (res.err_msg === 'get_brand_wcpay_request:ok') {
                                    Util.redirect('app/client/app/xiche/pub_page/view/order_list.js');
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
                                    Util.redirect('app/client/app/xiche/pub_page/view/order_detail.js?id=' + needData.needs_puid);
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
    }
});