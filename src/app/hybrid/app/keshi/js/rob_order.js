/**
 * @desc 抢单页面
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Base = require('app/hybrid/common/base.js');
var OrderTpl = require('app/hybrid/app/keshi/tpl/rob_order.tpl');
var Widget = require('com/mobile/lib/widget/widget.js');
var Halert = require('com/mobile/widget/Halert2/js/Halert.js');

var RobOrder = exports;

RobOrder.order = function(config) {
    var $el = config.$el;
    var $timeShow = $el.find('.remaining-time');
    var $robButton = $el.find('.rob-btn');
    var orderId = $el.data('id');
    var time = $el.data('remain');
    var $orderList = $('#js_order_list ');
    if (time > 0) {
        var timer = setInterval(function () {
            time--;
            if (time < 0) {
                clearInterval(timer);
                $el.remove();
                if ($orderList.children().length) {
                    $('#no_order').show();
                }
            }
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

    var halert = new Halert({
        content : '延伸护理接单需要完整的个人信息，这样能给人亲切感和可信度，现在就去个人中心完善吧!',
        confirmBtnContent : '去完善',
        cancelBtnContent : '以后再说',
        confirmBtnCallback : function(self){
            location.href = '/my/info/';
        }
    });

    $robButton.tap(function(){
        var $this  = $(this);
        var robbed = $this.data('robbed');
        $.ajax({
            type : 'post',
            url  : '/rob/ajaxRob/',
            data : {order_id : orderId, robbed : robbed},
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    $this.html(data.data.btn_text);
                    $this.data('robbed', data.data.robbed);
                    var msg = robbed ? '操作成功！' : '您已成功参与抢单，请耐心等候客户决定';
                    window.plugins.toast.showShortCenter(msg, function(){}, function(){});
                } else if (data.errorCode == 2){
                    halert.show();
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
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
        url  : '/rob/ajaxGetPost/',
        data : {},
        dataType : 'json',
        success : function(data) {
            if (data.errorCode == 0) {
                if (data.data.order_list.length > 0) {
                    $('#no_order').hide();
                    var html = OrderTpl(data.data);
                    $('#js_order_list').html(html);
                    //将取到的数据写入localstorage
                    localStorage.rob_order = JSON.stringify(data.data);
                    Base.bindDomWidget($('#js_order_list'));
                } else {
                    localStorage.removeItem('rob_order');
                    $('#js_order_list').html('');
                    $('#no_order').show();
                }
            } else if (data.errorMessage) {
                window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
            } else {
                window.plugins.toast.showShortCenter('未知错误，请重试！', function(){}, function(){});
            }
        },
        error : function() {}
    });
};

//显示静态地图
RobOrder.showMap = function(config){
    var $el = config.$el;
    lon = $el.data('lon');
    lat = $el.data('lat');
    // 百度静态地图
    var $mapImg = $el.find('#baidu-map-img');
    // 计算地图宽度
    var wrapWidth = parseInt($('.rob-order-det-wrap').width());
    var srcStr = 'http://api.map.baidu.com/staticimage?center=' + lon + ',' + lat + '&width=' + wrapWidth + '&height=154&zoom=15&markers=' + lon + ',' + lat;
    $mapImg.attr("src", srcStr);
    $mapImg.attr("width", wrapWidth);
    $mapImg.attr("height", 154);
};

RobOrder.orderDetail = function(config) {
    var $el  = $('.remaining-time');
    var time = $el.data('remain');
    var $timeShow = $el.find('span');
    var orderId = $el.data('id');
    var robbed  = $el.data('robbed');
    if (time > 0) {
        var timer = setInterval(function () {
            if (time < 0) {
                clearInterval(timer);
            }
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

    var halert = new Halert({
        content : '延伸护理接单需要完整的个人信息，这样能给人亲切感和可信度，现在就去个人中心完善吧!',
        confirmBtnContent : '去完善',
        cancelBtnContent : '以后再说',
        confirmBtnCallback : function(self){
            location.href = '/my/info/';
        }
    });

    $('.js_rob').tap(function(){
        var $this  = $(this);
        var robbed = $this.data('robbed');
        $.ajax({
            type : 'post',
            url  : '/rob/ajaxRob/',
            data : {order_id : orderId, robbed : robbed},
            dataType : 'json',
            success : function(data) {
                if (data.errorCode == 0) {
                    $this.html(data.data.btn_text);
                    $this.data('robbed', data.data.robbed);
                    window.plugins.toast.showShortCenter('抢单成功！', function(){}, function(){});
                } else if (data.errorCode == 2) {
                    halert.show();
                } else if (data.errorMessage) {
                    window.plugins.toast.showShortCenter(data.errorMessage, function(){}, function(){});
                } else {
                    window.plugins.toast.showShortCenter('未知错误，请重试！', function(){}, function(){});
                }
            },
            error : function() {}
        });
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
