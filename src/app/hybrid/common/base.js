/**
 * @desc 页面基类
 * @copyright (c) 2015 anxin Inc
 * @author 陈朝阳 <chenchaoyang@anxin365.com>
 * @since 2015-06-15
 */

// dependences
var $ = require('$');
var Widget = require('com/mobile/lib/widget/widget.js');

// public
var Base = exports;

//Base.log = Log;

Base.init = function (param) {
    Widget.initWidgets();
    //关闭app启动图
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 1000);
};

//对widget.initWidget的封装，用户绑定异步载入元素的widget
Base.bindDomWidget = function($el) {
    if ($el.length > 1) {
        $el.each(function(){
            $(this).find('[data-widget]').each(function () {
                Widget.initWidget($(this));
            });
        })
    } else {
        $el.find('[data-widget]').each(function () {
            Widget.initWidget($(this));
        });
    }
};
