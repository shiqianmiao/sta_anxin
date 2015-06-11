/**
 * @desc 页面基类
 * @copyright (c) 2014 anxin Inc
 * @author 陈朝阳 <chenchaoyang@iyuesao.cn>
 * @since 2015-02-07
 */

// dependences
var $ = require('zepto');
var Base = require('app/hybrid/js/base.js');
var My = exports;
var module = '';

var dialog =
'<section class="popPrompt" id="deleteTime">' +
    '<section class="proMain">' +
        '<p class="proCont">确定退出当前账户？</p>' +
        '<p class="clearfix popBut"><a class="confirmPop" id="rest_ok" href="javascript:void(0);">确认</a><a id="rest_cancel" class="closePop" href="javascript:void(0);">取消</a></p>' +
    '</section>' +
    '<section class="proDown"></section>' +
'</section>';

My.cancel = function(config) {
    // var $elem = config.$el;
    // $elem.on('tap', function(){
    //     if ($('#deleteTime').length == 0) {
    //         $('body').append(dialog);
    //     } else {
    //         $('#deleteTime').show();
    //     }
    //     $('#rest_cancel').off('click').on('click', function(){
    //         $('#deleteTime').hide();
    //     });
    //     $('#rest_ok').off('click').on('click', function(){
    //         window.location.href = '/user/logout/';
    //     });
    // });
    //取消订单
        $(".cancel").on('touchend', function() {
            var self = this;
             //使用浮层,确定后再删除订单
            var orderId = $(this).data('order_id');
            if ($('#deleteTime').length == 0) {
                $('body').append(dialog);
            } else {
                $('#deleteTime').show();
            }
            $('#rest_cancel').off('click').on('click', function(){
                $('#deleteTime').hide();
            });
            $('#rest_ok').off('click').on('click', function(){
                $.ajax({
                    type : 'POST',
                    url : '/order/cancel',
                    data : {order_id : orderId},
                    dataType : 'json',
                    success : function(res) {
                        alert(res.msg);
                        $(self).parents(".orderInfo").remove();
                    },
                    error : function() {
                        alert('订单取消失败!');
                    }
                });
            });
        });

        //取消订单
        $(".stop").on('touchend', function() {
            var self = this;
            //使用浮层,确定后再删除订单
            var orderId = $(this).data('order_id');
            $.ajax({
                type : 'POST',
                url : '/order/stop',
                data : {order_id : orderId},
                dataType : 'json',
                success : function(res) {
                    alert(res.msg);
                    $(self).parents(".orderInfo").remove();
                },
                error : function() {
                    alert('订单终止失败!');
                }
            });
        });
};

My.start = function(param) {
    module = param.module ? '/' + param.module : '';
    Base.init(param);
}
