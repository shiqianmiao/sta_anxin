/**
 * @desc 详情页 评价反馈
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-11-29
 */

var $ = require('zepto');
var Widget = require('lib/widget/widget.js');
var CalendarTpl = require('app/common/calendar.tpl');

//全天休息
var REST_DAY  = 1;
//上午休息
var REST_AM   = 2;
//下午休息
var REST_PM   = 3;
//工作中
var IN_WORK   = 4;

var curDate = new Date();

var Config = {
    el : null,
    currentYear  : curDate.getFullYear(),
    currentMonth : curDate.getMonth(),
    currentDay   : curDate.getDate(),
    restDate     : {},
    startDate    : 0,
    endDate      : 0,
    onDaySelect  : function(){}
};

var Calendar  = function (config) {

    if (!(this instanceof Calendar)) return new Calendar(config);

    this.init(config).createDom();
};


var proto = Calendar.prototype = {};

proto.constructor = Calendar;

proto.init = function (config) {

    this.config = config = $.extend(Config, config);

    this.$el = $(config.el);

    if (this.$el.size() === 0) {
        throw new Error('el参数不可以为空');
    }
    return this;
};

proto.createDom = function () {

    var config = this.config;
    var $el = this.$el;
    this.year = config.currentYear;
    this.month = config.currentMonth;
    this.day = config.currentDay;
    this.$calendar = $(CalendarTpl({
        year  : this.year,
        month : this.month,
    }));
    this.$yearInput  = this.$calendar.find('.js_year');
    this.$monthInput = this.$calendar.find('.js_month');
    this.$preMonth = this.$calendar.find('.js_pre_month');
    this.$nextMonth = this.$calendar.find('.js_next_month');
    this.$calendarBody = this.$calendar.find('tbody');
    this.$calendarBody.html(this._getBodyHtml(this.year, this.month, this.day));
    $el.html(this.$calendar);
    this.bindEvent();
    return this;
};

proto.bindEvent = function() {
    var me = this;
    this.$preMonth.on('tap', function(){
        me.preMonth();
    });
    this.$nextMonth.on('tap', function(){
        me.nextMonth();
    });
};

proto.preMonth = function () {
    if (this.month - 1 < 1)  {
        this.month = 12;
        this.year  = this.year - 1;
    } else {
        this.month = this.month - 1;
    }
    this.$yearInput.val(this.year);
    this.$monthInput.val(this.month);
    this.$calendarBody.html(this._getBodyHtml(this.year, this.month, this.day));
    return this;
};

proto.nextMonth = function () {
    if (this.month + 1 > 12)  {
        this.month = 1;
        this.year  = this.year + 1;
    } else {
        this.month = this.month + 1;
    }
    this.$yearInput.val(this.year);
    this.$monthInput.val(this.month);
    this.$calendarBody.html(this._getBodyHtml(this.year, this.month, this.day));
    return this;
};

proto._getBodyHtml = function(year, month, day) {
    var date = new Date();
    date.setFullYear(year, month-1, 1);
    //本月的第一天是周几
    var firstDayNum = date.getDay();
    //本月总天数
    var dayCount  = this._getMonthDayNum(year, month);
    //本月包含的星期数
    var weekCount = Math.ceil((firstDayNum + dayCount) / 7);

    var weekHtml = '';
    for (var i = 0; i < weekCount; i++) {
        weekHtml +=
        '<tr><td align="center" valign="middle"></td><td align="center" valign="middle"></td><td align="center" valign="middle"></td><td align="center" valign="middle"></td><td align="center" valign="middle"></td><td align="center" valign="middle"></td><td align="center" valign="middle"></td></tr>';
    }
    if (weekHtml) {
        var $weekHtml = $(weekHtml);
        var $weekTd = $weekHtml.find('td');
        var workStatus = 0;
        for (var i = 0; i < dayCount; i++) {
            $($weekTd[firstDayNum + i]).html(i + 1);
            workStatus = this._getWorkStatus(year, month, i + 1);
            if (workStatus == IN_WORK) {
                $($weekTd[firstDayNum + i]).addClass('working');
            } else if (workStatus == REST_DAY) {
                $($weekTd[firstDayNum + i]).addClass('rest');
            } else if (workStatus == REST_AM) {
                $($weekTd[firstDayNum + i]).addClass('restUp');
            } else if (workStatus == REST_PM) {
                $($weekTd[firstDayNum + i]).addClass('restDown');
            }
        }
    }
    return $weekHtml;
};

//获取本月的总天数
proto._getMonthDayNum = function(year, month) {
    year  = parseInt(year);
    month = parseInt(month);
    var isLeap = this._isLeapYear(year);
    if (month == 4 || month == 6 || month == 9 || month == 11) {
        return 30;
    } else if (month == 2) {
        return isLeap ? 29 : 28;
    } else {
        return 31;
    }
};

//是否是闰年
proto._isLeapYear = function(year) {
    year = parseInt(year);
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        return true;
    } else {
        return false; 
    }
}

//取工作状态
proto._getWorkStatus = function(year, month, day) {
    var date = new Date(year + '/' + month + '/' + day + ' 00:00');
    var timeStamp = (date.getTime()) / 1000;
    var startDate = this.config.startDate;
    var endDate   = this.config.endDate;
    var restDate  = this.config.restDate;
    //当前时间是否在服务始末时间内
    var inWorkDate = (timeStamp >= startDate && timeStamp <= endDate || timeStamp <= startDate && (startDate - timeStamp) < 3600 * 24);
    if (inWorkDate && restDate[timeStamp] && restDate[timeStamp] == REST_DAY) {
        return REST_DAY;
    } else if (inWorkDate && restDate[timeStamp] && restDate[timeStamp] == REST_AM) {
        return REST_AM;
    } else if (inWorkDate && restDate[timeStamp] && restDate[timeStamp] == REST_PM) {
        return REST_PM;
    } else if (inWorkDate) {
        return IN_WORK;
    } else {
        return 0;
    }
};
module.exports = Calendar;

