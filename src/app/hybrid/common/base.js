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
