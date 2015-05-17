var Widget = require('com/mobile/lib/widget/widget.js');
var $ = require('$');
var NativeAPI = require('app/client/common/lib/native/native.js');
var myadAPI = require('app/client/app/myad/lib/myad_api.js');
var myadUtil = require('../lib/myad_util.js');
var pageConfig;
var template = require('../template/extension-manage.tpl');
var alert = myadUtil.alert;
var CUSTOMER_URL = 'app/client/app/myad/view/extension-customer.js';
var BUY_URL = 'app/client/app/myad/view/extension-buy.js';
var alert = myadUtil.alert;
var redirect = myadUtil.redirect;
var nativeApiSupport = NativeAPI.isSupport();
require('app/client/app/myad/style/coupons.jcss');
require('app/client/app/myad/style/touch_global.jcss');
NativeAPI.invoke('updateTitle', {
    text : '智能推广管理'
});
exports.init = function (config) {
    pageConfig = config;
    myadAPI.getOrderDetail({
        puid : config.puid
    }, function(err, data){
        if (err) {
            $('body').removeClass('loading').addClass('nothing');
            return alert(err.message);
        }
        $('body').removeClass('loading').attr('class', 'balance fixed-area').append(template({
            data : data,
            hideTitle : nativeApiSupport
        }));
        Widget.initWidgets();
    });
};
exports.manage = Widget.define({
    events : {
        'click [data-role="back"]' : function(){
            window.history.back();
        },
        'click [data-role="link"]' : function(){
            redirect(BUY_URL  + '?puid=' + pageConfig.puid + '&code=' + pageConfig.code);
        },
        'click [data-role="linkCustomer"]' : function(){
            redirect(CUSTOMER_URL + '?puid=' + pageConfig.puid);
        },
        'click [data-role="changeStatus"]' : function(e){
            var $target = $(e.currentTarget);
            var status =  $target.data('status');
            if ($target.hasClass('disabled')) {
                return;
            } else {
                $target.addClass('disabled');
            }
            myadAPI.updateOrderStatus({
                puid : pageConfig.puid,
                status : status
            }, function(err){
                $target.removeClass('disabled');
                if (err) {
                    alert(err.message);
                }
                $target.data('status', $target.hasClass('active') ? 1 : 4);
                $target.toggleClass('active');
                if (parseInt($target.data('audit'), 10) === 0) {
                    redirect('app/pay/client/view/recharge.js');
                }
                window.location.reload();
            });
        }
    },
    init : function(config){
        this.config = config;
    }
});