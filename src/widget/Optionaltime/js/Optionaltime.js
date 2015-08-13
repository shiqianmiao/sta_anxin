/**
 * @desc 可选时间组件
 * @copyright (c) 2015 anxin Inc
 * @author 霍春阳 <huochunyang@anxin365.com>
 * @since 2015-04-29
 */

var $ = require('zepto');

var Optionaltime = function(opations){

	return new Optionaltime.fn.init(opations);

}

var noopJson = {
	year : 0,
	month : 0,
	day : 0,
	hour : 0,
	min : 0,
	sec : 0
};

Optionaltime.fn = Optionaltime.prototype;

$.extend(Optionaltime.fn, {
	constructor : Optionaltime,
	/** 
	 * @desc 初始化
	 * @param (String) startTime : 起始时间（例如："2015-04-29 12:34:08"）
	 * @param (String) endTime : 结束时间（例如："2016-04-29 12:34:08"）
	 */
	init : function(opations){

		this.settings = {
			startTime : 0,
			endTime : 0
		};

		$.extend(this.settings, opations);

		if(this.settings.startTime && this.settings.endTime && Date.parse(this.settings.startTime) >= Date.parse(this.settings.endTime)){
			throw new Error('起始时间必须小于终止时间,参数不对');
		}

		this.startTimeJson = this.settings.startTime ? this.parseTimeStr(this.settings.startTime) : noopJson;
		this.endTimeJson = this.settings.endTime ? this.parseTimeStr(this.settings.endTime) : noopJson;
    
	},
	/** 
	 * @desc 获取可用的年份
	 * @return (Object-json) {min,max}
	 */
	getYear : function(){
		var config = this.settings,
			st = config.startTime,
			et = config.endTime,
			sTJ = this.startTimeJson,
			eTJ = this.endTimeJson;
		if(st && et){
			return {
				min : sTJ.year,
				max : eTJ.year
			}
		}else if(!st && et){
			return {
				min : 0,
				max : eTJ.year
			}
		}else if(st && !et){
			return {
				min : sTJ.year,
				max : 0
			}
		}
	},
	/** 
	 * @desc 根据年份，获取可用的月份
	 * @param (number) year : 四位年份
	 * @return (Object-json) {min,max}
	 */
	getMonth : function(year){
		var available_year = this.getYear(),
			sTJ = this.startTimeJson,
			eTJ = this.endTimeJson;

		if(!year){
			throw new Error('传入四位年份作为参数');
		}

		if(year >= available_year.min && year <= available_year.max){
			if(year == available_year.min && year != available_year.max){
				return {
					min : sTJ.month,
					max : 12
				}
			}else if(year == available_year.max && year != available_year.min){
				return {
					min : 1,
					max : eTJ.month
				}
			}else if(year == available_year.max && year == available_year.min){
				return {
					min : sTJ.month,
					max : eTJ.month
				}
			}else{
				return {
					min : 1,
					max : 12
				}
			}
		}else{
			throw new Error('传入的年份不在可选的范围内');
		}
	},
	/** 
	 * @desc 根据年份,月份，获取可用的天
	 * @param (number) year : 四位年份
	 * @param (number) month : 月份
	 * @return (Object-json) {min,max}
	 */
	getDay : function(year, month){
		var available_year = this.getYear(),
			sTJ = this.startTimeJson,
			eTJ = this.endTimeJson;

		if(year >= available_year.min && year <= available_year.max){
			var available_month = this.getMonth(year);
			if(month >= available_month.min && month <= available_month.max){
				//console.log(this.getDaysInMonth(year, month));
				var curDays = this.getDaysInMonth(year, month);
				if(year == sTJ.year && month == sTJ.month){
					return {
						min : sTJ.day,
						max : curDays
					}
				}else if(year == eTJ.year && month == eTJ.month){
					return {
						min : 1,
						max : eTJ.day
					}
				}else{
					return {
						min : 1,
						max : curDays
					}
				}

			}else{
				throw new Error('传入的月份不在可选的范围内');
			}
		}else{
			throw new Error('传入的年份不在可选的范围内');
		}
	},
	/** 
	 * @desc 根据年份,月份,日, 获取可用的小时
	 * @param (number) year : 四位年份
	 * @param (number) month : 月份
	 * @param (number) day : 天
	 * @return (Object-json) {min,max}
	 */
	getHour : function(year, month, day){
		var available_year = this.getYear(),
			sTJ = this.startTimeJson,
			eTJ = this.endTimeJson;
		if(year >= available_year.min && year <= available_year.max){
			var available_month = this.getMonth(year);
			if(month >= available_month.min && month <= available_month.max){
				var available_day = this.getDay(year, month);
				if(day >= available_day.min && day <= available_day.max){
					
					if(year == sTJ.year && month == sTJ.month && day == sTJ.day){
						return {
							min : sTJ.hour,
							max : 23
						}
					}else if(year == eTJ.year && month == eTJ.month && day == eTJ.day){
						return {
							min : 0,
							max : eTJ.hour
						}
					}else{
						return {
							min : 0,
							max : 23
						}
					}

				}else{
					throw new Error('传入的天不在可选的范围内');
				}
			}else{
				throw new Error('传入的月份不在可选的范围内');
			}
		}else{
			throw new Error('传入的年份不在可选的范围内');
		}
	},
	/** 
	 * @desc 根据年份,月份,日,小时， 获取可用的分钟
	 * @param (number) year : 四位年份
	 * @param (number) month : 月份
	 * @param (number) day : 天
	 * @param (number) hour : 小时
	 * @return (Object-json) {min,max}
	 */
	getMin : function(year, month, day, hour){
		var available_year = this.getYear(),
			sTJ = this.startTimeJson,
			eTJ = this.endTimeJson;
		if(year >= available_year.min && year <= available_year.max){
			var available_month = this.getMonth(year);
			if(month >= available_month.min && month <= available_month.max){
				var available_day = this.getDay(year, month);
				if(day >= available_day.min && day <= available_day.max){
					var available_hour = this.getHour(year, month, day);
					if(hour >= available_hour.min && hour <= available_hour.max){

						if(year == sTJ.year && month == sTJ.month && day == sTJ.day && hour == sTJ.hour){
							return {
								min : sTJ.min,
								max : 60
							}
						}else if(year == eTJ.year && month == eTJ.month && day == eTJ.day && hour == eTJ.hour){
							return {
								min : 1,
								max : eTJ.min
							}
						}else{
							return {
								min : 1,
								max : 60
							}
						}

					}else{
						throw new Error('传入的小时不在可选的范围内');
					}
					
				}else{
					throw new Error('传入的天不在可选的范围内');
				}
			}else{
				throw new Error('传入的月份不在可选的范围内');
			}
		}else{
			throw new Error('传入的年份不在可选的范围内');
		}
	},
	/** 
	 * @desc 根据年份,月份,日,小时，分钟 获取可用的秒
	 * @param (number) year : 四位年份
	 * @param (number) month : 月份
	 * @param (number) day : 天
	 * @param (number) hour : 小时
	 * @param (number) min : 分钟
	 * @return (Object-json) {min,max}
	 */
	getSec : function(year, month, day, hour, min){
		var available_year = this.getYear(),
			sTJ = this.startTimeJson,
			eTJ = this.endTimeJson;
		if(year >= available_year.min && year <= available_year.max){
			var available_month = this.getMonth(year);
			if(month >= available_month.min && month <= available_month.max){
				var available_day = this.getDay(year, month);
				if(day >= available_day.min && day <= available_day.max){
					var available_hour = this.getHour(year, month, day);
					if(hour >= available_hour.min && hour <= available_hour.max){
						var available_min = this.getMin(year, month, day, hour);
						if(min >= available_min.min && min <= available_min.max){
							if(year == sTJ.year && month == sTJ.month && day == sTJ.day && hour == sTJ.hour && min == sTJ.min){
								return {
									min : sTJ.sec,
									max : 60
								}
							}else if(year == eTJ.year && month == eTJ.month && day == eTJ.day && hour == eTJ.hour && min == eTJ.min){
								return {
									min : 1,
									max : eTJ.sec
								}
							}else{
								return {
									min : 1,
									max : 60
								}
							}
						}else{
							throw new Error('传入的分钟不在可选的范围内');
						}
					}else{
						throw new Error('传入的小时不在可选的范围内');
					}
					
				}else{
					throw new Error('传入的天不在可选的范围内');
				}
			}else{
				throw new Error('传入的月份不在可选的范围内');
			}
		}else{
			throw new Error('传入的年份不在可选的范围内');
		}
	},
	/** 
	 * @desc 解析时间字符串
	 * @param (String) timestr : 时间字符串（例如："2015/04/29 12:34:08"）
	 * @return (Object-json) : {year,month,day,hour,min,sec}
	 */
	parseTimeStr : function(timestr){
		var allArr = timestr.split(' '),
			dateArr = allArr[0].split('/'),
			timeArr = allArr[1] && allArr[1].split(':');

		return {
			year : parseInt(dateArr ? (dateArr[0] ? dateArr[0] : 0) : 0),
			month : parseInt(dateArr ? (dateArr[1] ? dateArr[1] : 0) : 0),
			day : parseInt(dateArr ? (dateArr[2] ? dateArr[2] : 0) : 0),
			hour : parseInt(timeArr ? (timeArr[0] ? timeArr[0] : 0) : 0),
			min : parseInt(timeArr ? (timeArr[1] ? timeArr[1] : 0) : 0),
			sec : parseInt(timeArr ? (timeArr[2] ? timeArr[2] : 0) : 0)
		};

	},
	/** 
	 * @desc 根据年月获取本月天数
	 * @param (number) year : 四位年份
	 * @param (number) month : 月份
	 * @return (number) : 天数
	 */
	getDaysInMonth : function(year, month){ 
		month = parseInt(month,10); //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。 
		var temp = new Date(year,month,0); 
		return temp.getDate(); 
	},
	/** 
	 * @desc 根据年月日获取星期几
	 * @param (number) dayValue : “2014-01-01”
	 * @return (number) : 星期数
	 */
	getWeekByDay : function(dayValue){ //dayValue=“2014-01-01”
        var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化 
        var today = new Array("周日","周一","周二","周三","周四","周五","周六"); //创建星期数组
        return today[day.getDay()];  //返一个星期中的某一天，其中0为星期日 
    }


});

Optionaltime.fn.init.prototype = Optionaltime.fn;

// 暴露接口
if(typeof module !== 'undefined' && module.exports){
	module.exports = Optionaltime;
}else{
	window.Optionaltime = Optionaltime;
}
