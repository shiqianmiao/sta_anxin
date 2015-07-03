
var Halert = require('widget/Halert/js/Halert.js');
var DateSel = exports;
DateSel.$ = require('zepto');
var $ = DateSel.$;


// 点击加号的操作方法
/**
 * @param (Boolean) label : 是否计算减免费用（true计算、false不计算）
 *
 */
DateSel.addCart = function(obj, label){
	var firstOrder = $('#sel-true').data('first_order');

	var serverAllNum = parseFloat($('.all-num').html());	// 服务的总数量
	var serverAllTime = parseFloat($('.all-hour').html());	// 服务的总时间
	var serverAllMoney = parseFloat($('.all-money').html());	// 服务的总价钱

	var cartAllNum = parseFloat($('.num').html());		// 结算车的服务总数量
	var cartAllTime = 0;	// 结算车的服务总时间
	var cartAllMoney = parseFloat($('.money').html()).toFixed(2);	// 结算车的服务总价钱

	var breaksMoney = 0;	// 减免费用总额


	var type = $(obj).data('type');
	var _this = obj;
	// 获取用户操作的父级元素
	var parent = $(_this).parents('.per-server');

	// 获取用户点击服务的价钱
	var clickMoney = parseFloat($(parent).find('.per-money').html()).toFixed(2);
	var clickMoneyNext = parseFloat($(parent).data('next_price')).toFixed(2);
	// 获取用户点击服务用时
	var clickTime = parseFloat($(parent).find('.per-time').html());

	// 获取用户点击服务的当前所选数量
	var clickServNum = parseFloat($(parent).find('.per-num').html());
	// 第一次点击加号的初始数量，在业务中代表服务的起订数量
	var dataStart = parseFloat($(parent).data('start'));

	if(type == 'remove' && clickServNum <= 0){
		return false;
	}

	var firstBool = clickServNum < dataStart;
	var secBool = clickServNum <= dataStart;

	type == 'add' ? (firstBool ? clickServNum += dataStart : clickServNum++) : (secBool ? clickServNum = 0 : clickServNum--);
	$(parent).find('.per-num').html(clickServNum);	// 数量加一
	// 服务总数量累加
	type == 'add' ? (firstBool ? serverAllNum += dataStart : serverAllNum++) : (secBool ? serverAllNum -= dataStart : serverAllNum--);
	$('.all-num').html(serverAllNum);	// 赋值

	//结算车总数量累加
	type == 'add' ? (firstBool ? cartAllNum += dataStart : cartAllNum++) : (secBool ? cartAllNum -= dataStart : cartAllNum--);
	$('.num').html(cartAllNum);	// 赋值

	// 服务总用时累加
	type == 'add' ? (firstBool ? serverAllTime += (clickTime * dataStart) : serverAllTime += clickTime) : (secBool ? serverAllTime -= (clickTime * dataStart) : serverAllTime -= clickTime);
	$('.all-hour').html(serverAllTime);	// 赋值

	// 服务总价钱累加
	type == 'add' ? (firstBool ? serverAllMoney = parseFloat(DateSel.accAdd(serverAllMoney,clickMoney * dataStart)).toFixed(2)
							   : serverAllMoney = parseFloat(DateSel.accAdd(serverAllMoney,clickMoneyNext)).toFixed(2))
				  : (secBool ? serverAllMoney = parseFloat(DateSel.accSub(clickMoney * dataStart, serverAllMoney)).toFixed(2)
				  			 : serverAllMoney = parseFloat(DateSel.accSub(clickMoneyNext, serverAllMoney)).toFixed(2));

	// 如果是首单，不修改价格
	if(!firstOrder){
		$('.all-money').html(serverAllMoney);
	}

	if(label){
		// 结算车的总价钱计算 = serverAllMoney - 减免费用
		// 获取减免费用总额
		$('.breaks-money').each(function(){
			breaksMoney += parseFloat($(this).html());
		});
		// 结算车总价钱计算
		cartAllMoney = serverAllMoney - breaksMoney;
	}else{
		cartAllMoney = serverAllMoney;
	}
	if(cartAllMoney < 0){
		cartAllMoney = 0;
	}

	// 如果是首单，不修改价格
	if(!firstOrder){
		$('.money').html(parseFloat(cartAllMoney).toFixed(2)); // 赋值
	}

	// 显示购物车
	if(parseFloat($('.all-money').html()) > 0){
		$('#sel-true').show();
		$('#sel-false').hide();
	}
	// 隐藏购物车
	if(parseFloat($('.all-money').html()) <= 0){
		$('#sel-true').hide();
		$('#sel-false').show();
	}

	breaksMoney = 0; // 减免清零,很重要，不清零的减免每次都会累加

	if(clickServNum <= 0){
		$(parent).find('.remove').css({color:'#999999'});
	}else{
		$(parent).find('.remove').css({color:'#ff4500'});
	}
}

