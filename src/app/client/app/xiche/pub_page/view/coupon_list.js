var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');
var Util = require('app/client/common/lib/util/util.js');
var template = require('../template/coupon_list.tpl');
var XicheAPI = require('../lib/xiche_api.js');
var XicheUtil = require('../lib/util.js');
var BasePage = require('./base_page.js');

require('../style/style.jcss');

exports.init = function () {
    BasePage.init();

    XicheAPI.getCouponList({
        page_index: 0
    })
        .done(function (data) {
            $('body')
                .removeClass('loading')
                .append(template(data));

            Widget.initWidgets();

            BasePage.afterInitWidget();
        })
        .fail(function () {
            XicheUtil.redirectToLoginPage();
        });
};

exports.couponList = Widget.define({
    events: {
        'tap [data-role="redeemBtn"]': function () {
            var code = this.config.$input.val();

            if (!code) {
                Util.toast('请输入兑换码！');
                return;
            }

            this.redeem(code);
        }
    },
    init: function (config) {
        var self = this;

        // init 里面取了第一页的，这里从第二页开始
        this.page = 1;
        this.config = config;

        $(window).on('scroll', function () {
            var top;
            if (self.loading) {
                return;
            }
            top = $(window).scrollTop();

            if (document.body.scrollHeight - $('body').height() - top < 50) {
                self.loadMore();
            }
        });
    },
    addCoupon: function (coupon, op) {
        var self = this;
        require.async('../template/coupon_list_item.tpl', function (tpl) {
            self.config.$list[op || 'prepend'](tpl({
                coupon: coupon
            }));
        });
    },
    updateTotalPrice: function (price) {
        this.config.$totalPrice.text(price);
    },
    redeem: function (code) {
        var self = this;
        XicheAPI.redeemCoupon({
            couponCode: code
        })
            .done(function (data) {
                self.addCoupon(data.special);
                self.updateTotalPrice(data.total_special);
                self.config.$input.val('');
                Util.toast('兑换成功');
            })
            .fail(function (err) {
                Util.toast(err ? err.message : '兑换失败，请检查兑换码');
            });
    },
    loadMore: function () {
        var self = this;
        if (this.loading) {
            return;
        }

        Util.toast('加载中...', 1000);
        this.loading = true;

        XicheAPI.getCouponList({
            page_index: this.page++
        })
            .done(function (data) {
                if (!data.list || !data.list.length) {
                    Util.toast('加载完毕');
                    return;
                }

                self.loading = false;
                data.list.forEach(function (coupon) {
                    self.addCoupon(coupon, 'append');
                });
            })
            .fail(function () {
                Util.toast('网络异常，请稍后再试');
            });
    }
});
