function DateParser() {
    this.date = new Date();
}
//转换成年月日
DateParser.prototype.parseToYMD = function(time, needFullyear) {
    if (typeof time === 'string') {
        time = parseInt(time, 10);
    }
    var date = new Date(time * 1000);
    var year = needFullyear? this.getYear(date) : this.getYear(date).toString().substring(2);
    return year + '/' + this.getMonth(date) + '/' + this.getDate(date);
};
//转成时分
DateParser.prototype.parseToHM = function(time) {
    if (typeof time === 'string') {
        time = parseInt(time, 10);
    }
    var date = new Date(time * 1000);
    return this.getHour(date) + ':' + this.getMin(date) ;
};
//转成时分
DateParser.prototype.parseToHMS = function(time) {

    if (typeof time === 'string') {
        time = parseInt(time, 10);
    }
    var date = new Date(time * 1000);
    return this.getHour(date) + ':' + this.getMin(date) + ':' + this.getSec(date) ;
};

//年
DateParser.prototype.getYear = function(date) {
    return date.getFullYear();
};

//月
DateParser.prototype.getMonth = function(date) {
    var month = date.getMonth() + 1;
    if (month >= 0 && month < 10) {
        month = '0' + month;
    }
    return month;
};

//日
DateParser.prototype.getDate = function(date) {
    var day = date.getDate();
    if (day >= 0 && day < 10) {
        day = '0' + day;
    }
    return day;
};
//时
DateParser.prototype.getHour = function(date) {
    var hour = date.getHours();
    if (hour >= 0 && hour < 10) {
        hour = '0' + hour;
    }
    return hour;
};
//分
DateParser.prototype.getMin = function(date) {
    var minute = date.getMinutes();
    if (minute >= 0 && minute < 10) {
        minute = '0' + minute;
    }
    return minute;
};
//秒
DateParser.prototype.getSec = function(date) {
    var second = date.getSeconds();
    if (second >= 0 && second < 10) {
        second = '0' + second;
    }
    return second;
};
//将 yyyy-mm-dd hh:mm:ss 转成 标准时间
DateParser.prototype.convertDateTime = function(date){

    var dateTime = date.split(' ');
    var mtDate = dateTime[0].split('/');
    var yyyy = mtDate[0];
    var mm = mtDate[1]-1;
    var dd = mtDate[2];

    var time = dateTime[1].split(':');
    var h = time[0];
    var m = time[1];
    var s = parseInt(time[2], 10); //get rid of that 00.0
    return new Date(yyyy,mm,dd,h,m,s);
};

module.exports = new DateParser();