DateSel.accAdd = function(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return parseFloat((arg1*m+arg2*m)/m);
}
//减法函数
DateSel.accSub = function(arg1,arg2){
     var r1,r2,m,n;
     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
     m=Math.pow(10,Math.max(r1,r2));
     //last modify by deeka
     //动态控制精度长度
     n=(r1>=r2)?r1:r2;
     return parseFloat(((arg2*m-arg1*m)/m).toFixed(n));
}
//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
DateSel.accMul = function(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}

// 阻止页面滚动
DateSel.noScroll = function(){
	// 弹出遮罩时，防止页面滚动
	$('#content').css({height:$(window).height() - 120 + 'px', overflow:"hidden"});
}
// 让页面滚动
DateSel.toScroll = function(){
	// 弹出遮罩时，防止页面滚动
	$('#content').css({height:'auto', overflow:"auto"});
}

// 选择时间的方法
DateSel.selectDate = function(type, clickBtn, callBack){
	// 展开处理,与初始化处理
	if($(clickBtn).data('type') == 'year'){
		$('.year-list').css({width:"100%",borderRight:"none"});
	}else if($(clickBtn).data('type') == 'month'){
		$('.year-list').css({width:"25%",borderRight:"1px solid #b9babb"});
		$('.month-list').css({width:"75%",borderRight:"none"});

	}else if($(clickBtn).data('type') == 'day'){
		$('.year-list').css({width:"25%",borderRight:"1px solid #b9babb"});
		$('.month-list').css({width:"25%",borderRight:"1px solid #b9babb"});
		$('.day-list').css({width:"50%",borderRight:"none"});
	}
	// 创建年份
	var myDate = new Date();
	var thisYear = myDate.getFullYear();	// 当前的年份
	// 创建之前清空节点
	$('.year-list').empty();
	// 创建后20年
	var endYear = thisYear + 2;
	var yearStr = '';
	for(j = thisYear; j < endYear; j++){
		yearStr += '<li>' + j + '</li>';
	}
	$('.year-list').append($(yearStr));

	// 点击 年、月、日、小时，的时候
	$('.con-time li').on('click', function(){
		toSel($(this));
	});
	function toSel(obj){
		var _this = $(obj);
		// 今年
		var curYear = new Date().getFullYear();
		// 今月
		var curMonth = new Date().getMonth();
		// 今日
		var curDay = myDate.getDate();
		// 今时
		var curHours = myDate.getHours();
		// 今分
		var curMins = myDate.getMinutes();


		// 获取点击的是谁，年？月？日？小时？
		var who = $(_this).parent().attr('class');
		// 样式改变
		$('.' + who + ' li').removeClass('active');
		$(_this).addClass('active');
		// 缩短年份选择框

		// 伸长下一个选择框
		// 获取下一个
		var next = '';
		if(who == 'year-list'){

			next = '.month-list';
			$(next).css({width:"75%"});
			$('.time-win-title').html('请选择月份');
			if(type == 'year'){
				// 返回json数据，存储用户选择的时间

				var dateJson = DateSel.getDateReturn();
				if(callBack){
					callBack(dateJson);
				}
			}else{
				$('.' + who).css({width:"25%",borderRight:"1px solid #b9babb"});
			}
			// 动态创建月份
			// 创建之前清空节点
			$(next).empty();
			var monthStr = '';
			// 检测点击的年份是不是当年。如果是当年，就要检测月份，不要让用户选择国务的月份
			if(parseInt($(_this).html()) == curYear){
				// 说明点击的就是今年，那么就要获取当前月份
				var curM = curMonth + 1; // 当前月份
				for(var m = 0; m < 12; m++){
					if(m < curM - 1){
						monthStr += '<li class="no">' + (m + 1) + '</li>'
					}else{
						monthStr += '<li class="yes">' + (m + 1) + '</li>'
					}
				}

			}else{
				// 不是点击当前年份，那么就正常创建12个月份
				for(var m = 0; m < 12; m++){
					monthStr += '<li class="yes">' + (m + 1) + '</li>'
				}
			}

			$(next).append($(monthStr));
			// 回调
			$(next + ' li.yes').on('click', function(){
				toSel($(this));
			});

		}else if(who == 'month-list'){
			next = '.day-list';
			$(next).css({width:"50%"});
			$('.time-win-title').html('请选择日');
			// 获取用户选择的年份月份和日
			var userY = parseInt($('.year-list .active').html());
			var userM = parseInt($('.month-list .active').html());
			var userD = parseInt($('.day-list .active').html());
			var Mdays = DateSel.getDaysInMonth(userY,userM);
			if(type == 'month'){
				// 返回json数据，存储用户选择的时间

				var dateJson = DateSel.getDateReturn();
				if(callBack){
					callBack(dateJson);
				}
			}else{
				$('.' + who).css({width:"25%",borderRight:"1px solid #b9babb"});
			}
			// js动态创建天数
			// 创建之前清楚节点
			$(next).empty();
			var dayStr = '';
			// 检测是否是当前年又是当前月，如果是，就要使过去了的天不可选
			if(userY == curYear && userM == curMonth + 1){
				for(var i = 0; i < Mdays; i++){
					if(i < 9){
						if(i < curDay - 1){
							dayStr += '<li class="no">0' + (i + 1) + '</li>';
						}else{
							if(i > curDay + 5){
								dayStr += '<li class="no">0' + (i + 1) + '</li>';
							}else{
								dayStr += '<li class="yes">0' + (i + 1) + '</li>';
							}
						}

					}else{
						if(i < curDay){
							dayStr += '<li class="no">' + (i + 1) + '</li>';
						}else{
							if(i > curDay + 5){
								dayStr += '<li class="no">' + (i + 1) + '</li>';
							}else{
								dayStr += '<li class="yes">' + (i + 1) + '</li>';
							}
						}
					}

				}
			}else{
				// 正常创建天
				for(var i = 0; i < Mdays; i++){
					if(i < 9){
						dayStr += '<li class="yes">0' + (i + 1) + '</li>';
					}else{
						dayStr += '<li class="yes">' + (i + 1) + '</li>';
					}

				}
			}

			$(next).append($(dayStr));
			// 回调
			$(next + ' li.yes').on('click', function(){
				toSel($(this));
			});
		}else if(who == 'day-list'){
			next = '.hours-list';
			$(next).css({width:"25%"});
			$('.time-win-title').html('请选择小时');
			// 获取用户选择的年份月份和日
			var userY = parseInt($('.year-list .active').html());
			var userM = parseInt($('.month-list .active').html());
			var userD = parseInt($('.day-list .active').html());

			if(type == 'day'){
				// 返回json数据，存储用户选择的时间

				var dateJson = DateSel.getDateReturn();

				if(callBack){
					callBack(dateJson);
				}
			}else{
				$('.' + who).css({width:"25%",borderRight:"1px solid #b9babb"});
			}

			// js动态创建小时, 从早8：00 - 20：00，创建的时间间隔是半个小时
			var hoursStr = '';
			// 创建之前移除节点
			$(next).empty();
			// 检测是否是当前年又是当前月，又是当前日，如果是，就要使过去了的小时不可选
			if(userY == curYear && userM == curMonth + 1 && userD == curDay){
				for(var h = 0; h < 25; h++){
					// 今天过去了的时间不可选
					if(30 * h + 480 < curMins + curHours * 60){
						hoursStr += '<li class="no">' + DateSel.mintoHours(30 * h + 480) + '</li>';
					}else{
						hoursStr += '<li class="yes">' + DateSel.mintoHours(30 * h + 480) + '</li>';
					}

				}
			}else{
				// 正常创建小时
				for(var h = 0; h < 25; h++){
					hoursStr += '<li class="yes">' + DateSel.mintoHours(30 * h + 480) + '</li>';

				}
			}
			$(next).append($(hoursStr));
			// 回调
			$(next + ' li.yes').on('click', function(){
				toSel($(this));
			});
		}else{
			if(type == 'hours'){
				// 返回json数据，存储用户选择的时间

				var dateJson = DateSel.getDateReturn();
				if(callBack){
					callBack(dateJson);
				}
			}else{
				$('.' + who).css({width:"25%",borderRight:"1px solid #b9babb"});
			}
		}

	}
}

