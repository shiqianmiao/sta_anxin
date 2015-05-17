var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var myadAPI = require('app/client/app/myad/lib/myad_api.js');
var myadUtil = require('../lib/myad_util.js');
var Logger = require('app/client/common/lib/log/log.js');
Logger.setGjch('/client/app/myad/view/extension-buy.js');
var template = require('../template/extension-buy.tpl');
require('app/client/app/myad/style/coupons.jcss');
require('app/client/app/myad/style/touch_global.jcss');
var pageData = {};
var pageConfig = {};
var PAY_URL = 'app/pay/client/view/recharge.js';
var SUCCESS_URL = 'app/client/app/myad/view/extension-success.js';
var alert = myadUtil.alert;
var redirect = myadUtil.redirect;
var nativeApiSupport = NativeAPI.isSupport();
var pageTab;
var pageBack = true;
updateTitle('智能推广购买');
NativeAPI.registerHandler('back', function(params, callback){
    if (!pageBack) {
        callback(null, {preventDefault: 1});
    } else if (pageTab === 'couponList') {
        callback(null, {preventDefault: 1});
        hideCouponList();
    } else {
        callback(null, {preventDefault: 0});
    }
});
exports.init = function (config) {
    pageConfig = config;
    myadAPI.getPurchaseOption({
        puid : config.puid,
        code : config.code
    }, function(err, data){
        if (err) {
            $('body').removeClass('loading').addClass('nothing');
            return alert(err.message);
        }
        $.each(data.coupon_list, function(index, item){
            addCouponData(item);
        });
        pageData = data;
        var amount = pageData.user_balance > pageData.budget ? 0 : (pageData.budget - pageData.user_balance).toFixed(1);
        $('body').removeClass('loading').attr('class', 'balance fixed-area').append(template({
            data : data,
            amount : amount,
            couponText : getCouponText(data.coupon_list[0]),
            hideTitle : nativeApiSupport,
            code: config.code
        }));
        Widget.initWidgets();
    });
};
exports.form = Widget.define({
    events : {
        'click [data-role="back"]' : function(){
            window.history.back();
        },
        'click [data-role="coupon"]' : function(){
            showCouponList();
        },
        'click [data-role="couponBack"]' : function(){
            hideCouponList();
        },
        'click [data-role="cplist"]' : function(e){
            var $target = $(e.currentTarget);
            var $couponCheck = $target.find('.js-round');
            this.config.$couponCheck.removeClass('round_on');
            $couponCheck.addClass('round_on');
            var text;
            if ($target.hasClass('last')) {
                text = '';
            } else {
                text = getCouponText({
                    start_day : $couponCheck.data('start'),
                    end_time : $couponCheck.data('end'),
                    amount : $couponCheck.data('amount')
                });
            }
            this.config.$couponText.text(text);
        },
        'click [data-role="useCoupon"]' : function(){
            var self = this;
            var code;
            var $couponCheck = this.config.$couponCheck.filter('.round_on');
            if ($couponCheck.hasClass('input_coupon')) {
                code = this.config.$couponInput.val();
            } else {
                code = $couponCheck.data('code');
            }
            if (!code) {
                return alert('请输入优惠券码');
            }
            myadAPI.checkCouponValid({
                puid : pageConfig.puid,
                code : code
            }, function(err, data){
                if (err) {
                    return alert(err.message);
                }
                if (data.code) {
                    self.config.$couponText.text(getCouponText(addCouponData(data)));
                    self.config.$stickySubmit.data('code', data.code);
                    var text = (parseFloat(data.amount) * 10).toFixed(1) + '折';
                    text += (data.use_range_limit === '1') ? '账户型折扣券' : '订单型折扣券';
                    self.config.$voucher.text(text).show();
                    hideCouponList();
                } else {
                    alert('优惠券验证码有误');
                }
            });
        },
        'click [data-role="major"]' : function(e){
            var $target = $(e.currentTarget);
            var $jsRound = $target.find('.js-round');
            if ($jsRound.hasClass('round_on')) {
                return;
            }
            this.config.$major.find('.js-round').removeClass('round_on').addClass('round_default');
            $jsRound.addClass('round_on');
        },
        'click [data-role="city"]' : function(e){
            var $target = $(e.currentTarget);
            var $jsRound = $target.find('.js-round');
            if ($jsRound.hasClass('round_on')) {
                return;
            }
            this.config.$city.find('.js-round').removeClass('round_on').addClass('round_default');
            $jsRound.addClass('round_on');
        },
        'click [data-role="budget"]' : function(e){
            var $target = $(e.currentTarget);
            var val = parseInt($target.text(), 10);
            this.config.$budget.removeClass('bt-budget-on');
            $target.addClass('bt-budget-on');
            this.config.$budgetInput.val('');
            this.config.$payAmount.text(getAmount(pageData.user_balance, val));
            this.config.$renewBudget.text(val);
        },
        'focus [data-role="budgetInput"]' : function(){
            this.config.$budget.removeClass('bt-budget-on');
        },
        'keypress [data-role="budgetInput"]' : function(e){
            var $target = $(e.currentTarget);
            var val = $target.val();
            var reg = val.indexOf('.') > 0 ? /[0-9]/ : /[0-9\.]/;
            var key = String.fromCharCode(e.keyCode);
            if (!key.match(reg)){
                return false;
            }
        },
        'input [data-role="budgetInput"]' : function(e){
            var val = $(e.currentTarget).val();
            this.config.$payAmount.text(getAmount(pageData.user_balance, val));
            this.config.$renewBudget.text(val);
        },
        'click [data-role="autoRenew"]' : function(e){
            var $target = $(e.currentTarget);
            var $check = $target.find('.check');
            if ($check.hasClass('check-on')) {
                $check.removeClass('check-on');
            } else {
                $check.addClass('check-on');
            }
        },
        'click [data-role="stickySubmit"]' : function(){
            pageBack = false;
            Logger.send('paymentpage_confirmation_click');
            var budget = this.config.$budgetInput.val() || parseInt(this.config.$budget.filter('.bt-budget-on').data('amount'), 10);
            var data = {
                unit_price : this.config.$unitPrice.val(),
                budget : budget,
                puid : pageConfig.puid,
                coupon_code : this.config.$stickySubmit.data('code') || '',
                auto_renew : this.config.$autoRenew.find('.check').hasClass('check-on') ? 1 : 0,
                suggest_price : pageData.suggest_price
            };
            this.config.$stickySubmit.prop('disabled',true);
            if (pageData.is_modify) {
                myadAPI.updateOrder(
                    data,
                    function(err, data){
                        pageBack = true;
                        if (err) {
                            return alert(err.message);
                        } else if (data){
                            if (data.need_pay === 0) {
                                redirect(SUCCESS_URL + '?puid=' + pageConfig.puid);
                            } else {
                                redirect(PAY_URL + '?back_url=' + encodeURIComponent(window.location.href));
                            }
                        }
                    }
                );
            } else {
                data.cities = this.config.$city.find('.round_on').data('city');
                data.majors = this.config.$major.find('.round_on').data('major');
                myadAPI.purchase(
                    data,
                    function(err, data){
                        pageBack = true;
                        if (err) {
                            alert(err.message);
                        }
                        if (data.need_pay === 0) {
                            redirect(SUCCESS_URL + '?puid=' + pageConfig.puid);
                        } else {
                            redirect(PAY_URL + '?back_url=' + encodeURIComponent(window.location.href));
                        }
                    }
                );
            }
        }
    },
    init : function(config){
        this.config = config;
    }
});
function showCouponList() {
    pageTab = 'couponList';
    updateTitle('使用优惠券');
    $('#buy').hide();
    $('#coupon').show();
    //registerHandlerBack('couponList' ,1);
}
function hideCouponList(){
    pageTab = 'extensionBuy';
    updateTitle('智能推广购买');
    $('#buy').show();
    $('#coupon').hide();
    //registerHandlerBack(null ,1);
}
function getCouponText (coupon){
    var type = (coupon && coupon.use_range_limit === '1') ? '账户' : '订单';
    return coupon ? '使用后' + coupon.start_day + '天，本' + type + '发生的点击，计费均享受' + (coupon.amount * 10).toFixed(1) + '折优惠。本券需在' + coupon.end_time + '24点之前启用。优惠券最终解释权归赶集网所有。' : '';
}
function addCouponData(coupon){
    coupon.start_day = coupon.effect_duration / (60*60*24);
    var date = new Date(coupon.useful_life * 1000);
    coupon.end_time = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    return coupon;
}
function getAmount(balance, payAmount) {
    return payAmount > balance ? (payAmount - balance).toFixed(2) : 0;
}
function updateTitle(title){
    NativeAPI.invoke('updateTitle', {
        text : title
    });
}
/*function registerHandlerBack(tab, preventDefault){
    NativeAPI.registerHandler('back', function(params, callback){
        callback(null, {preventDefault: preventDefault});
        if (tab === 'couponList') {
            showCouponList();
        }
    });
}*/