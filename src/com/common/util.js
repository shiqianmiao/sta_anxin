var Util = exports;

//是否是闰年
Util.isLeapYear = function(year) {
    year = parseInt(year);
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        return true;
    } else {
        return false; 
    }
}

//获取本月的总天数
Util.getMonthDayNum = function(year, month) {
    year  = parseInt(year);
    month = parseInt(month);
    var isLeap = Util.isLeapYear(year);
    if (month == 4 || month == 6 || month == 9 || month == 11) {
        return 30;
    } else if (month == 2) {
        return isLeap ? 29 : 28;
    } else {
        return 31;
    }
};

Util.isTel = function(tel){
    var regx = /^1[34587]\d{9}$/;
    if (!regx.test(tel)) {
        return false;
    } else {
        return true;
    }
};

Util.isIdCard = function(idCard) {
    var regx = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (regx.test(idCard)) {
        return true;
    } else {
        return false;
    }
};