// 获取用户选择的时间并返回的数据
DateSel.getDateReturn = function(){
	// 当前点击的是小时，插入时间，关闭弹窗
	DateSel.closeTimeWin();
	// $('.year').html($('.year-list .active').html());
	// $('.month').html($('.month-list .active').html());
	// $('.day').html($('.day-list .active').html());
	// $('.hours').html($('.hours-list .active').html());
	return {
		year : $('.year-list .active').html(),
		month : $('.month-list .active').html(),
		day : $('.day-list .active').html(),
		hours : $('.hours-list .active').html()
	};
}

// 将分钟转换成小时的函数
DateSel.mintoHours = function(mins){
	if(mins%60 == 0){
		return (mins/60>>0)+":00";
	}else{
		return (mins/60>>0)+":"+(mins%60);
	}

}

// 关闭时间弹窗的方法、
DateSel.closeTimeWin = function(){
	$('#mark').hide();
	$('#time-win').hide();
	// 释放页面
	DateSel.toScroll();
}

// 根据年月获取本月天数的函数
DateSel.getDaysInMonth = function(year,month){
	month = parseInt(month,10);
	var temp = new Date(year,month,0);
	return temp.getDate();
}

// 创建小时的方法
DateSel.createHour = function(todayMark, initHourMark){
    $('.hour-list').empty();
    var oDate = new Date();
    var cur_hour = oDate.getHours() + 2; // 0-23 // 业务规定1小时后
    var cur_min = oDate.getMinutes(); // 0-59
    var cur_all_min = cur_hour * 60 + cur_min;
    var hour_str = '';
    if(todayMark){
        // 今天
        for(var i = 480; i <= 1200; i += 30){
            var hour = parseInt(i / 60);
            var min = i % 60;
            if(min == 0){
                min = '00';
            }
            if(hour < 10){
                if(i <= cur_all_min){
                    hour_str += '<li class="no" data-time="' + hour + '">' + '0' + hour + ':' + min + '</li>';
                }else{
                    hour_str += '<li class="yes" data-time="' + hour + '">' + '0' + hour + ':' + min + '</li>';
                }

            }else{
                if(i <= cur_all_min){
                    hour_str += '<li class="no" data-time="' + hour + '">' + hour + ':' + min + '</li>';
                }else{
                    hour_str += '<li class="yes" data-time="' + hour + '">' + hour + ':' + min + '</li>';
                }
            }

        }
        if(!initHourMark){
        	// 如果选择的是今天，将时间初始化为最近可用时间
	        for(var i = 480; i <= 1200; i += 30){
	            if(i >= cur_all_min){
	                var hour = parseInt(i / 60);
	                var min = i % 60;
	                if(min == 0){
	                    min = '00';
	                }
	                if(hour < 10){
	                    $('.hours').html('0' + hour + ':' + min);
	                }else{
	                    $('.hours').html( hour + ':' + min);
	                }

	                break;
	            }
	        }
        }

    }else{
        // 非今天
        for(var i = 480; i <= 1200; i += 30){
            var hour = parseInt(i / 60);
            var min = i % 60;
            if(min == 0){
                min = '00';
            }
            if(hour < 10){
                hour_str += '<li class="yes" data-time="' + hour + '">' + '0' + hour + ':' + min + '</li>';
            }else{
                hour_str += '<li class="yes" data-time="' + hour + '">' + hour + ':' + min + '</li>';
            }

        }
        if(!initHourMark){
	        // 初始化时间为08:00
	        $('.hours').html('08:00');
	    }
    }

    $('.hour-list').append($(hour_str));

    $('.yes').click(function(){
        $('#mark').hide();
        $('#hour-win').hide();

        $('.hours').html($(this).html());
    });
}
