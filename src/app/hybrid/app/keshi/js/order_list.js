/**
 * @desc 抢单页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var Hscroll   = require('widget/Hscroll/js/Hscroll2.js');
var OrderTpl  = require('app/hybrid/app/keshi/tpl/order_list.tpl');
var Widget    = require('com/mobile/lib/widget/widget.js');
var OrderList = exports;

OrderList.order = function(config) {
    var $el = config.$el;
    var $button = $el.find('.js_button');
    var orderId = $el.data('id');
    $button.tap(function(){
        var opType = $(this).data('op');
        //go,start,pay,cancel
        if (opType == 'cancel') {
            // 点击取消订单，弹出窗口
            $('#cancle-window').removeClass('hide-win');
            // 点击取消按钮
            $('.close-why-win').on('tap', function(){
                $('#cancle-window').addClass('hide-win');
                $('.close-why-win').off('tap');
                $('.per-why').off('tap');
                // 还原选项
                $('.per-why').removeClass('active');
                $('.per-why').eq(0).addClass('active');
                $('.why-text').val('');
                $('.why-text').hide();
            });
            // 点击选项
            $('.per-why').on('tap', function(){
                $('.per-why').removeClass('active');
                $(this).addClass('active');
                if ($(this).data('value') == $('.per-why:last').data('value')) {
                    $('.why-text').show();
                } else {
                    $('.why-text').hide();
                }
            });
            $('#cancle-window .js_ok').off('tap').on('tap', function() {
                var reason = $('.why-list li.active').data('value');
                if (!reason) {
                    return false;
                }
                var reasonDetail = $('.why-text').val();
                if (parseInt(reason) >= 0) {
                    sendAjax(orderId, 'cancel', reason, reasonDetail);
                }
            });
        } else if (opType == 'pay') {
            alertPayWin();
            $('#pay-window .js_ok').off('tap').on('tap', function() {
                opType = $('#pay-window .active').data('op');
                sendAjax(orderId, opType);
            });
        } else {
            sendAjax(orderId, opType);
        }

    });
    var isSubmit = false;
    function sendAjax(orderId, type, reason, reasonDetail) {
        if (isSubmit) {
            return false;
        }
        isSubmit = true;
        $.ajax({
            type : 'POST',
            url : '/order/ajaxChangeOrder/',
            data : {orderId : orderId, type : type, reason : reason, detail_reason : reasonDetail},
            dataType : 'json',
            success : function(data) {
                if (data.data.errorCode == 0) {
                    window.plugins.toast.showShortCenter('操作成功！', function(){}, function(){});
                    window.location.reload();
                } else {
                    window.plugins.toast.showShortCenter(data.data.errorMessage, function(){}, function(){});
                }
                isSubmit = false;
            },
            error : function(data) {
                window.plugins.toast.showShortCenter('服务器错误！', function(){}, function(){});
                isSubmit = false;
            }
        });
    }
    // 显示支付弹窗
    function alertPayWin(){
        $('#pay-window').removeClass('hide-win');
        // 点击支付方式
        $('.pay-way').on('tap', function(){
            $('.pay-way').removeClass('active');
            $(this).addClass('active');
        });
        // 点击取消按钮
        $('.cancle-pay').on('tap', function(){
            $('#pay-window').addClass('hide-win');
            $('.cancle-pay').off('tap');
            $('.pay-way').off('tap');
        });
    }
};

OrderList.getPost = function(config){
    var $el = config.$el;
    var $noOrder = $('#no_order');
    var storageKey = 'my_order';
    var page = 1;
    //从localStorage读取数据
    if (localStorage[storageKey]) {
        var data = JSON.parse(localStorage[storageKey]);
        var html = OrderTpl(data);
        $el.html(html);
    }
    //下拉刷新
    var hscroll = new Hscroll({
        loadMoreCallback : function(self){
            getPost(function(data){
                if (data.order_list.length > 0) {
                    var html = OrderTpl(data);
                    $el.append(html);
                    Base.bindDomWidget($el);
                }
                if (!data.has_more) {
                    hscroll.changeTypeTo('none');
                }
                page = data.page;
                self.loadMoreEnd();
            });
        },
        // 选择您需要的加载类型【只要下拉刷新 - onlyTop 】【只要上拉加载更多 - onlyBottom 】【两个都要 - double 】【都不要 - none 】
        opationType : 'onlyBottom'
    });

    //获取初始订单
    getPost(function(data){
        if (data.order_list) {
            if (data.order_list.length > 0) {
                localStorage[storageKey] = JSON.stringify(data);
                $noOrder.hide();
                var html = OrderTpl(data);
                $el.html(html);
                Base.bindDomWidget($el);
            } else {
                localStorage.removeItem(storageKey);
                $el.html('');
                $noOrder.show();
            }
            page = data.page;
        }
        if (!data.has_more) {
            hscroll.changeTypeTo('none');
        }
    });

    var isSend = false;
    function getPost(success, error) {
        if (isSend) {
            return false;
        }
        isSend = true;
        $.ajax({
            type : 'post',
            url  : "/order/ajaxGetOrder/",
            data : {page : page},
            dataType : 'json',
            success  : function(data) {
                if (data.errorCode == 0) {
                    success(data.data);
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('未知错误，请重试', function(){}, function(){});
                }
                isSend = false;
            },
            error : function(data) {
                error(data);
                isSend = false;
            }
        });
    }
};

OrderList.start = function(param) {
    Base.init(param);
};
