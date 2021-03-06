/**
 * @desc 抢单页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var OrderTpl = require('app/hybrid/app/nurse/tpl/rob_order.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');

var RobOrder = exports;

RobOrder.order = function(config) {
    var $el = config.$el;
    var $timeShow = $el.find('.remaining-time');
    var $robButton = $el.find('.rob-btn');
    var orderId = $el.data('id');
    var time = $el.data('remain');
    if (time > 0) {
        var timer = setInterval(function () {
            time--;
            var ts = time;//计算剩余的毫秒数
            var hh = parseInt(ts / 60 / 60 % 24, 10);//计算剩余的小时数
            var mm = parseInt(ts / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(ts % 60, 10);//计算剩余的秒数
            hh = checkTime(hh);
            mm = checkTime(mm);
            ss = checkTime(ss);
            $timeShow.html(hh + ':' + mm + ':' + ss);
        }, 1000);
        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }
    $robButton.tap(function(){
        var $this  = $(this);
        var robbed = $this.data('robbed');
        $.ajax({
            type : 'post',
            url  : '/index/ajaxRob/',
            data : {order_id : orderId, robbed : robbed},
            dataType : 'json',
            success : function(data) {
                if (data.error == 0) {
                    $this.html(data.btn_text);
                    $this.data('robbed', data.robbed);
                    var msg = robbed ? '取消抢单成功！' : '抢单成功！';
                    window.plugins.toast.showShortCenter(msg, function(){}, function(){});
                } else if (data.msg) {
                    window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('未知错误，请重试！', function(){}, function(){});
                }
            },
            error : function() {}
        });
    });
};

//异步获取抢单数据
RobOrder.getPost = function() {
    $.ajax({
        type : 'post',
        url  : '/index/ajaxGetPost/',
        data : {},
        dataType : 'json',
        success : function(data) {
            if (data.error == 0) {
                if (data.order_list) {
                    if (data.order_list.length > 0) {
                        $('#no_order').hide();
                        var html = OrderTpl(data);
                        $('#js_order_list').html(html);
                        //将取到的数据写入localstorage
                        localStorage.rob_order = JSON.stringify(data);
                        Widget.initWidgets();
                    } else {
                        localStorage.rob_order = JSON.stringify(data);
                        $('#js_order_list').html('');
                        $('#no_order').show();
                    }
                }
            } else if (data.msg) {
                window.plugins.toast.showShortCenter(data.msg, function(){}, function(){});
            } else {
                window.plugins.toast.showShortCenter('未知错误，请重试！', function(){}, function(){});
            }
        },
        error : function() {}
    });
};

RobOrder.start = function(param) {
    //从localstorage 读取数据，实现页面快速展示
    if (localStorage.rob_order) {
        var data = JSON.parse(localStorage.rob_order);
        var html = OrderTpl(data);
        $('#js_order_list').html(html);
    }
    RobOrder.getPost();
    Base.init(param);
};
