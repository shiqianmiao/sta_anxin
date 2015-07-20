/**
 * @desc 抢单页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var OrderList = exports;
var cancelReason = '';
var ReasonTpl = '<ul class="why-list"><% if (reason){ %><% for(value in reason){ %><li class="per-why" data-value="<%= value %>"><span class="borR-50 boxSiz"></span><%= reason[value] %></li><% } %><% } %></ul>';

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
                if (data.error == 0) {
                    window.plugins.toast.showShortCenter('操作成功！', function(){}, function(){});
                    window.location.reload();
                } else {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
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

OrderList.remainTimer = function(param) {
    var $el = param.$el;
    var $timeShow = $el.find('span');
    var time = $el.data('time');
    time = parseInt(time);
    if (time > 86400) {
        $el.hide();
    }
    if (time > 0) {
        var timer = setInterval(function () {
            time--;
            var ts = time;//计算剩余的毫秒数
            var hh = parseInt(ts / 60 / 60, 10);//计算剩余的小时数
            var mm = parseInt(ts / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(ts % 60, 10);//计算剩余的秒数
            hh = checkTime(hh);
            mm = checkTime(mm);
            ss = checkTime(ss);
            $timeShow.html(hh + ':' + mm + ':' + ss);
            if (time <= 86400 && $el.is(':hidden')) {
                $el.show();
            }
        }, 1000);
        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }
};

OrderList.start = function(param) {
    Base.init(param);
    cancelReason = param.cancel_reason;
};
